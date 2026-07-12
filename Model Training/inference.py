"""
inference.py – SBOM Risk Inference Script
Usage: python inference.py <input_json_path>

Reads a JSON array of filtered (production-only) dependencies,
engineers the same features as train.ipynb, runs the CatBoost model,
and prints a JSON result to stdout.

Expected input JSON shape (array of objects):
[
  {
    "library": "log4j-core",
    "version": "2.14.1",
    "cvss_score": 10.0,
    "has_cve": 1,
    "patch_available": 1,
    "business_score": 3,
    "maintenance_score": 20,
    "dependency_depth": 1,
    "is_direct": 1,
    "is_transitive": 0,
    "application_usage": 5,
    "pagerank": 0.05,
    "betweenness": 0.01,
    "indegree": 2,
    "outdegree": 0,
    "compatible_with_proprietary": true
  },
  ...
]

Missing optional fields are filled with safe defaults.
"""

import sys
import json
import math
import pathlib
import numpy as np

MODEL_PATH = pathlib.Path(__file__).parent / "models" / "best_model_CatBoost.joblib"

FEATURE_COLUMNS = [
    "cvss_score", "cvss_squared", "has_cve", "patch_available",
    "business_score", "maintenance_score", "dependency_depth",
    "is_direct", "is_transitive", "application_usage",
    "pagerank", "betweenness", "indegree", "outdegree",
    "critical_dependency", "license_problem",
    "maintenance_problem", "needs_patch"
]

DEFAULTS = {
    "cvss_score": 0.0,
    "has_cve": 0,
    "patch_available": 0,
    "business_score": 1,
    "maintenance_score": 0,
    "dependency_depth": 1,
    "is_direct": 1,
    "is_transitive": 0,
    "application_usage": 1,
    "pagerank": 0.0,
    "betweenness": 0.0,
    "indegree": 0,
    "outdegree": 0,
    "compatible_with_proprietary": True,
}

RISK_LABELS = {0: "Safe", 1: "Risky"}


def engineer_features(dep):
    cvss = float(dep.get("cvss_score", DEFAULTS["cvss_score"]) or 0)
    has_cve = int(dep.get("has_cve", DEFAULTS["has_cve"]) or 0)
    patch = int(dep.get("patch_available", DEFAULTS["patch_available"]) or 0)
    biz = float(dep.get("business_score", DEFAULTS["business_score"]) or 1)
    maint = float(dep.get("maintenance_score", DEFAULTS["maintenance_score"]) or 0)
    depth = int(dep.get("dependency_depth", DEFAULTS["dependency_depth"]) or 1)
    is_direct = int(dep.get("is_direct", DEFAULTS["is_direct"]) or 0)
    is_trans = int(dep.get("is_transitive", DEFAULTS["is_transitive"]) or 0)
    app_usage = int(dep.get("application_usage", DEFAULTS["application_usage"]) or 1)
    pagerank = float(dep.get("pagerank", DEFAULTS["pagerank"]) or 0)
    betweenness = float(dep.get("betweenness", DEFAULTS["betweenness"]) or 0)
    indegree = int(dep.get("indegree", DEFAULTS["indegree"]) or 0)
    outdegree = int(dep.get("outdegree", DEFAULTS["outdegree"]) or 0)
    compatible = bool(dep.get("compatible_with_proprietary", DEFAULTS["compatible_with_proprietary"]))

    # Engineered features (same as train.ipynb)
    cvss_squared = cvss ** 2
    critical_dependency = int(biz >= 3 and cvss >= 7)
    license_problem = int(not compatible)
    maintenance_problem = int(maint >= 60)
    needs_patch = int(has_cve == 1 and patch == 1)

    return [
        cvss, cvss_squared, has_cve, patch,
        biz, maint, depth,
        is_direct, is_trans, app_usage,
        pagerank, betweenness, indegree, outdegree,
        critical_dependency, license_problem,
        maintenance_problem, needs_patch
    ]


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python inference.py <input_json_path>"}))
        sys.exit(1)

    input_path = sys.argv[1]

    try:
        with open(input_path, "r", encoding="utf-8") as f:
            deps = json.load(f)
    except Exception as e:
        print(json.dumps({"error": f"Failed to read input: {e}"}))
        sys.exit(1)

    if not isinstance(deps, list) or len(deps) == 0:
        print(json.dumps({"error": "Input must be a non-empty JSON array of dependencies"}))
        sys.exit(1)

    try:
        import joblib
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {e}"}))
        sys.exit(1)

    # Build feature matrix
    X = np.array([engineer_features(d) for d in deps], dtype=float)

    # Predict
    try:
        preds = model.predict(X).tolist()
        try:
            probs = model.predict_proba(X).tolist()
        except Exception:
            probs = [[0.0, 0.0]] * len(deps)
    except Exception as e:
        print(json.dumps({"error": f"Model prediction failed: {e}"}))
        sys.exit(1)

    # Build output
    results = []
    risky_count = 0
    for i, dep in enumerate(deps):
        label_idx = int(preds[i])
        risk_label = RISK_LABELS.get(label_idx, "Unknown")
        prob_risky = round(float(probs[i][1]) if len(probs[i]) > 1 else 0.0, 4)

        if risk_label == "Risky":
            risky_count += 1

        results.append({
            "library": dep.get("library") or dep.get("name", f"dep-{i}"),
            "version": str(dep.get("version", "?")),
            "risk_label": risk_label,
            "risk_probability": prob_risky,
            "cvss_score": dep.get("cvss_score", 0),
            "has_cve": dep.get("has_cve", 0),
            "patch_available": dep.get("patch_available", 0),
        })

    # Sort risky first
    results.sort(key=lambda r: (-r["risk_probability"], r["library"]))

    summary = {
        "total": len(results),
        "risky": risky_count,
        "safe": len(results) - risky_count,
        "risky_pct": round(risky_count / max(len(results), 1) * 100, 1)
    }

    print(json.dumps({"success": True, "summary": summary, "results": results}))


if __name__ == "__main__":
    main()

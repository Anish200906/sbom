# Cyclops SBOM - Software Bill of Materials & Risk Predictor

Cyclops SBOM is a full-stack security dashboard designed to parse Software Bill of Materials (SBOM) records, analyze dependency trees, identify software license compliance issues, audit security vulnerabilities (CVEs), and run machine learning predictions to classify component-level risks.

---

## 💡 Core Capabilities Explained

- **SBOM Import & Component Registry:** The system ingests standard Software Bills of Materials (SBOMs). It maps dependency trees and tracks components across multiple user projects, separating direct from transitive libraries.
- **Security & Vulnerability Auditing:** Cross-references installed libraries against a localized CVE vulnerability dataset (`issues.db`). It details CVSS severity scores, security advisories, and flags whether patch releases are available for remediations.
- **License Compliance Verification:** Scans component licenses against legal guidelines (`licenses.db`). It automatically determines if a library's license terms (e.g., GPL copyleft, MIT permissive) are compatible with proprietary business codebases.
- **Graph Topology Analysis:** Calculates structural graph properties for all libraries—including PageRank, betweenness centrality, and in-degree/out-degree counts—identifying critical single-points-of-failure in your dependency graphs.
- **AI Risk Inference (CatBoost Model):** Integrates a CatBoost classifier. When inspecting dependencies, the backend extracts CVSS metrics, license flags, update history, and graph centrality values, calling `inference.py` to classify libraries as **Safe** or **Risky** with predictive intelligence.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **Python 3.x** (with `numpy` and `joblib` installed to run the CatBoost model engine)

### Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both the frontend developer server and backend Express server concurrently with a single command:
   ```bash
   npm start
   ```

- **Frontend Application URL:** [http://localhost:5173/](http://localhost:5173/)
- **Backend Express Server:** [http://localhost:5000](http://localhost:5000)

> [!NOTE]
> When signing in, use the default demo credentials provided below:
> - **Email:** `byewind@example.com`
> - **Password:** `password123`

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Vanilla CSS
- **Navigation:** Client-side custom state navigation

### Backend
- **Framework:** Express (Node.js)
- **Database Engine:** SQLite 3 (using four separate database files)
- **Middlewares:** CORS, JSON body parser

### Machine Learning & Data Engine
- **Inference Script:** CatBoost-based classification runner written in Python (`Model Training/inference.py`).
- **Input Data Schema:** Rich features including CVSS scores, package-graph metrics (PageRank, betweenness centrality, degree), application usage statistics, and license compatibility indicators.

---

## 📂 Database Structure

The project separates database domains into four standalone physical databases in the root folder:

- **`users.db`**: Stores account credentials, user profiles, active workspace projects, and upload/export action histories.
- **`dependencies.db`**: Stores all catalogued software packages, resolved ecosystems, and dependency trees.
- **`issues.db`**: Tracks security vulnerability listings (CVE logs, severity scores, and patching details).
- **`licenses.db`**: Manages copyright notices, software licensing policies, and proprietary software compatibility checks.

---

## 💻 Project Layout

```
├── Model Training/         # Machine learning scripts, dataset files, and models
│   ├── Dataset/            # Datasets for CVEs, licensing, and graphs
│   ├── models/             # joblib-serialized ML classifiers
│   ├── inference.py        # Python script called on-demand to run prediction checks
│   └── train.ipynb         # Model research and training notebook
├── src/                    # Frontend React source code
│   ├── pages/              # Application dashboards and page modules
│   ├── App.jsx             # Main routing shell and auth interface
│   ├── data.js             # Local mock and helper configurations
│   ├── db.js               # Frontend auth API helpers
│   └── styles.css          # Core CSS stylesheet
├── server.cjs              # Main Express API and SQLite database engine
├── start.cjs               # Concurrent process launcher utility
├── package.json            # NPM configuration and dependencies
└── parse_sbom.cjs          # Standalone SBOM JSON parsing CLI utility
```

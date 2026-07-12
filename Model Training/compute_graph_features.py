import json
import networkx as nx
import pandas as pd
from pathlib import Path

def main():
    DATA_DIR = Path(__file__).parent / "Dataset" / "problem_10"
    APPLICATION_FILE = DATA_DIR / "applications.json"
    SBOM_FILE = DATA_DIR / "sbom_dependencies.csv"
    TRANSITIVE_FILE = DATA_DIR / "transitive_dependencies.json"

    if not APPLICATION_FILE.exists() or not SBOM_FILE.exists() or not TRANSITIVE_FILE.exists():
        print("Missing dataset files.")
        return

    applications = pd.read_json(APPLICATION_FILE)
    if "app_id" in applications.columns:
        applications = applications.rename(columns={"app_id": "application_id"})

    sbom = pd.read_csv(SBOM_FILE)
    transitive = pd.read_json(TRANSITIVE_FILE)

    dependency_graph = nx.DiGraph()

    for _, row in applications.iterrows():
        dependency_graph.add_node(
            row["application_id"],
            node_type="application"
        )

    for _, row in sbom.iterrows():
        library_node = f'{row["library"]}:{row["version"]}'
        if not dependency_graph.has_node(library_node):
            dependency_graph.add_node(
                library_node,
                node_type="library",
                library=row["library"],
                version=row["version"]
            )
        dependency_graph.add_edge(
            row["application_id"],
            library_node
        )

    for _, row in transitive.iterrows():
        parent = f'{row["parent_library"]}:{row["parent_version"]}'
        child = f'{row["child_library"]}:{row["child_version"]}'

        if not dependency_graph.has_node(parent):
            dependency_graph.add_node(parent, node_type="library", library=row["parent_library"], version=row["parent_version"])
        if not dependency_graph.has_node(child):
            dependency_graph.add_node(child, node_type="library", library=row["child_library"], version=row["child_version"])

        dependency_graph.add_edge(parent, child)

    pagerank = nx.pagerank(dependency_graph)
    betweenness = nx.betweenness_centrality(dependency_graph)
    indegree = dict(dependency_graph.in_degree())
    outdegree = dict(dependency_graph.out_degree())

    features = {}
    for node, attr in dependency_graph.nodes(data=True):
        if ":" in node:
            parts = node.split(":", 1)
            lib = parts[0].lower()
            ver = parts[1] if len(parts) > 1 else ""
            
            key = f"{lib}:{ver}"
            features[key] = {
                "pagerank": pagerank.get(node, 0.0),
                "betweenness": betweenness.get(node, 0.0),
                "indegree": indegree.get(node, 0),
                "outdegree": outdegree.get(node, 0)
            }

    with open(DATA_DIR / "graph_features.json", "w") as f:
        json.dump(features, f, indent=2)
    print("Graph features computed successfully!")

if __name__ == "__main__":
    main()

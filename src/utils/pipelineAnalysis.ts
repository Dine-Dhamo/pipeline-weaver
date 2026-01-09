// Pipeline validation utilities

interface Node {
  id: string;
  data: {
    nodeType: string;
    [key: string]: any;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface PipelineAnalysis {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

/**
 * Check if the pipeline forms a Directed Acyclic Graph (DAG)
 * Uses depth-first search to detect cycles
 */
export function analyzePipeline(
  nodes: Node[],
  edges: Edge[]
): PipelineAnalysis {
  const numNodes = nodes.length;
  const numEdges = edges.length;

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source);
    if (neighbors) {
      neighbors.push(edge.target);
    }
  });

  // Check for cycles using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  let isDag = true;
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        isDag = false;
        break;
      }
    }
  }

  return {
    num_nodes: numNodes,
    num_edges: numEdges,
    is_dag: isDag,
  };
}

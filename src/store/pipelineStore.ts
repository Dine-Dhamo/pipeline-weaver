import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from "reactflow";

interface NodeIDs {
  [key: string]: number;
}

interface PipelineState {
  nodes: Node[];
  edges: Edge[];
  nodeIDs: NodeIDs;
  getNodeID: (type: string) => string;
  addNode: (node: Node) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => void;
  updateNodeSize: (nodeId: string, width?: number, height?: number) => void;
  getNodes: () => Node[];
  getEdges: () => Edge[];
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  getNodeID: (type: string) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            height: 20,
            width: 20,
          },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue },
          };
        }
        return node;
      }),
    });
  },

  updateNodeSize: (nodeId: string, width?: number, height?: number) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            style: {
              ...node.style,
              ...(width !== undefined && { width }),
              ...(height !== undefined && { height }),
            },
          };
        }
        return node;
      }),
    });
  },

  getNodes: () => get().nodes,
  getEdges: () => get().edges,
}));

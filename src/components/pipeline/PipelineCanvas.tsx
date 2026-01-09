import React, { useRef, useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  ConnectionLineType,
  ReactFlowInstance,
} from "reactflow";
import { usePipelineStore } from "@/store/pipelineStore";
import { shallow } from "zustand/shallow";
import NodeRenderer from "@/nodes/NodeRenderer";
import { NODE_CONFIG } from "@/nodes/config/nodeConfigs";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  generic: NodeRenderer,
};

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    usePipelineStore(selector, shallow);

  const getInitNodeData = (nodeID: string, type: string) => {
    return { id: nodeID, nodeType: type };
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const dataStr = event.dataTransfer.getData("application/reactflow");

      if (!dataStr) return;

      try {
        const appData = JSON.parse(dataStr);
        const type = appData?.nodeType;

        if (!type) return;

        const config = NODE_CONFIG[type];
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type: "generic",
          position,
          data: getInitNodeData(nodeID, type),
          style: {
            width: config?.meta.defaultSize.width,
            height: config?.meta.defaultSize.height,
          },
        };

        addNode(newNode);
      } catch (e) {
        console.error("Failed to parse node data:", e);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={gridSize}
          size={1}
          color="hsl(var(--canvas-grid))"
        />
        <Controls className="!bg-card !border-border" />
        <MiniMap
          nodeColor={(node) => {
            const config = NODE_CONFIG[node.data?.nodeType];
            return config ? "hsl(var(--primary))" : "hsl(var(--muted))";
          }}
          maskColor="hsl(var(--background) / 0.8)"
          className="!bg-card !border !border-border"
        />
      </ReactFlow>
    </div>
  );
};

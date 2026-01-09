import React from "react";
import { DraggableNode } from "./DraggableNode";
import { NODE_CONFIG } from "@/nodes/config/nodeConfigs";

export const PipelineToolbar: React.FC = () => {
  const toolbarNodes = Object.entries(NODE_CONFIG).filter(
    ([_, config]) => config.meta.showInToolBar
  );

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-foreground">Nodes</span>
        <span className="text-xs text-muted-foreground">
          Drag to canvas to add
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {toolbarNodes.map(([type, config]) => (
          <DraggableNode
            key={type}
            type={type}
            label={config.meta.title}
            icon={config.meta.icon}
            color={config.meta.color}
          />
        ))}
      </div>
    </div>
  );
};

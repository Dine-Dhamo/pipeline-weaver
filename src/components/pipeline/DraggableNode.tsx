import React from "react";
import { cn } from "@/lib/utils";

interface DraggableNodeProps {
  type: string;
  label: string;
  icon?: string;
  color?: string;
}

const colorMap: Record<string, string> = {
  "node-input": "hover:border-success/50 hover:bg-success/5",
  "node-output": "hover:border-accent/50 hover:bg-accent/5",
  "node-llm": "hover:border-warning/50 hover:bg-warning/5",
  "node-text": "hover:border-primary/50 hover:bg-primary/5",
  "node-math": "hover:border-node-math/50 hover:bg-node-math/5",
  "node-api": "hover:border-info/50 hover:bg-info/5",
  "node-switch": "hover:border-node-switch/50 hover:bg-node-switch/5",
  "node-logger": "hover:border-success/50 hover:bg-success/5",
  "node-delay": "hover:border-node-delay/50 hover:bg-node-delay/5",
};

export const DraggableNode: React.FC<DraggableNodeProps> = ({
  type,
  label,
  icon,
  color = "node-text",
}) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    const appData = { nodeType };
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const hoverClass = colorMap[color] || "hover:border-primary/50 hover:bg-primary/5";

  return (
    <div
      className={cn(
        "cursor-grab active:cursor-grabbing",
        "flex flex-col items-center justify-center gap-1",
        "min-w-[80px] h-[70px] px-3",
        "rounded-lg border border-border bg-card/50",
        "transition-all duration-200",
        "hover:shadow-lg hover:scale-105",
        hoverClass
      )}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="text-xs font-medium text-foreground/80">{label}</span>
    </div>
  );
};

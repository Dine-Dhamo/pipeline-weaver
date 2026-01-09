import React from "react";
import { Handle, Position } from "reactflow";

interface NodeHandleProps {
  id: string;
  type: "source" | "target";
  position: Position;
  label?: string;
  style?: React.CSSProperties;
}

export const NodeHandle: React.FC<NodeHandleProps> = ({
  id,
  type,
  position,
  label,
  style,
}) => {
  const isLeft = position === Position.Left;
  
  return (
    <>
      <Handle
        id={id}
        type={type}
        position={position}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          border: "2px solid",
          borderColor: type === "source" ? "hsl(var(--primary))" : "hsl(var(--accent))",
          backgroundColor: type === "source" ? "hsl(var(--primary))" : "hsl(var(--accent))",
          ...style,
        }}
      />
      {label && (
        <span
          className="absolute text-[10px] font-mono text-muted-foreground pointer-events-none whitespace-nowrap"
          style={{
            top: style?.top,
            transform: "translateY(-50%)",
            ...(isLeft ? { left: 16 } : { right: 16 }),
          }}
        >
          {label}
        </span>
      )}
    </>
  );
};

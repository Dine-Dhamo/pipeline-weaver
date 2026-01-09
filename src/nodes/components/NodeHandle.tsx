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
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: "2px solid",
          borderColor: type === "source" ? "hsl(var(--primary))" : "hsl(var(--accent))",
          backgroundColor: type === "source" ? "hsl(var(--primary))" : "hsl(var(--accent))",
          transform: "translateY(-50%)",
          ...style,
        }}
      />
      {label && (
        <span
          className="absolute text-[10px] font-mono text-muted-foreground pointer-events-none whitespace-nowrap"
          style={{
            top: `calc(${style?.top || '50%'} + 10px)`,
            ...(isLeft ? { left: -4, transform: 'translateX(-100%)' } : { right: -4, transform: 'translateX(100%)' }),
          }}
        >
          {label}
        </span>
      )}
    </>
  );
};

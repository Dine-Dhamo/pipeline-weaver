import React from "react";
import { cn } from "@/lib/utils";

interface NodeWrapperProps {
  title: string;
  icon?: string;
  color: string;
  children: React.ReactNode;
  className?: string;
}

const getBorderColor = (color: string): string => {
  const map: Record<string, string> = {
    "node-input": "hsl(var(--success))",
    "node-output": "hsl(var(--accent))",
    "node-llm": "hsl(var(--warning))",
    "node-text": "hsl(var(--primary))",
    "node-math": "hsl(var(--node-math))",
    "node-api": "hsl(var(--info))",
    "node-switch": "hsl(var(--node-switch))",
    "node-logger": "hsl(var(--success))",
    "node-delay": "hsl(var(--node-delay))",
  };
  return map[color] || "hsl(var(--primary))";
};

const getHeaderBg = (color: string): string => {
  const map: Record<string, string> = {
    "node-input": "rgba(34, 197, 94, 0.1)",
    "node-output": "rgba(139, 92, 246, 0.1)",
    "node-llm": "rgba(234, 179, 8, 0.1)",
    "node-text": "rgba(59, 130, 246, 0.1)",
    "node-math": "rgba(236, 72, 153, 0.1)",
    "node-api": "rgba(14, 165, 233, 0.1)",
    "node-switch": "rgba(249, 115, 22, 0.1)",
    "node-logger": "rgba(34, 197, 94, 0.1)",
    "node-delay": "rgba(168, 85, 247, 0.1)",
  };
  return map[color] || "rgba(59, 130, 246, 0.1)";
};

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  title,
  icon,
  color,
  children,
  className,
}) => {
  const borderColor = getBorderColor(color);
  const headerBg = getHeaderBg(color);

  return (
    <div
      className={cn(
        "node-wrapper min-w-[200px] rounded-lg overflow-hidden",
        "border border-border bg-card shadow-xl",
        "transition-all duration-200",
        "hover:shadow-2xl hover:shadow-primary/5",
        className
      )}
      style={{
        borderTop: `3px solid ${borderColor}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ backgroundColor: headerBg }}
      >
        {icon && <span className="text-base">{icon}</span>}
        <span className="font-semibold text-sm text-foreground">{title}</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">{children}</div>
    </div>
  );
};

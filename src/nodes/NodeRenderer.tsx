import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Position } from "reactflow";
import { NodeWrapper } from "./components/NodeWrapper";
import { NodeHandle } from "./components/NodeHandle";
import { RenderField } from "./fields/RenderField";
import { NODE_CONFIG, HandleConfig } from "./config/nodeConfigs";
import { extractVariables } from "./utils/extractVariables";
import { usePipelineStore } from "@/store/pipelineStore";

interface NodeRendererProps {
  id: string;
  data: {
    id: string;
    nodeType: string;
    [key: string]: any;
  };
}

const sideToPosition: Record<string, Position> = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const NodeRenderer: React.FC<NodeRendererProps> = ({ id, data }) => {
  const nodeType = data.nodeType;
  const config = NODE_CONFIG[nodeType];
  const updateNodeField = usePipelineStore((s) => s.updateNodeField);
  const updateNodeSize = usePipelineStore((s) => s.updateNodeSize);

  const [dynamicHandles, setDynamicHandles] = useState<HandleConfig[]>([]);

  // Initialize default values for fields
  useEffect(() => {
    if (!config) return;

    config.dataSchema.forEach((field) => {
      if (data[field.key] === undefined) {
        const defaultValue =
          typeof field.defaultValue === "function"
            ? field.defaultValue(id)
            : field.defaultValue;

        updateNodeField(id, field.key, defaultValue);
      }
    });
  }, [id, config, updateNodeField]);

  // Handle dynamic handles (e.g., variables in text)
  useEffect(() => {
    if (!config?.handles?.dynamic) {
      setDynamicHandles([]);
      return;
    }

    const { deriveFrom, pattern, side } = config.handles.dynamic;
    const sourceValue = data[deriveFrom];
    const variables = extractVariables(sourceValue, pattern);

    const newHandles: HandleConfig[] = variables.map((varName) => ({
      id: `var_${varName}`,
      side: side,
      label: varName,
    }));

    setDynamicHandles(newHandles);
  }, [data, config]);

  const handleResize = useCallback(
    (dimensions: { width?: number; height?: number }) => {
      if (dimensions.height) {
        updateNodeSize(id, undefined, dimensions.height);
      }
    },
    [id, updateNodeSize]
  );

  // Calculate handle positions for multiple handles on same side
  const calculateHandlePositions = useMemo(() => {
    const sourceHandles = config?.handles?.static?.sources || [];
    const targetHandles = config?.handles?.static?.targets || [];
    const allDynamicHandles = dynamicHandles;

    const leftHandles = [
      ...targetHandles.filter((h) => h.side === "left"),
      ...allDynamicHandles.filter((h) => h.side === "left"),
    ];
    const rightHandles = sourceHandles.filter((h) => h.side === "right");

    return { leftHandles, rightHandles };
  }, [config, dynamicHandles]);

  if (!config) {
    return (
      <div className="p-4 bg-destructive/20 rounded-lg border border-destructive">
        <span className="text-destructive text-sm">
          Unknown node type: {nodeType}
        </span>
      </div>
    );
  }

  const { leftHandles, rightHandles } = calculateHandlePositions;

  return (
    <NodeWrapper
      title={config.meta.title}
      icon={config.meta.icon}
      color={config.meta.color}
    >
      {/* Fields */}
      {config.dataSchema.map((field) => (
        <RenderField
          key={field.key}
          field={field}
          value={data[field.key]}
          nodeId={id}
          onChange={(val) => updateNodeField(id, field.key, val)}
          onResize={field.autoResize ? handleResize : undefined}
        />
      ))}

      {/* Static content */}
      {config.content && (
        <div className="text-xs text-muted-foreground italic">
          {config.content}
        </div>
      )}

      {/* Left handles (targets + dynamic) */}
      {leftHandles.map((handle, index) => {
        const totalHandles = leftHandles.length;
        const spacing = 100 / (totalHandles + 1);
        const topPercent = spacing * (index + 1);

        return (
          <NodeHandle
            key={handle.id}
            id={handle.id}
            type="target"
            position={Position.Left}
            label={handle.label}
            style={{ top: `${topPercent}%` }}
          />
        );
      })}

      {/* Right handles (sources) */}
      {rightHandles.map((handle, index) => {
        const totalHandles = rightHandles.length;
        const spacing = 100 / (totalHandles + 1);
        const topPercent = spacing * (index + 1);

        return (
          <NodeHandle
            key={handle.id}
            id={handle.id}
            type="source"
            position={Position.Right}
            label={handle.label}
            style={{ top: `${topPercent}%` }}
          />
        );
      })}
    </NodeWrapper>
  );
};

export default NodeRenderer;

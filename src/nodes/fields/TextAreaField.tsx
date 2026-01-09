import React, { useEffect, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onResize?: (dimensions: { width?: number; height?: number }) => void;
  autoResize?: boolean;
  placeholder?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  onResize,
  autoResize = false,
  placeholder,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastDimensionsRef = useRef({ height: 0 });

  const handleResize = useCallback(() => {
    if (!autoResize || !textareaRef.current || !onResize) return;

    const el = textareaRef.current;
    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    const newHeight = Math.max(80, scrollHeight);

    // Only trigger resize if height changed significantly
    if (Math.abs(lastDimensionsRef.current.height - newHeight) > 5) {
      lastDimensionsRef.current.height = newHeight;
      // Add padding for the node wrapper
      onResize({ height: newHeight + 120 });
    }

    el.style.height = `${newHeight}px`;
  }, [autoResize, onResize]);

  useEffect(() => {
    handleResize();
  }, [value, handleResize]);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Textarea
        ref={textareaRef}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[60px] text-sm bg-secondary/50 border-border focus:border-primary resize-none font-mono"
        style={{ overflow: "hidden" }}
      />
    </div>
  );
};

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="text"
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          // Allow numbers, decimals, and empty string
          if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
            onChange(val);
          }
        }}
        placeholder={placeholder}
        className="h-8 text-sm bg-secondary/50 border-border focus:border-primary font-mono"
      />
    </div>
  );
};

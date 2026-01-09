import React from "react";
import { FieldSchema } from "../config/nodeConfigs";
import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { TextAreaField } from "./TextAreaField";
import { NumberField } from "./NumberField";

interface RenderFieldProps {
  field: FieldSchema;
  value: any;
  nodeId: string;
  onChange: (value: any) => void;
  onResize?: (dimensions: { width?: number; height?: number }) => void;
}

export const RenderField: React.FC<RenderFieldProps> = ({
  field,
  value,
  nodeId,
  onChange,
  onResize,
}) => {
  const type = field.fieldType.toLowerCase();

  if (type === "textinput") {
    return (
      <TextField
        label={field.label}
        value={value ?? ""}
        onChange={onChange}
        placeholder={field.placeholder}
      />
    );
  }

  if (type === "selection") {
    return (
      <SelectField
        label={field.label}
        value={value ?? ""}
        options={field.options || []}
        onChange={onChange}
      />
    );
  }

  if (type === "textarea") {
    return (
      <TextAreaField
        label={field.label}
        value={value ?? ""}
        onChange={onChange}
        onResize={onResize}
        autoResize={field.autoResize}
        placeholder={field.placeholder}
      />
    );
  }

  if (type === "number") {
    return (
      <NumberField
        label={field.label}
        value={value ?? ""}
        onChange={onChange}
        placeholder={field.placeholder}
      />
    );
  }

  return null;
};

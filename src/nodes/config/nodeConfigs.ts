// Node Configuration Types
export interface FieldSchema {
  key: string;
  label: string;
  fieldType: "textinput" | "selection" | "textarea" | "number";
  defaultValue: string | number | ((id: string) => string);
  options?: string[];
  autoResize?: boolean;
  placeholder?: string;
}

export interface HandleConfig {
  id: string;
  side: "left" | "right" | "top" | "bottom";
  label?: string;
}

export interface DynamicHandleConfig {
  side: "left" | "right";
  deriveFrom: string;
  pattern: RegExp;
}

export interface NodeMeta {
  title: string;
  icon?: string;
  category?: string;
  color: string;
  defaultSize: { width: number; height: number };
  resizable: boolean;
  showInToolBar: boolean;
  description?: string;
}

export interface NodeConfig {
  meta: NodeMeta;
  dataSchema: FieldSchema[];
  handles: {
    static?: {
      sources?: HandleConfig[];
      targets?: HandleConfig[];
    };
    dynamic?: DynamicHandleConfig | false;
  };
  content?: string | null;
}

export interface NodeConfigMap {
  [key: string]: NodeConfig;
}

const INPUT_SELECTION_FIELDS = ["Text", "Image", "File", "Audio"];
const OUTPUT_SELECTION_FIELDS = [...INPUT_SELECTION_FIELDS, "JSON"];
const LLM_MODELS = ["GPT-4", "GPT-3.5", "Claude-3", "Gemini Pro", "Llama 3"];

export const NODE_CONFIG: NodeConfigMap = {
  customInput: {
    meta: {
      title: "Input",
      icon: "📥",
      category: "source",
      color: "node-input",
      defaultSize: { width: 240, height: 140 },
      resizable: false,
      showInToolBar: true,
      description: "Receive input data",
    },
    dataSchema: [
      {
        key: "name",
        label: "Name",
        fieldType: "textinput",
        defaultValue: (id: string) => id.replace("customInput-", "input_"),
        placeholder: "Enter input name...",
      },
      {
        key: "type",
        label: "Type",
        fieldType: "selection",
        options: INPUT_SELECTION_FIELDS,
        defaultValue: INPUT_SELECTION_FIELDS[0],
      },
    ],
    handles: {
      static: {
        sources: [{ id: "output", side: "right", label: "out" }],
      },
      dynamic: false,
    },
    content: null,
  },

  customOutput: {
    meta: {
      title: "Output",
      icon: "📤",
      category: "sink",
      color: "node-output",
      defaultSize: { width: 240, height: 140 },
      resizable: false,
      showInToolBar: true,
      description: "Output final results",
    },
    dataSchema: [
      {
        key: "name",
        label: "Name",
        fieldType: "textinput",
        defaultValue: (id: string) => id.replace("customOutput-", "output_"),
        placeholder: "Enter output name...",
      },
      {
        key: "type",
        label: "Type",
        fieldType: "selection",
        options: OUTPUT_SELECTION_FIELDS,
        defaultValue: OUTPUT_SELECTION_FIELDS[0],
      },
    ],
    handles: {
      static: {
        targets: [{ id: "input", side: "left", label: "in" }],
      },
      dynamic: false,
    },
    content: null,
  },

  llm: {
    meta: {
      title: "LLM",
      icon: "🤖",
      category: "processor",
      color: "node-llm",
      defaultSize: { width: 280, height: 180 },
      resizable: true,
      showInToolBar: true,
      description: "Large Language Model processing",
    },
    dataSchema: [
      {
        key: "model",
        label: "Model",
        fieldType: "selection",
        options: LLM_MODELS,
        defaultValue: LLM_MODELS[0],
      },
      {
        key: "temperature",
        label: "Temperature",
        fieldType: "number",
        defaultValue: "0.7",
        placeholder: "0.0 - 2.0",
      },
    ],
    handles: {
      static: {
        sources: [{ id: "response", side: "right", label: "response" }],
        targets: [
          { id: "system", side: "left", label: "system" },
          { id: "prompt", side: "left", label: "prompt" },
        ],
      },
      dynamic: false,
    },
    content: "Process text with AI",
  },

  text: {
    meta: {
      title: "Text",
      icon: "📝",
      category: "processor",
      color: "node-text",
      defaultSize: { width: 280, height: 160 },
      resizable: true,
      showInToolBar: true,
      description: "Text with variable support",
    },
    dataSchema: [
      {
        key: "text",
        label: "Text",
        fieldType: "textarea",
        defaultValue: "",
        autoResize: true,
        placeholder: "Enter text... Use {{variable}} for dynamic inputs",
      },
    ],
    handles: {
      static: {
        sources: [{ id: "output", side: "right", label: "out" }],
      },
      dynamic: {
        side: "left",
        deriveFrom: "text",
        pattern: /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g,
      },
    },
    content: null,
  },

  math: {
    meta: {
      title: "Math",
      icon: "🔢",
      category: "processor",
      color: "node-math",
      defaultSize: { width: 240, height: 120 },
      resizable: false,
      showInToolBar: true,
      description: "Mathematical operations",
    },
    dataSchema: [
      {
        key: "expression",
        label: "Expression",
        fieldType: "textinput",
        defaultValue: "a + b",
        placeholder: "e.g., a + b * 2",
      },
    ],
    handles: {
      static: {
        sources: [{ id: "result", side: "right", label: "result" }],
        targets: [
          { id: "a", side: "left", label: "a" },
          { id: "b", side: "left", label: "b" },
        ],
      },
      dynamic: false,
    },
    content: null,
  },

  delay: {
    meta: {
      title: "Delay",
      icon: "⏱️",
      category: "utility",
      color: "node-delay",
      defaultSize: { width: 200, height: 100 },
      resizable: false,
      showInToolBar: true,
      description: "Add time delay",
    },
    dataSchema: [
      {
        key: "ms",
        label: "Delay (ms)",
        fieldType: "number",
        defaultValue: "1000",
        placeholder: "Milliseconds",
      },
    ],
    handles: {
      static: {
        sources: [{ id: "output", side: "right", label: "out" }],
        targets: [{ id: "input", side: "left", label: "in" }],
      },
      dynamic: false,
    },
    content: null,
  },

  logger: {
    meta: {
      title: "Logger",
      icon: "📋",
      category: "utility",
      color: "node-logger",
      defaultSize: { width: 200, height: 80 },
      resizable: false,
      showInToolBar: true,
      description: "Log data for debugging",
    },
    dataSchema: [
      {
        key: "label",
        label: "Label",
        fieldType: "textinput",
        defaultValue: "Log",
        placeholder: "Log label...",
      },
    ],
    handles: {
      static: {
        targets: [{ id: "input", side: "left", label: "in" }],
      },
      dynamic: false,
    },
    content: null,
  },

  switch: {
    meta: {
      title: "Switch",
      icon: "🔀",
      category: "logic",
      color: "node-switch",
      defaultSize: { width: 240, height: 140 },
      resizable: false,
      showInToolBar: true,
      description: "Conditional branching",
    },
    dataSchema: [
      {
        key: "condition",
        label: "Condition",
        fieldType: "textinput",
        defaultValue: "x > 0",
        placeholder: "e.g., x > 0",
      },
    ],
    handles: {
      static: {
        sources: [
          { id: "true", side: "right", label: "true" },
          { id: "false", side: "right", label: "false" },
        ],
        targets: [{ id: "input", side: "left", label: "in" }],
      },
      dynamic: false,
    },
    content: null,
  },

  api: {
    meta: {
      title: "API Call",
      icon: "🌐",
      category: "integration",
      color: "node-api",
      defaultSize: { width: 280, height: 180 },
      resizable: true,
      showInToolBar: true,
      description: "Make HTTP API requests",
    },
    dataSchema: [
      {
        key: "method",
        label: "Method",
        fieldType: "selection",
        options: ["GET", "POST", "PUT", "DELETE"],
        defaultValue: "GET",
      },
      {
        key: "url",
        label: "URL",
        fieldType: "textinput",
        defaultValue: "",
        placeholder: "https://api.example.com/endpoint",
      },
    ],
    handles: {
      static: {
        sources: [{ id: "response", side: "right", label: "response" }],
        targets: [
          { id: "url", side: "left", label: "url" },
          { id: "body", side: "left", label: "body" },
        ],
      },
      dynamic: false,
    },
    content: null,
  },
};

# Pipeline Builder - Visual Workflow Editor

A visual node-based pipeline editor built with React, React Flow, and TypeScript. This implements a config-driven node factory pattern for rapid development.

## 🚀 Features

### Part 1: Node Abstraction (Config-Driven Factory Pattern)

All nodes are created from a single configuration file, enabling rapid development of new node types:

- **Config-driven architecture**: Define nodes with metadata, data schemas, and handles
- **9 node types included**: Input, Output, LLM, Text, Math, Delay, Logger, Switch, API Call
- **Flexible field types**: Text input, Selection, Textarea (auto-resize), Number
- **Dynamic handles**: Automatically create handles from `{{variable}}` patterns in text

### Part 2: Styling

Beautiful, unified design with:

- **Dark theme** with sophisticated color palette
- **Color-coded node types** for easy identification
- **Smooth animations** and hover effects
- **Professional UI** with React Flow customizations

### Part 3: Text Node Logic

The Text node supports:

- **Auto-resizing**: Node height adjusts based on text content
- **Variable extraction**: Use `{{variableName}}` syntax to create dynamic input handles
- **Real-time updates**: Handles appear/disappear as variables are added/removed

### Part 4: DAG Validation

Full pipeline analysis with:

- **Client-side DAG detection** using depth-first search
- **Visual results dialog** showing nodes, edges, and validation status
- **Cycle detection** with helpful error messages

## 📁 Project Structure

```
src/
├── components/
│   ├── pipeline/
│   │   ├── DraggableNode.tsx    # Toolbar node component
│   │   ├── PipelineCanvas.tsx   # React Flow canvas
│   │   ├── PipelineToolbar.tsx  # Node toolbar
│   │   └── SubmitButton.tsx     # Analysis & submit
│   └── ui/                      # shadcn/ui components
├── nodes/
│   ├── components/
│   │   ├── NodeHandle.tsx       # Handle component
│   │   └── NodeWrapper.tsx      # Node container
│   ├── config/
│   │   └── nodeConfigs.ts       # Node configurations
│   ├── fields/
│   │   ├── NumberField.tsx
│   │   ├── RenderField.tsx
│   │   ├── SelectField.tsx
│   │   ├── TextAreaField.tsx
│   │   └── TextField.tsx
│   ├── utils/
│   │   └── extractVariables.ts  # Variable extraction
│   └── NodeRenderer.tsx         # Main node factory
├── store/
│   └── pipelineStore.ts         # Zustand store
├── utils/
│   └── pipelineAnalysis.ts      # DAG validation
└── pages/
    └── Index.tsx                # Main page
```

## 🎯 Creating New Nodes

To add a new node type, simply add a configuration to `src/nodes/config/nodeConfigs.ts`:

```typescript
newNodeType: {
  meta: {
    title: "New Node",
    icon: "🆕",
    category: "processor",
    color: "node-text",
    defaultSize: { width: 240, height: 120 },
    resizable: true,
    showInToolBar: true,
    description: "Description for tooltip",
  },
  dataSchema: [
    {
      key: "fieldName",
      label: "Field Label",
      fieldType: "textinput", // or "selection", "textarea", "number"
      defaultValue: "",
      placeholder: "Placeholder text...",
    },
  ],
  handles: {
    static: {
      sources: [{ id: "output", side: "right", label: "out" }],
      targets: [{ id: "input", side: "left", label: "in" }],
    },
    dynamic: false, // or { side: "left", deriveFrom: "text", pattern: /regex/ }
  },
  content: null,
}
```

## 🔧 Technologies Used

- **React 18** - UI framework
- **React Flow 11** - Node-based canvas
- **Zustand** - State management
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons

## 📝 Usage

1. **Drag nodes** from the toolbar onto the canvas
2. **Connect nodes** by dragging from output handles (right) to input handles (left)
3. **Edit node fields** to configure behavior
4. **Use variables** in Text nodes with `{{variableName}}` syntax
5. **Click Submit** to analyze the pipeline and check for cycles

## Development

```sh
npm install
npm run dev
```

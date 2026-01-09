import React from "react";
import { ReactFlowProvider } from "reactflow";
import { PipelineToolbar } from "@/components/pipeline/PipelineToolbar";
import { PipelineCanvas } from "@/components/pipeline/PipelineCanvas";
import { SubmitButton } from "@/components/pipeline/SubmitButton";
import { Workflow, Github } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
            <Workflow className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Pipeline Builder
            </h1>
            <p className="text-xs text-muted-foreground">
              Visual workflow editor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SubmitButton />
        </div>
      </header>

      {/* Main Content */}
      <ReactFlowProvider>
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
          <PipelineToolbar />

          {/* Canvas */}
          <PipelineCanvas />
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default Index;

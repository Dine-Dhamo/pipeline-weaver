import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePipelineStore } from "@/store/pipelineStore";
import { analyzePipeline } from "@/utils/pipelineAnalysis";
import { useToast } from "@/hooks/use-toast";
import { Play, Zap, CheckCircle2, XCircle, Hash, GitBranch } from "lucide-react";

interface AnalysisResult {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

export const SubmitButton: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const nodes = usePipelineStore((state) => state.nodes);
  const edges = usePipelineStore((state) => state.edges);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty Pipeline",
        description: "Please add some nodes to the pipeline before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Analyze the pipeline
      const analysis = analyzePipeline(nodes, edges);
      setResult(analysis);
      setIsOpen(true);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing the pipeline.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          size="sm"
        >
          <Play className="w-4 h-4" />
          Submit Pipeline
        </Button>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 text-warning" />
          <span className="font-medium">{nodes.length}</span>
          <span>nodes</span>
          <span className="mx-1 opacity-50">•</span>
          <span className="font-medium">{edges.length}</span>
          <span>edges</span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              Pipeline Analysis Results
            </DialogTitle>
            <DialogDescription>
              Your pipeline has been analyzed successfully.
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4 pt-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Hash className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.num_nodes}
                    </p>
                    <p className="text-xs text-muted-foreground">Nodes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                    <GitBranch className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.num_edges}
                    </p>
                    <p className="text-xs text-muted-foreground">Edges</p>
                  </div>
                </div>
              </div>

              {/* DAG Status */}
              <div
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  result.is_dag
                    ? "bg-success/10 border-success/30"
                    : "bg-destructive/10 border-destructive/30"
                }`}
              >
                {result.is_dag ? (
                  <CheckCircle2 className="w-6 h-6 text-success" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <p
                    className={`font-semibold ${
                      result.is_dag ? "text-success" : "text-destructive"
                    }`}
                  >
                    {result.is_dag ? "Valid DAG" : "Invalid - Contains Cycles"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.is_dag
                      ? "Your pipeline forms a valid directed acyclic graph"
                      : "Remove circular connections to create a valid pipeline"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

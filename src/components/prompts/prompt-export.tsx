"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardCopy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AI_TOOLS, type AITool, type PromptRun } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface PromptExportProps {
  projectId: string;
  projectName: string;
  selectedTool: AITool;
  promptRuns: PromptRun[];
}

export function PromptExportView({ projectId, projectName, selectedTool: initialTool, promptRuns }: PromptExportProps) {
  const [tool, setTool] = useState<AITool>(initialTool);
  const [promptText, setPromptText] = useState(promptRuns[0]?.prompt_text ?? "");
  const [loading, setLoading] = useState(false);
  const [history] = useState(promptRuns);

  async function regenerate() {
    setLoading(true);
    const res = await fetch("/api/ai/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, tool, promptType: "next-step" }),
    });
    const data = await res.json();
    if (data.promptRun) setPromptText(data.promptRun.prompt_text);
    setLoading(false);
  }

  async function changeTool(newTool: AITool) {
    setTool(newTool);
    setLoading(true);
    const res = await fetch("/api/ai/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, tool: newTool, promptType: "next-step" }),
    });
    const data = await res.json();
    if (data.promptRun) setPromptText(data.promptRun.prompt_text);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href={`/projects/${projectId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {projectName}
        </Link>
        <h1 className="text-2xl font-bold">Prompt export</h1>
        <p className="text-slate-600 mt-1">Copy a ready-to-use prompt for your AI tool.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Select value={tool} onValueChange={(v) => v && changeTool(v as AITool)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AI_TOOLS.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => navigator.clipboard.writeText(promptText)}>
          <ClipboardCopy className="h-4 w-4 mr-1" />
          Copy prompt
        </Button>
        <Button variant="outline" onClick={regenerate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Regenerate"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{AI_TOOLS.find((t) => t.value === tool)?.label} prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="rounded-lg bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto whitespace-pre-wrap max-h-[500px]">
            {loading ? "Generating..." : promptText || "No prompt yet. Click Regenerate."}
          </pre>
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Version history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.map((run) => (
              <button
                key={run.id}
                type="button"
                className="w-full text-left rounded-lg border p-3 hover:bg-slate-50 transition-colors"
                onClick={() => setPromptText(run.prompt_text)}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{run.prompt_type} · {run.tool}</span>
                  <span className="text-slate-400">{formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{run.prompt_text.slice(0, 100)}...</p>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

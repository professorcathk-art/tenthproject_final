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
import { PromptVersionPanel } from "@/components/project/prompt-version-panel";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n/provider";

interface PromptExportProps {
  projectId: string;
  projectName: string;
  selectedTool: AITool;
  promptRuns: PromptRun[];
}

export function PromptExportView({ projectId, projectName, selectedTool: initialTool, promptRuns }: PromptExportProps) {
  const { dict } = useI18n();
  const p = dict.project;
  const [tool, setTool] = useState<AITool>(initialTool);
  const [promptText, setPromptText] = useState(promptRuns[0]?.prompt_text ?? "");
  const [previewRunId, setPreviewRunId] = useState(promptRuns[0]?.id ?? null);
  const [history, setHistory] = useState(promptRuns);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  async function regenerate() {
    setLoading(true);
    const res = await fetch("/api/ai/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, tool, promptType: "next-step" }),
    });
    const data = await res.json();
    if (data.promptRun) {
      setPromptText(data.promptRun.prompt_text);
      setPreviewRunId(data.promptRun.id);
      setHistory((current) => [data.promptRun, ...current]);
    }
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
    if (data.promptRun) {
      setPromptText(data.promptRun.prompt_text);
      setPreviewRunId(data.promptRun.id);
      setHistory((current) => [data.promptRun, ...current]);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href={`/projects/${projectId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {p.back} · {projectName}
        </Link>
        <h1 className="text-2xl font-bold">{p.promptExport}</h1>
        <p className="text-slate-600 mt-1">{p.promptExportDesc}</p>
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
          {p.copyPrompt}
        </Button>
        <Button variant="outline" onClick={regenerate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : p.regenerate}
        </Button>
      </div>

      <PromptVersionPanel
        runs={history}
        previewRunId={previewRunId}
        toggling={toggling}
        onView={(run) => {
          setPreviewRunId(run.id);
          setPromptText(run.prompt_text);
        }}
        onToggleExecuted={async (run) => {
          setToggling(true);
          try {
            const res = await fetch("/api/projects", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                projectId,
                action: "mark_prompt_executed",
                promptRunId: run.id,
                is_executed: !run.is_executed,
              }),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || "Failed");
            const updated = data.promptRun as PromptRun;
            setHistory((current) => current.map((item) => (item.id === updated.id ? updated : item)));
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed");
          } finally {
            setToggling(false);
          }
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{AI_TOOLS.find((t) => t.value === tool)?.label} prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto whitespace-pre-wrap max-h-[500px]">
              {loading ? dict.common.loading : promptText || p.noPrompt}
            </pre>
          </CardContent>
        </Card>
      </PromptVersionPanel>
    </div>
  );
}

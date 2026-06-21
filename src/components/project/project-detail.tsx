"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bug,
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  Globe,
  GitBranch,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  ListChecks,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UAT_STATUSES, AI_TOOLS, type ProjectWithRelations, type UATStatus, type AITool } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ProjectDetailProps {
  initialProject: ProjectWithRelations;
}

export function ProjectDetail({ initialProject }: ProjectDetailProps) {
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<AITool>(project.selected_tool as AITool);
  const [promptText, setPromptText] = useState(project.prompt_runs?.[0]?.prompt_text ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(project.website_url ?? "");
  const [githubUrl, setGithubUrl] = useState(project.github_url ?? "");
  const [uatFilter, setUatFilter] = useState<string>("all");

  const tasks = project.tasks ?? [];
  const uatItems = project.uat_items ?? [];
  const bugs = project.bugs ?? [];
  const enhancements = project.enhancements ?? [];
  const phases = project.phases ?? [];

  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const taskProgress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const passedUAT = uatItems.filter((u) => u.status === "passed" || u.status === "verified").length;
  const uatProgress = uatItems.length ? Math.round((passedUAT / uatItems.length) * 100) : 0;

  const refreshProject = useCallback(async () => {
    const res = await fetch(`/api/projects?id=${project.id}`);
    const data = await res.json();
    if (data.project) setProject(data.project);
  }, [project.id]);

  async function runWebsiteCheck() {
    setLoading("check");
    try {
      await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, website_url: websiteUrl }),
      });
      const res = await fetch("/api/test-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, url: websiteUrl }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await refreshProject();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Check failed");
    } finally {
      setLoading(null);
    }
  }

  async function generatePrompt(type: string) {
    setLoading(type);
    try {
      const res = await fetch("/api/ai/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, tool: selectedTool, promptType: type }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPromptText(data.promptRun.prompt_text);
      await refreshProject();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function nextSprint() {
    setLoading("sprint");
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, promptType: "next-step" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPromptText(data.promptRun?.prompt_text ?? "");
      await refreshProject();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function updateUATStatus(uatId: string, status: UATStatus, remark?: string) {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        action: "update_uat",
        uatId,
        data: { status, remark: remark ?? undefined },
        remark: remark ? { text: remark, updatedBy: "Demo User" } : undefined,
      }),
    });
    await refreshProject();
  }

  async function updateTaskStatus(taskId: string, status: string) {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        action: "update_task",
        taskId,
        data: { status },
      }),
    });
    await refreshProject();
  }

  async function saveUrls() {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        website_url: websiteUrl || null,
        github_url: githubUrl || null,
      }),
    });
    await refreshProject();
  }

  const filteredUAT =
    uatFilter === "all" ? uatItems : uatItems.filter((u) => u.status === uatFilter);

  const statusBadge = (status: string) => {
    const config = UAT_STATUSES.find((s) => s.value === status);
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config?.color ?? "bg-slate-100"}`}>
        {config?.label ?? status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-600 mt-1">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">{project.product_type.replace("_", " ")}</Badge>
            <Badge variant="outline">{project.stage.replace("_", " ")}</Badge>
            <Badge variant="outline">{project.selected_tool}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={nextSprint} disabled={loading === "sprint"}>
            {loading === "sprint" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Next sprint
          </Button>
          <Link href={`/projects/${project.id}/prompts`}>
            <Button variant="outline">
              <Sparkles className="h-4 w-4 mr-1" />
              Prompts
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasks</CardDescription>
            <CardTitle className="text-2xl">{doneTasks}/{tasks.length}</CardTitle>
          </CardHeader>
          <CardContent><Progress value={taskProgress} className="h-2" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>UAT passed</CardDescription>
            <CardTitle className="text-2xl">{passedUAT}/{uatItems.length}</CardTitle>
          </CardHeader>
          <CardContent><Progress value={uatProgress} className="h-2" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open bugs</CardDescription>
            <CardTitle className="text-2xl">{bugs.filter((b) => b.status === "open").length}</CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-slate-500">{bugs.length} total bugs tracked</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Phases</CardDescription>
            <CardTitle className="text-2xl">{phases.filter((p) => p.status === "completed").length}/{phases.length}</CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-slate-500">{enhancements.length} enhancements suggested</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Project links
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Website URL"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <Input
              placeholder="GitHub URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveUrls}>Save</Button>
            <Button onClick={runWebsiteCheck} disabled={!websiteUrl || loading === "check"}>
              {loading === "check" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
              Run check
            </Button>
          </div>
        </CardContent>
        {(websiteUrl || githubUrl) && (
          <CardContent className="pt-0 flex gap-3">
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                <ExternalLink className="h-3 w-3" /> Website
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                <GitBranch className="h-3 w-3" /> GitHub
              </a>
            )}
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="uat">UAT</TabsTrigger>
          <TabsTrigger value="bugs">Bugs</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Phase roadmap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {phases.length === 0 ? (
                  <p className="text-sm text-slate-500">No phases yet. Run AI analysis to generate a roadmap.</p>
                ) : (
                  phases.map((phase, i) => (
                    <div key={phase.id} className="flex items-start gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        phase.status === "completed" ? "bg-green-100 text-green-700" :
                        phase.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100"
                      }`}>
                        {phase.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </span>
                      <div>
                        <div className="font-medium text-sm">{phase.name}</div>
                        <div className="text-xs text-slate-500">{phase.description}</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {enhancements.length === 0 ? (
                  <p className="text-sm text-slate-500">No enhancements yet.</p>
                ) : (
                  enhancements.slice(0, 5).map((e) => (
                    <div key={e.id} className="rounded-lg border p-3 text-sm">
                      <div className="font-medium">{e.title}</div>
                      <div className="text-slate-500 text-xs mt-1">{e.description}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          {project.test_runs && project.test_runs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Latest website check</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{project.test_runs[0].result_summary}</p>
                {project.test_runs[0].screenshot_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.test_runs[0].screenshot_url}
                    alt="Website screenshot"
                    className="rounded-lg border max-w-full h-auto max-h-64 object-contain"
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-2">
              {tasks.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No tasks yet.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-slate-500">{task.description}</div>
                    </div>
                    <Select value={task.status} onValueChange={(v) => v && updateTaskStatus(task.id, v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To do</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uat" className="mt-4 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Select value={uatFilter} onValueChange={(v) => v && setUatFilter(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {UAT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            {filteredUAT.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-sm text-slate-500">No UAT items match this filter.</CardContent></Card>
            ) : (
              filteredUAT.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link href={`/projects/${project.id}/uat/${item.id}`} className="font-medium text-sm hover:underline">
                            {item.title}
                          </Link>
                          {statusBadge(item.status)}
                          <Badge variant="outline" className="text-xs">{item.severity}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Expected: {item.expected_result}</p>
                        {item.remark && <p className="text-xs text-slate-600 mt-1 italic">&quot;{item.remark}&quot;</p>}
                      </div>
                      <Select value={item.status} onValueChange={(v) => v && updateUATStatus(item.id, v as UATStatus)}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UAT_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bugs" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-2">
              {bugs.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No bugs tracked.</p>
              ) : (
                bugs.map((bug) => (
                  <div key={bug.id} className="flex items-start justify-between rounded-lg border p-3">
                    <div className="flex items-start gap-2">
                      <Bug className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">{bug.title}</div>
                        <div className="text-xs text-slate-500">{bug.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={bug.status === "open" ? "destructive" : "secondary"}>{bug.status}</Badge>
                      <Button size="sm" variant="outline" onClick={() => generatePrompt("bug-fix")}>
                        Fix prompt
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={selectedTool} onValueChange={(v) => v && setSelectedTool(v as AITool)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_TOOLS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => generatePrompt("next-step")} disabled={!!loading}>
              Regenerate
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(promptText)}>
              <ClipboardCopy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
          <pre className="rounded-lg bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto whitespace-pre-wrap max-h-96">
            {promptText || "No prompt generated yet. Click Regenerate or Next Sprint."}
          </pre>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              {(project.activity_logs ?? []).length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No activity yet.</p>
              ) : (
                (project.activity_logs ?? []).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm border-b pb-3 last:border-0">
                    <ListChecks className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <p>{log.message}</p>
                      <p className="text-xs text-slate-400">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

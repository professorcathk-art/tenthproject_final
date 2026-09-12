"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bot,
  Bug,
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  GitBranch,
  Globe,
  Lightbulb,
  Loader2,
  Pencil,
  Plus,
  Rocket,
  Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UAT_STATUSES, AI_TOOLS, type ProjectWithRelations, type UATStatus, type AITool } from "@/types";
import { McpSettings } from "@/components/project/mcp-settings";
import { AiSuggestionsModal } from "@/components/project/ai-suggestions-modal";
import { NextSprintSheet } from "@/components/project/next-sprint-sheet";
import { formatDistanceToNow } from "date-fns";
import { zhTW, enUS } from "date-fns/locale";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";
import { CATEGORY_LABEL, SEVERITY_CLASS, isHealthyStatus, parseHttpStatus, pendingSuggestionCount } from "@/lib/project/audit";
import { buildRetestPrompt } from "@/lib/ai/executable-spec";
import { PromptVersionPanel } from "@/components/project/prompt-version-panel";
import type { PromptRun } from "@/types";

interface ProjectDetailProps {
  initialProject: ProjectWithRelations;
}

const TASK_COLUMNS = ["todo", "in_progress", "done", "blocked"] as const;

export function ProjectDetail({ initialProject }: ProjectDetailProps) {
  const router = useRouter();
  const { dict, locale } = useI18n();
  const p = dict.project;
  const dateLocale = locale === "zh" ? zhTW : enUS;
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState<string | null>(null);
  const [tab, setTab] = useState("overview");
  const [selectedTool, setSelectedTool] = useState<AITool>(project.selected_tool as AITool);
  const [promptText, setPromptText] = useState(project.prompt_runs?.[0]?.prompt_text ?? "");
  const [previewRunId, setPreviewRunId] = useState(project.prompt_runs?.[0]?.id ?? null);
  const [togglingPrompt, setTogglingPrompt] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState(project.website_url ?? "");
  const [githubUrl, setGithubUrl] = useState(project.github_url ?? "");
  const [uatFilter, setUatFilter] = useState<string>("all");
  const [taskDraft, setTaskDraft] = useState({ title: "", description: "" });
  const [uatDraft, setUatDraft] = useState({
    title: "",
    test_path: "",
    expected_result: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [bugDraft, setBugDraft] = useState({ title: "", description: "", severity: "medium" });
  const [enhDraft, setEnhDraft] = useState({ title: "", description: "" });
  const [phaseDraft, setPhaseDraft] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editPath, setEditPath] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sprintOpen, setSprintOpen] = useState(false);

  const tasks = project.tasks ?? [];
  const uatItems = project.uat_items ?? [];
  const bugs = project.bugs ?? [];
  const enhancements = project.enhancements ?? [];
  const phases = project.phases ?? [];
  const suggestions = useMemo(() => project.ai_suggestions ?? [], [project.ai_suggestions]);
  const latestRun = project.test_runs?.[0];
  const httpStatus = parseHttpStatus(latestRun);
  const pendingCount = pendingSuggestionCount(suggestions);

  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const taskProgress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const passedUAT = uatItems.filter((u) => u.status === "passed" || u.status === "verified").length;
  const uatProgress = uatItems.length ? Math.round((passedUAT / uatItems.length) * 100) : 0;
  const openBugCount = bugs.filter((b) => b.status === "open" || b.status === "in_progress").length;

  const refreshProject = useCallback(async (opts?: { preferLatest?: boolean }) => {
    const res = await fetch(`/api/projects?id=${project.id}`);
    const data = await res.json();
    if (data.project) {
      setProject(data.project);
      const runs = [...((data.project.prompt_runs ?? []) as PromptRun[])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      const preview = opts?.preferLatest
        ? runs[0]
        : previewRunId
          ? (runs.find((run) => run.id === previewRunId) ?? runs[0])
          : runs[0];
      if (preview) {
        setPreviewRunId(preview.id);
        setPromptText(preview.prompt_text);
      }
    }
  }, [previewRunId, project.id]);

  async function projectAction(action: string, payload: Record<string, unknown> = {}) {
    const res = await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, action, ...payload }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Update failed");
    }
    await refreshProject();
    return res.json().catch(() => ({}));
  }

  async function runDiagnostics() {
    if (!websiteUrl.trim()) {
      toast.error(p.needUrl);
      return;
    }
    setLoading("check");
    try {
      await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, website_url: websiteUrl }),
      });
      const checkRes = await fetch("/api/test-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, url: websiteUrl }),
      });
      const checkRaw = await checkRes.text();
      const checkData = checkRaw ? JSON.parse(checkRaw) : {};
      if (!checkRes.ok || checkData.error) throw new Error(checkData.error || `Check failed (${checkRes.status})`);

      const auditRes = await fetch("/api/ai/analyze-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          testRunId: checkData.testRun?.id,
          result: checkData.result,
        }),
      });
      const auditData = await auditRes.json();
      if (!auditRes.ok || auditData.error) throw new Error(auditData.error || "Diagnostics failed");
      await refreshProject();
      setSheetOpen(true);
      setTab("overview");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Diagnostics failed");
    } finally {
      setLoading(null);
    }
  }

  async function generatePrompt(type: string, extra: Record<string, unknown> = {}) {
    setLoading(type);
    try {
      const res = await fetch("/api/ai/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, tool: selectedTool, promptType: type, ...extra }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPromptText(data.promptRun.prompt_text);
      setPreviewRunId(data.promptRun.id);
      setTab("prompt");
      await refreshProject({ preferLatest: true });
      toast.success(locale === "zh" ? "提示詞已更新" : "Prompt updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function nextSprint(payload: { suggestionIds: string[]; enhancementIds: string[] }) {
    setLoading("sprint");
    try {
      const res = await fetch("/api/ai/sprint-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          suggestionIds: payload.suggestionIds,
          enhancementIds: payload.enhancementIds,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPromptText(data.promptRun?.prompt_text ?? "");
      setPreviewRunId(data.promptRun?.id ?? null);
      setSprintOpen(false);
      setTab("prompt");
      await refreshProject({ preferLatest: true });
      toast.success(locale === "zh" ? "已勾選項目寫入提示詞與 UAT" : "Selected items were added to the prompt and UAT");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function updateUATStatus(uatId: string, status: UATStatus, remark?: string) {
    await projectAction("update_uat", {
      uatId,
      data: { status, remark: remark ?? undefined },
      remark: remark ? { text: remark, updatedBy: "Demo User" } : undefined,
    });
  }

  async function updateTaskStatus(taskId: string, status: string) {
    await projectAction("update_task", { taskId, data: { status } });
  }

  async function removeItem(action: string, payload: Record<string, unknown>) {
    if (!window.confirm(locale === "zh" ? "確定刪除？此操作無法復原。" : "Delete this item? This cannot be undone.")) return;
    await projectAction(action, payload);
  }

  function startEdit(key: string, title: string, body = "", path = "") {
    setEditing(key);
    setEditTitle(title);
    setEditBody(body);
    setEditPath(path);
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
    toast.success(p.save);
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(p.copied);
    } catch {
      toast.error(p.copyFailed);
    }
  }

  function retestPrompt(item: (typeof uatItems)[number]) {
    void copyText(buildRetestPrompt(item));
  }

  const filteredUAT = uatFilter === "all" ? uatItems : uatItems.filter((u) => u.status === uatFilter);
  const healthy = isHealthyStatus(httpStatus);
  const statusDot = !latestRun ? "bg-slate-300" : healthy ? "bg-emerald-500" : "bg-red-500";
  const statusLabel = !websiteUrl
    ? p.noUrlStatus
    : !latestRun
      ? p.neverAudited
      : `${healthy ? "🟢" : "🔴"} ${httpStatus ?? "—"} ${healthy ? p.auditOk : p.auditFail}`;

  const statusBadge = (status: string) => {
    const config = UAT_STATUSES.find((s) => s.value === status);
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config?.color ?? "bg-slate-100"}`}>
        {p.uatStatuses[status as keyof typeof p.uatStatuses] ?? config?.label ?? status}
      </span>
    );
  };

  const pendingSuggestions = useMemo(
    () => suggestions.filter((item) => item.status === "pending"),
    [suggestions],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {p.back}
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
          <Button onClick={() => setSprintOpen(true)} disabled={loading === "sprint"}>
            {loading === "sprint" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {loading === "sprint" ? p.synthesizing : `🚀 ${p.nextSprint}`}
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              if (!window.confirm(p.deleteProjectConfirm)) return;
              const res = await fetch(`/api/projects?id=${project.id}`, { method: "DELETE" });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                toast.error(data.error || p.deleteProject);
                return;
              }
              toast.success(p.deleteProjectDone);
              router.push("/dashboard");
              router.refresh();
            }}
          >
            <Trash2 className="h-4 w-4" />
            {p.deleteProject}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={`h-2.5 w-2.5 rounded-full ${statusDot}`} />
            <span>{statusLabel}</span>
          </div>
          {websiteUrl ? (
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:underline truncate">
              <ExternalLink className="h-3 w-3 shrink-0" />
              {websiteUrl}
            </a>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">{p.needUrl}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {p.lastAudit}:{" "}
            {latestRun
              ? formatDistanceToNow(new Date(latestRun.created_at), { addSuffix: true, locale: dateLocale })
              : p.neverAudited}
          </span>
          <Button onClick={runDiagnostics} disabled={loading === "check"}>
            {loading === "check" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
            {loading === "check" ? p.runningDiagnostics : `🤖 ${p.runDiagnostics}`}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {p.editLinks}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Input placeholder={p.websiteUrl} value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
          <Input placeholder={p.githubUrl} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveUrls}>{p.save}</Button>
            {githubUrl ? (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline" }))}>
                <GitBranch className="h-4 w-4" />
                GitHub
              </a>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{p.taskProgress}</CardDescription>
            <CardTitle className="text-2xl">{doneTasks} / {tasks.length}</CardTitle>
          </CardHeader>
          <CardContent><Progress value={taskProgress} className="h-2" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{p.uatRate}</CardDescription>
            <CardTitle className="text-2xl">{passedUAT} / {uatItems.length}</CardTitle>
          </CardHeader>
          <CardContent><Progress value={uatProgress} className="h-2" /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{p.pendingBugs}</CardDescription>
            <CardTitle className="text-2xl">{openBugCount}</CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-slate-500">{bugs.length} {p.totalBugs}</p></CardContent>
        </Card>
        <button type="button" onClick={() => setSheetOpen(true)} className="text-left">
          <Card className="h-full transition hover:border-emerald-300">
            <CardHeader className="pb-2">
              <CardDescription>{p.pendingSuggestions}</CardDescription>
              <CardTitle className="text-2xl">{pendingCount}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-xs text-emerald-700">{p.modalTitle}</p></CardContent>
          </Card>
        </button>
      </div>

      <Tabs value={tab} onValueChange={(value) => value && setTab(value)}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">{p.tabOverview}</TabsTrigger>
          <TabsTrigger value="tasks">{p.tabTasks}</TabsTrigger>
          <TabsTrigger value="uat">{p.tabUat}</TabsTrigger>
          <TabsTrigger value="bugs">{p.tabBugs}</TabsTrigger>
          <TabsTrigger value="prompt">{p.tabPrompt}</TabsTrigger>
          <TabsTrigger value="mcp">{p.tabMcp}</TabsTrigger>
        </TabsList>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{p.roadmap}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 rounded-lg border p-3">
                    <Input placeholder={p.itemTitle} value={phaseDraft.name} onChange={(e) => setPhaseDraft({ ...phaseDraft, name: e.target.value })} />
                    <Input placeholder={p.itemDesc} value={phaseDraft.description} onChange={(e) => setPhaseDraft({ ...phaseDraft, description: e.target.value })} />
                    <Button size="sm" disabled={!phaseDraft.name.trim()} onClick={async () => {
                      await projectAction("create_phase", { data: phaseDraft });
                      setPhaseDraft({ name: "", description: "" });
                    }}>
                      <Plus className="mr-1 h-4 w-4" /> {p.addPhase}
                    </Button>
                  </div>
                  {phases.length === 0 ? (
                    <p className="text-sm text-slate-500">{p.noPhases}</p>
                  ) : (
                    phases.map((phase, i) => (
                      <div key={phase.id} className="flex items-start gap-3">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                          phase.status === "completed" ? "bg-green-100 text-green-700" :
                          phase.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100"
                        }`}>
                          {phase.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </span>
                        <div className="flex-1">
                          {editing === `phase:${phase.id}` ? (
                            <div className="space-y-2">
                              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                              <Input value={editBody} onChange={(e) => setEditBody(e.target.value)} />
                              <Button size="sm" onClick={async () => {
                                await projectAction("update_phase", { phaseId: phase.id, data: { name: editTitle, description: editBody } });
                                setEditing(null);
                              }}>{p.save}</Button>
                            </div>
                          ) : (
                            <>
                              <div className="font-medium text-sm">{phase.name}</div>
                              <div className="text-xs text-slate-500">{phase.description}</div>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(`phase:${phase.id}`, phase.name, phase.description ?? "")}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => removeItem("delete_phase", { phaseId: phase.id })}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{p.latestSuggestions}</CardTitle>
                  <CardDescription>{latestRun?.result_summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pendingSuggestions.length === 0 ? (
                    <p className="text-sm text-slate-500">{p.noSuggestions}</p>
                  ) : (
                    pendingSuggestions.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSheetOpen(true)}
                        className="w-full rounded-lg border p-3 text-left hover:bg-muted/40"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{CATEGORY_LABEL[item.category][locale === "zh" ? "zh" : "en"]}</Badge>
                          <span className={`text-[11px] rounded-full px-2 py-0.5 ${SEVERITY_CLASS[item.severity]}`}>{item.severity}</span>
                        </div>
                        <div className="mt-1 text-sm font-medium">{item.title}</div>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      </button>
                    ))
                  )}
                  {latestRun?.screenshot_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={latestRun.screenshot_url} alt="Website screenshot" className="rounded-lg border max-w-full h-auto max-h-56 object-contain" />
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  {p.enhancements}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2 rounded-lg border p-3">
                  <Input placeholder={p.itemTitle} value={enhDraft.title} onChange={(e) => setEnhDraft({ ...enhDraft, title: e.target.value })} />
                  <Input placeholder={p.itemDesc} value={enhDraft.description} onChange={(e) => setEnhDraft({ ...enhDraft, description: e.target.value })} />
                  <Button size="sm" disabled={!enhDraft.title.trim()} onClick={async () => {
                    await projectAction("create_enhancement", { data: enhDraft });
                    setEnhDraft({ title: "", description: "" });
                  }}>
                    <Plus className="mr-1 h-4 w-4" /> {p.addEnhancement}
                  </Button>
                </div>
                {enhancements.map((e) => (
                  <div key={e.id} className="rounded-lg border p-3 text-sm">
                    {editing === `enh:${e.id}` ? (
                      <div className="space-y-2">
                        <Input value={editTitle} onChange={(ev) => setEditTitle(ev.target.value)} />
                        <Input value={editBody} onChange={(ev) => setEditBody(ev.target.value)} />
                        <Button size="sm" onClick={async () => {
                          await projectAction("update_enhancement", { enhancementId: e.id, data: { title: editTitle, description: editBody } });
                          setEditing(null);
                        }}>{p.save}</Button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium">{e.title}</div>
                          <div className="text-slate-500 text-xs mt-1">{e.description}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(`enh:${e.id}`, e.title, e.description ?? "")}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => removeItem("delete_enhancement", { enhancementId: e.id })}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Input placeholder={p.itemTitle} value={taskDraft.title} onChange={(e) => setTaskDraft({ ...taskDraft, title: e.target.value })} />
                <Textarea rows={2} placeholder={p.itemDesc} value={taskDraft.description} onChange={(e) => setTaskDraft({ ...taskDraft, description: e.target.value })} />
                <Button size="sm" disabled={!taskDraft.title.trim()} onClick={async () => {
                  await projectAction("create_task", { data: taskDraft });
                  setTaskDraft({ title: "", description: "" });
                }}>
                  <Plus className="mr-1 h-4 w-4" /> {p.addTask}
                </Button>
              </CardContent>
            </Card>
            {tasks.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">{p.noTasks}</p>
            ) : (
              <div className="grid gap-3 lg:grid-cols-4">
                {TASK_COLUMNS.map((column) => (
                  <div key={column} className="rounded-xl border bg-muted/30 p-3 space-y-2">
                    <div className="text-xs font-semibold text-slate-500">
                      {column === "todo" ? p.todo : column === "in_progress" ? p.inProgress : column === "done" ? p.done : p.blocked}
                    </div>
                    {tasks.filter((task) => task.status === column).map((task) => (
                      <div key={task.id} className="rounded-lg border bg-card p-3 space-y-2">
                        {editing === `task:${task.id}` ? (
                          <div className="space-y-2">
                            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            <Textarea rows={2} value={editBody} onChange={(e) => setEditBody(e.target.value)} />
                            <Button size="sm" onClick={async () => {
                              await projectAction("update_task", { taskId: task.id, data: { title: editTitle, description: editBody } });
                              setEditing(null);
                            }}>{p.save}</Button>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-sm">{task.title}</div>
                            <div className="text-xs text-slate-500">{task.description}</div>
                          </>
                        )}
                        <div className="flex items-center gap-1">
                          <Select value={task.status} onValueChange={(v) => v && updateTaskStatus(task.id, v)}>
                            <SelectTrigger className="h-7 w-full text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todo">{p.todo}</SelectItem>
                              <SelectItem value="in_progress">{p.inProgress}</SelectItem>
                              <SelectItem value="done">{p.done}</SelectItem>
                              <SelectItem value="blocked">{p.blocked}</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="icon-sm" variant="ghost" onClick={() => startEdit(`task:${task.id}`, task.title, task.description ?? "")}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button size="icon-sm" variant="ghost" onClick={() => removeItem("delete_task", { taskId: task.id })}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="uat" className="mt-4 space-y-4">
            <Card>
              <CardContent className="space-y-3 pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600" htmlFor="uat-name">{p.uatFeatureName}</label>
                  <Input
                    id="uat-name"
                    placeholder={p.uatFeatureNamePh}
                    value={uatDraft.title}
                    onChange={(e) => setUatDraft({ ...uatDraft, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600" htmlFor="uat-path">{p.uatTestPath}</label>
                  <Input
                    id="uat-path"
                    placeholder={p.uatTestPathPh}
                    value={uatDraft.test_path}
                    onChange={(e) => setUatDraft({ ...uatDraft, test_path: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600" htmlFor="uat-steps">{p.uatSteps}</label>
                  <Textarea
                    id="uat-steps"
                    rows={3}
                    placeholder={p.uatStepsPh}
                    value={uatDraft.expected_result}
                    onChange={(e) => setUatDraft({ ...uatDraft, expected_result: e.target.value })}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">{p.uatPriority}</label>
                    <Select
                      value={uatDraft.priority}
                      onValueChange={(v) => v && setUatDraft({ ...uatDraft, priority: v as "low" | "medium" | "high" })}
                    >
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">{p.priorityHigh}</SelectItem>
                        <SelectItem value="medium">{p.priorityMedium}</SelectItem>
                        <SelectItem value="low">{p.priorityLow}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" disabled={!uatDraft.title.trim()} onClick={async () => {
                    const severity = uatDraft.priority === "high" ? "high" : uatDraft.priority === "low" ? "low" : "medium";
                    await projectAction("create_uat", { data: { ...uatDraft, severity } });
                    setUatDraft({ title: "", test_path: "", expected_result: "", priority: "medium" });
                  }}>
                    <Plus className="mr-1 h-4 w-4" /> {p.addUat}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Select value={uatFilter} onValueChange={(v) => v && setUatFilter(v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{p.allStatuses}</SelectItem>
                {UAT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{p.uatStatuses[s.value]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-2">
              {filteredUAT.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-sm text-slate-500">{p.noUat}</CardContent></Card>
              ) : (
                filteredUAT.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-4 space-y-3">
                      {editing === `uat:${item.id}` ? (
                        <div className="space-y-2">
                          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder={p.uatFeatureName} />
                          <Input value={editPath} onChange={(e) => setEditPath(e.target.value)} placeholder={p.uatTestPath} />
                          <Textarea rows={3} value={editBody} onChange={(e) => setEditBody(e.target.value)} placeholder={p.uatSteps} />
                          <Button size="sm" onClick={async () => {
                            await projectAction("update_uat", {
                              uatId: item.id,
                              data: { title: editTitle, test_path: editPath || null, expected_result: editBody },
                            });
                            setEditing(null);
                          }}>{p.save}</Button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/projects/${project.id}/uat/${item.id}`} className="font-medium text-sm hover:underline">{item.title}</Link>
                            {statusBadge(item.status)}
                            <Badge variant="outline" className="text-xs">{item.priority ?? item.severity}</Badge>
                          </div>
                          {item.test_path ? (
                            <p className="text-xs font-mono text-slate-500 mt-1">{p.uatTestPath}: {item.test_path}</p>
                          ) : null}
                          <p className="text-xs text-slate-500 mt-1">{p.uatSteps}: {item.expected_result}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateUATStatus(item.id, "passed")}>{p.pass}</Button>
                        <Button size="sm" variant="destructive" onClick={() => updateUATStatus(item.id, "failed")}>{p.fail}</Button>
                        <Button size="sm" variant="ghost" onClick={() => updateUATStatus(item.id, "reopened")}>{p.reopen}</Button>
                        {(item.status === "failed" || item.status === "reopened") ? (
                          <Button size="sm" variant="secondary" onClick={() => retestPrompt(item)}>{p.retestPrompt}</Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => retestPrompt(item)}>{p.retestPrompt}</Button>
                        )}
                        <Button size="icon-sm" variant="ghost" onClick={() => startEdit(`uat:${item.id}`, item.title, item.expected_result ?? "", item.test_path ?? "")}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon-sm" variant="ghost" onClick={() => removeItem("delete_uat", { uatId: item.id })}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="bugs" className="mt-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="space-y-2 rounded-lg border p-3">
                  <Input placeholder={p.itemTitle} value={bugDraft.title} onChange={(e) => setBugDraft({ ...bugDraft, title: e.target.value })} />
                  <Textarea rows={2} placeholder={p.itemDesc} value={bugDraft.description} onChange={(e) => setBugDraft({ ...bugDraft, description: e.target.value })} />
                  <Button size="sm" disabled={!bugDraft.title.trim()} onClick={async () => {
                    await projectAction("create_bug", { data: bugDraft });
                    setBugDraft({ title: "", description: "", severity: "medium" });
                  }}>
                    <Plus className="mr-1 h-4 w-4" /> {p.addBug}
                  </Button>
                </div>
                {bugs.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">{p.noBugs}</p>
                ) : (
                  bugs.map((bug) => (
                    <div key={bug.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <Bug className="h-4 w-4 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          {editing === `bug:${bug.id}` ? (
                            <div className="space-y-2">
                              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                              <Textarea rows={2} value={editBody} onChange={(e) => setEditBody(e.target.value)} />
                              <Button size="sm" onClick={async () => {
                                await projectAction("update_bug", { bugId: bug.id, data: { title: editTitle, description: editBody } });
                                setEditing(null);
                              }}>{p.save}</Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="font-medium text-sm">{bug.title}</div>
                                <span className={`text-[11px] rounded-full px-2 py-0.5 ${SEVERITY_CLASS[bug.severity]}`}>{bug.severity}</span>
                              </div>
                              <pre className="mt-1 whitespace-pre-wrap text-xs text-slate-500 font-mono">{bug.description}</pre>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <Select value={bug.status} onValueChange={(v) => v && projectAction("update_bug", { bugId: bug.id, data: { status: v } })}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">open</SelectItem>
                            <SelectItem value="in_progress">in_progress</SelectItem>
                            <SelectItem value="fixed">fixed</SelectItem>
                            <SelectItem value="verified">verified</SelectItem>
                            <SelectItem value="closed">closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="outline" onClick={() => generatePrompt("bug-fix", { bugId: bug.id })}>{p.fixPrompt}</Button>
                        <Button size="icon-sm" variant="ghost" onClick={() => startEdit(`bug:${bug.id}`, bug.title, bug.description ?? "")}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon-sm" variant="ghost" onClick={() => removeItem("delete_bug", { bugId: bug.id })}><Trash2 className="h-3.5 w-3.5" /></Button>
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
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AI_TOOLS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => copyText(promptText)}>
                <ClipboardCopy className="h-4 w-4 mr-1" />
                {p.copyPrompt}
              </Button>
            </div>
            <PromptVersionPanel
              runs={project.prompt_runs ?? []}
              previewRunId={previewRunId}
              toggling={togglingPrompt}
              onView={(run) => {
                setPreviewRunId(run.id);
                setPromptText(run.prompt_text);
              }}
              onToggleExecuted={async (run) => {
                setTogglingPrompt(true);
                try {
                  await projectAction("mark_prompt_executed", {
                    promptRunId: run.id,
                    is_executed: !run.is_executed,
                  });
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Failed");
                } finally {
                  setTogglingPrompt(false);
                }
              }}
            >
              <pre className="rounded-lg bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto whitespace-pre-wrap max-h-96">
                {promptText || p.noPrompt}
              </pre>
            </PromptVersionPanel>
          </TabsContent>

          <TabsContent value="mcp" className="mt-4">
            <McpSettings projectId={project.id} projectName={project.name} />
          </TabsContent>
        </motion.div>
      </Tabs>

      <AiSuggestionsModal
        open={sheetOpen}
        suggestions={suggestions}
        loading={loading === "check"}
        onOpenChange={setSheetOpen}
        onConfirm={async (drafts) => {
          await projectAction("apply_suggestions", { suggestions: drafts });
          setSheetOpen(false);
          setTab("tasks");
          toast.success(p.appliedSprint);
        }}
      />
      <NextSprintSheet
        open={sprintOpen}
        loading={loading === "sprint"}
        suggestions={suggestions}
        enhancements={enhancements}
        onOpenChange={setSprintOpen}
        onConfirm={nextSprint}
      />
    </div>
  );
}

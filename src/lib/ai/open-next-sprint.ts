import { v4 as uuidv4 } from "uuid";
import {
  addPromptRun,
  applyApprovedSuggestions,
  getProject,
  logActivity,
  queueEnhancementsForSprint,
} from "@/lib/db/store";
import { collectSprintBacklog, synthesizeSprintPrompt } from "@/lib/ai/sprint-prompt";
import { UNMARKED_UAT } from "@/lib/project/founder-copy";
import type { AITool, AiSuggestion } from "@/types";

export async function openNextSprint(input: {
  projectId: string;
  userId: string;
  suggestions?: AiSuggestion[];
  suggestionIds?: string[];
  enhancementIds?: string[];
  taskIds?: string[];
}) {
  const project = await getProject(input.projectId, input.userId);
  if (!project) return { ok: false as const, status: 404, error: "Project not found" };

  const unmarked = (project.uat_items ?? []).filter((item) => UNMARKED_UAT.has(item.status));
  if (unmarked.length) {
    return {
      ok: false as const,
      status: 409,
      error: "UAT_UNMARKED",
      message: "這一輪還有驗收沒有標成通過或失敗，所以不能開下一輪。",
      unmarked: unmarked.map((item) => ({ id: item.id, title: item.title, status: item.status })),
    };
  }

  const allSuggestions = input.suggestions ?? project.ai_suggestions ?? [];
  const selectedSuggestions = input.suggestionIds
    ? allSuggestions.filter((item) => input.suggestionIds!.includes(item.id) && item.status !== "dismissed")
    : allSuggestions.filter((item) => item.approved && (item.status === "pending" || item.status === "applied"));

  const pendingSelected = selectedSuggestions
    .filter((item) => item.status === "pending")
    .map((item) => ({ ...item, approved: true }));
  if (pendingSelected.length) {
    await applyApprovedSuggestions(input.projectId, pendingSelected, { alwaysCreateUat: true });
  }

  const selectedEnhancementIds = input.enhancementIds ?? [];
  const chinese = /[\u4e00-\u9fff]/.test(`${project.name ?? ""} ${project.description ?? ""} ${project.goal ?? ""}`);
  const queued = selectedEnhancementIds.length
    ? await queueEnhancementsForSprint(input.projectId, selectedEnhancementIds, chinese ? "zh" : "en")
    : { tasks: 0, uat: 0 };

  const fresh = (await getProject(input.projectId, input.userId)) ?? project;
  const selectedIds = new Set(selectedSuggestions.map((item) => item.id));
  const approved = (fresh.ai_suggestions ?? []).filter((item) => selectedIds.has(item.id));
  const selectedEnhancements = (fresh.enhancements ?? []).filter((item) => selectedEnhancementIds.includes(item.id));
  const selectedTasks = (fresh.tasks ?? []).filter((task) => (input.taskIds ?? []).includes(task.id) && task.status !== "done");
  const promptText = synthesizeSprintPrompt(fresh, approved, selectedEnhancements, selectedTasks);
  const tool = (fresh.selected_tool as AITool) || "cursor";
  const promptRun = {
    id: uuidv4(),
    project_id: input.projectId,
    tool,
    prompt_text: promptText,
    prompt_type: "next-step" as const,
    generated_from_context_version: fresh.context_versions?.[0]?.id ?? null,
    created_at: new Date().toISOString(),
    is_executed: false,
    executed_at: null,
  };

  await addPromptRun(promptRun);
  const backlog = collectSprintBacklog(fresh, approved, selectedEnhancements);
  await logActivity(input.projectId, "sprint_prompt", "Synthesized next-sprint Cursor master prompt", {
    suggestions: approved.length,
    enhancements: selectedEnhancements.length,
    bugs: backlog.openBugs.length,
    uat: backlog.failedUat.length,
    queuedUat: queued.uat,
  });

  return {
    ok: true as const,
    promptRun,
    backlog: {
      suggestions: approved.length,
      enhancements: selectedEnhancements.length,
      openBugs: backlog.openBugs.length,
      failedUat: backlog.failedUat.length,
      todoTasks: backlog.todoTasks.length,
      queuedUat: queued.uat,
    },
  };
}

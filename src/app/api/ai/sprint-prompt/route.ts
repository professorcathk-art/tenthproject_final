import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth/session";
import { collectSprintBacklog, synthesizeSprintPrompt, SPRINT_PROMPT_SYSTEM } from "@/lib/ai/sprint-prompt";
import {
  addPromptRun,
  applyApprovedSuggestions,
  getProject,
  logActivity,
  queueEnhancementsForSprint,
} from "@/lib/db/store";
import type { AITool, AiSuggestion } from "@/types";

export const SYSTEM_PROMPT = SPRINT_PROMPT_SYSTEM;

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const { projectId, suggestions, suggestionIds, enhancementIds } = body as {
      projectId: string;
      suggestions?: AiSuggestion[];
      suggestionIds?: string[];
      enhancementIds?: string[];
    };

    const project = await getProject(projectId, user.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const allSuggestions = suggestions ?? project.ai_suggestions ?? [];
    const selectedSuggestions = suggestionIds
      ? allSuggestions.filter((item) => suggestionIds.includes(item.id) && item.status !== "dismissed")
      : allSuggestions.filter((item) => item.approved && (item.status === "pending" || item.status === "applied"));

    const pendingSelected = selectedSuggestions
      .filter((item) => item.status === "pending")
      .map((item) => ({ ...item, approved: true }));
    if (pendingSelected.length) {
      await applyApprovedSuggestions(projectId, pendingSelected, { alwaysCreateUat: true });
    }

    const selectedEnhancementIds = enhancementIds ?? [];
    const queued = selectedEnhancementIds.length
      ? await queueEnhancementsForSprint(projectId, selectedEnhancementIds)
      : { tasks: 0, uat: 0 };

    const fresh = (await getProject(projectId, user.id)) ?? project;
    const selectedIds = new Set(selectedSuggestions.map((item) => item.id));
    const approved = (fresh.ai_suggestions ?? []).filter((item) => selectedIds.has(item.id));
    const selectedEnhancements = (fresh.enhancements ?? []).filter((item) =>
      selectedEnhancementIds.includes(item.id),
    );

    const promptText = synthesizeSprintPrompt(fresh, approved, selectedEnhancements);
    const tool = (fresh.selected_tool as AITool) || "cursor";

    const promptRun = {
      id: uuidv4(),
      project_id: projectId,
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
    await logActivity(projectId, "sprint_prompt", "Synthesized next-sprint Cursor master prompt", {
      suggestions: approved.length,
      enhancements: selectedEnhancements.length,
      bugs: backlog.openBugs.length,
      uat: backlog.failedUat.length,
      queuedUat: queued.uat,
    });

    let mcpSynced = false;
    try {
      const origin = request.nextUrl.origin;
      const ping = await fetch(`${origin}/api/mcp`, { method: "GET", cache: "no-store" });
      mcpSynced = ping.ok;
    } catch {
      mcpSynced = false;
    }

    await logActivity(projectId, "mcp_sync", mcpSynced ? "Sprint context ready for Cursor MCP" : "MCP endpoint check failed", {
      endpoint: "/api/mcp",
      ok: mcpSynced,
      selectedSuggestions: approved.length,
      selectedEnhancements: selectedEnhancements.length,
    });

    return NextResponse.json({
      promptRun,
      mcpSynced,
      backlog: {
        suggestions: approved.length,
        enhancements: selectedEnhancements.length,
        openBugs: backlog.openBugs.length,
        failedUat: backlog.failedUat.length,
        todoTasks: backlog.todoTasks.length,
        queuedUat: queued.uat,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sprint prompt failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth/session";
import { collectSprintBacklog, synthesizeSprintPrompt } from "@/lib/ai/sprint-prompt";
import { addPromptRun, getProject, logActivity } from "@/lib/db/store";
import type { AITool, AiSuggestion } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const { projectId, suggestions } = body as {
      projectId: string;
      suggestions?: AiSuggestion[];
    };

    const project = await getProject(projectId, user.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const approved = (suggestions ?? project.ai_suggestions ?? []).filter(
      (item) => item.approved && (item.status === "pending" || item.status === "applied"),
    );
    const promptText = synthesizeSprintPrompt(project, approved);
    const tool = (project.selected_tool as AITool) || "cursor";

    const promptRun = {
      id: uuidv4(),
      project_id: projectId,
      tool,
      prompt_text: promptText,
      prompt_type: "next-step" as const,
      generated_from_context_version: project.context_versions?.[0]?.id ?? null,
      created_at: new Date().toISOString(),
    };

    await addPromptRun(promptRun);
    const backlog = collectSprintBacklog(project, approved);
    await logActivity(projectId, "sprint_prompt", "Synthesized next-sprint Cursor master prompt", {
      suggestions: approved.length,
      bugs: backlog.openBugs.length,
      uat: backlog.failedUat.length,
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
    });

    return NextResponse.json({
      promptRun,
      mcpSynced,
      backlog: {
        suggestions: approved.length,
        openBugs: backlog.openBugs.length,
        failedUat: backlog.failedUat.length,
        todoTasks: backlog.todoTasks.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sprint prompt failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

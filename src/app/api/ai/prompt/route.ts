import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth/session";
import { analyzeProject, formatBugFixPrompt, regenerateMasterPrompt } from "@/lib/ai/analyze";
import { getProject, addPromptRun, logActivity } from "@/lib/db/store";
import type { AITool, PromptType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const {
      projectId,
      tool,
      promptType = "next-step",
      bugId,
    } = body as {
      projectId: string;
      tool?: AITool;
      promptType?: PromptType;
      bugId?: string;
    };

    const project = await getProject(projectId, user.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const selectedTool = (tool ?? project.selected_tool) as AITool;

    let promptText: string;

    if (promptType === "bug-fix" && bugId) {
      const bug = project.bugs?.find((b) => b.id === bugId);
      if (!bug) {
        return NextResponse.json({ error: "Bug not found" }, { status: 404 });
      }
      promptText = formatBugFixPrompt(bug.title, bug.description ?? "", selectedTool, project.name);
    } else {
      const existingState = {
        completedTasks: project.tasks?.filter((t) => t.status === "done").length ?? 0,
        totalTasks: project.tasks?.length ?? 0,
        failedUAT: project.uat_items?.filter((u) => u.status === "failed").map((u) => u.title) ?? [],
        openBugs: project.bugs?.filter((b) => b.status === "open").length ?? 0,
      };

      const analysis = await analyzeProject(project, project.artifacts ?? [], existingState, promptType);
      promptText = await regenerateMasterPrompt(project, analysis, selectedTool, promptType, existingState);
    }

    const promptRun = {
      id: uuidv4(),
      project_id: projectId,
      tool: selectedTool,
      prompt_text: promptText,
      prompt_type: promptType,
      generated_from_context_version: project.context_versions?.[0]?.id ?? null,
      created_at: new Date().toISOString(),
    };

    await addPromptRun(promptRun);
    await logActivity(projectId, "prompt_generated", `Generated ${promptType} prompt for ${selectedTool}`);

    return NextResponse.json({ promptRun });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Prompt generation failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

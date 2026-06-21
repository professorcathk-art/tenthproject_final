import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth/session";
import {
  analyzeProject,
  getPromptForTool,
} from "@/lib/ai/analyze";
import {
  getProject,
  saveAnalysisResults,
  logActivity,
  clearProjectAIResults,
} from "@/lib/db/store";
import type {
  Bug,
  ContextVersion,
  Enhancement,
  ProjectPhase,
  PromptRun,
  Task,
  UATItem,
  AITool,
  PromptType,
} from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const { projectId, promptType = "initial" } = body as {
      projectId: string;
      promptType?: PromptType;
    };

    const project = await getProject(projectId, user.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (promptType !== "initial") {
      await clearProjectAIResults(projectId);
    }

    const existingState = {
      completedTasks: project.tasks?.filter((t) => t.status === "done").map((t) => t.title) ?? [],
      openBugs: project.bugs?.filter((b) => b.status === "open").map((b) => b.title) ?? [],
      uatSummary: project.uat_items?.reduce(
        (acc, u) => {
          acc[u.status] = (acc[u.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    const analysis = await analyzeProject(
      project,
      project.artifacts ?? [],
      existingState,
      promptType
    );

    const contextVersionId = uuidv4();
    const contextVersion: ContextVersion = {
      id: contextVersionId,
      project_id: projectId,
      summary_text: analysis.projectSummary,
      analysis_json: analysis,
      created_at: new Date().toISOString(),
    };

    const phaseMap = new Map<string, string>();
    const phases: ProjectPhase[] = analysis.phases.map((p, i) => {
      const id = uuidv4();
      phaseMap.set(p.name, id);
      return {
        id,
        project_id: projectId,
        name: p.name,
        description: p.description,
        order: i,
        status: i === 0 ? "in_progress" : "pending",
        created_at: new Date().toISOString(),
      };
    });

    const tasks: Task[] = analysis.tasks.map((t) => ({
      id: uuidv4(),
      project_id: projectId,
      phase_id: t.phase ? phaseMap.get(t.phase) ?? null : null,
      title: t.title,
      description: t.description,
      status: "todo",
      priority: (t.priority as Task["priority"]) || "medium",
      source: "ai",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const uatItems: UATItem[] = analysis.uatItems.map((u) => ({
      id: uuidv4(),
      project_id: projectId,
      task_id: null,
      phase_id: u.phase ? phaseMap.get(u.phase) ?? null : null,
      title: u.title,
      expected_result: u.expectedResult,
      actual_result: null,
      status: "not_started",
      severity: (u.severity as UATItem["severity"]) || "medium",
      remark: null,
      evidence_url: null,
      owner: null,
      priority: "medium",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const bugs: Bug[] = analysis.bugs.map((b) => ({
      id: uuidv4(),
      project_id: projectId,
      linked_uat_item_id: null,
      title: b.title,
      description: b.description,
      severity: (b.severity as Bug["severity"]) || "medium",
      status: "open",
      fix_note: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const enhancements: Enhancement[] = analysis.enhancements.map((e) => ({
      id: uuidv4(),
      project_id: projectId,
      title: e.title,
      description: e.description,
      priority: (e.priority as Enhancement["priority"]) || "medium",
      status: "suggested",
      created_at: new Date().toISOString(),
    }));

    const tool = (project.selected_tool as AITool) || "cursor";
    const promptRun: PromptRun = {
      id: uuidv4(),
      project_id: projectId,
      tool,
      prompt_text: getPromptForTool(analysis, tool),
      prompt_type: promptType,
      generated_from_context_version: contextVersionId,
      created_at: new Date().toISOString(),
    };

    await saveAnalysisResults(
      projectId,
      contextVersion,
      phases,
      tasks,
      uatItems,
      bugs,
      enhancements,
      promptRun
    );

    await logActivity(
      projectId,
      "ai_analysis",
      `AI ${promptType} analysis completed`,
      { promptType, contextVersionId }
    );

    return NextResponse.json({ analysis, contextVersionId, promptRun });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

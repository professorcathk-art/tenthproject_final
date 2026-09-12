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

    if (promptType === "initial") {
      await clearProjectAIResults(projectId);
    }

    const latestRun = project.test_runs?.[0];
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
      liveInspection: latestRun
        ? {
            url: latestRun.url,
            httpStatus: latestRun.http_status ?? latestRun.result_summary,
            summary: latestRun.result_summary,
            consoleErrors: latestRun.console_errors?.slice(0, 6) ?? [],
            accessibilityWarnings: latestRun.accessibility_warnings?.slice(0, 6) ?? [],
          }
        : null,
      approvedSuggestions: (project.ai_suggestions ?? [])
        .filter((item) => item.approved && item.status !== "dismissed")
        .map((item) => `${item.category}: ${item.title}`),
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

    const existingPhaseNames = new Set((project.phases ?? []).map((item) => item.name));
    const existingTaskTitles = new Set((project.tasks ?? []).map((item) => item.title));
    const existingUatTitles = new Set((project.uat_items ?? []).map((item) => item.title));
    const existingBugTitles = new Set((project.bugs ?? []).map((item) => item.title));
    const existingEnhancementTitles = new Set((project.enhancements ?? []).map((item) => item.title));

    const phaseMap = new Map<string, string>();
    for (const phase of project.phases ?? []) phaseMap.set(phase.name, phase.id);
    const phases: ProjectPhase[] = analysis.phases
      .filter((p) => !existingPhaseNames.has(p.name))
      .map((p, i) => {
        const id = uuidv4();
        phaseMap.set(p.name, id);
        return {
          id,
          project_id: projectId,
          name: p.name,
          description: p.description,
          order: (project.phases?.length ?? 0) + i,
          status: i === 0 && !(project.phases?.length) ? "in_progress" : "pending",
          created_at: new Date().toISOString(),
        };
      });

    const tasks: Task[] = analysis.tasks.filter((t) => !existingTaskTitles.has(t.title)).map((t) => ({
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

    const uatItems: UATItem[] = analysis.uatItems.filter((u) => !existingUatTitles.has(u.title)).map((u) => ({
      id: uuidv4(),
      project_id: projectId,
      task_id: null,
      phase_id: u.phase ? phaseMap.get(u.phase) ?? null : null,
      title: u.title,
      test_path: u.testPath?.trim() || null,
      expected_result: u.expectedResult,
      actual_result: null,
      status: "not_started",
      severity: (u.severity as UATItem["severity"]) || "medium",
      remark: null,
      evidence_url: null,
      owner: null,
      priority: u.severity === "high" || u.severity === "critical" ? "high" : u.severity === "low" ? "low" : "medium",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const bugs: Bug[] = analysis.bugs.filter((b) => !existingBugTitles.has(b.title)).map((b) => ({
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

    const enhancements: Enhancement[] = analysis.enhancements.filter((e) => !existingEnhancementTitles.has(e.title)).map((e) => ({
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
      is_executed: false,
      executed_at: null,
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

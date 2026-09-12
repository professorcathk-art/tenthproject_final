import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { analyzeLiveSite, mergeAuditSuggestions } from "@/lib/ai/site-audit";
import { getProject, logActivity, saveAiSuggestions } from "@/lib/db/store";
import type { WebsiteCheckResult } from "@/lib/playwright/check-http";

export const maxDuration = 45;

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const { projectId, testRunId, result } = body as {
      projectId: string;
      testRunId?: string;
      result?: WebsiteCheckResult;
    };

    const project = await getProject(projectId, user.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const latestRun = (project.test_runs ?? []).find((run) => run.id === testRunId) ?? project.test_runs?.[0];
    const inspection: WebsiteCheckResult = result ?? {
      screenshotPath: latestRun?.screenshot_url ?? "",
      screenshotBase64: "",
      consoleErrors: latestRun?.console_errors ?? [],
      accessibilityWarnings: latestRun?.accessibility_warnings ?? [],
      missingElements: [],
      resultSummary: latestRun?.result_summary ?? "No live inspection yet",
      pageTitle: "",
      hasViewport: true,
      httpStatus: latestRun?.http_status ?? null,
      durationMs: latestRun?.duration_ms ?? 0,
    };

    const incoming = await analyzeLiveSite(project, inspection, latestRun?.id ?? testRunId ?? null);
    const suggestions = mergeAuditSuggestions(project.ai_suggestions ?? [], incoming);
    await saveAiSuggestions(projectId, suggestions);
    await logActivity(projectId, "ai_site_audit", `AI diagnostics returned ${incoming.length} suggestion(s)`, {
      testRunId: latestRun?.id ?? null,
      httpStatus: inspection.httpStatus,
    });

    return NextResponse.json({
      suggestions,
      fresh: incoming,
      testRunId: latestRun?.id ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Site analysis failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

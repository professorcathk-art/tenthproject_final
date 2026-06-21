import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth/session";
import { runWebsiteCheck } from "@/lib/playwright/check";
import { getProject, addTestRun, logActivity } from "@/lib/db/store";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const { projectId, url } = body as { projectId: string; url?: string };

    const project = await getProject(projectId, user.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const checkUrl = url ?? project.website_url;
    if (!checkUrl) {
      return NextResponse.json({ error: "No website URL provided" }, { status: 400 });
    }

    const result = await runWebsiteCheck(checkUrl, projectId);

    const testRun = {
      id: uuidv4(),
      project_id: projectId,
      url: checkUrl,
      browser: "chromium",
      screenshot_url: result.screenshotPath || null,
      console_errors: result.consoleErrors,
      accessibility_warnings: [
        ...result.accessibilityWarnings,
        ...result.missingElements,
      ],
      result_summary: result.resultSummary,
      created_at: new Date().toISOString(),
    };

    await addTestRun(testRun);
    await logActivity(projectId, "website_check", result.resultSummary, {
      url: checkUrl,
      issues: result.consoleErrors.length + result.accessibilityWarnings.length,
    });

    return NextResponse.json({ testRun, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Website check failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

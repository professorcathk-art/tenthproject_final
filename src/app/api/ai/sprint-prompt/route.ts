import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { SPRINT_PROMPT_SYSTEM } from "@/lib/ai/sprint-prompt";
import { openNextSprint } from "@/lib/ai/open-next-sprint";
import { logActivity } from "@/lib/db/store";
import type { AiSuggestion } from "@/types";

export const SYSTEM_PROMPT = SPRINT_PROMPT_SYSTEM;

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const { projectId, suggestions, suggestionIds, enhancementIds, taskIds } = body as {
      projectId: string;
      suggestions?: AiSuggestion[];
      suggestionIds?: string[];
      enhancementIds?: string[];
      taskIds?: string[];
    };

    const opened = await openNextSprint({
      projectId,
      userId: user.id,
      suggestions,
      suggestionIds,
      enhancementIds,
      taskIds,
    });
    if (!opened.ok) {
      return NextResponse.json(
        { error: opened.error, message: "message" in opened ? opened.message : undefined, unmarked: "unmarked" in opened ? opened.unmarked : undefined },
        { status: opened.status },
      );
    }

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
      selectedSuggestions: opened.backlog.suggestions,
      selectedEnhancements: opened.backlog.enhancements,
    });

    return NextResponse.json({ promptRun: opened.promptRun, mcpSynced, backlog: opened.backlog });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sprint prompt failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

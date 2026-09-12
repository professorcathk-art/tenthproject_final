import { getProject, updateUATItem, logActivity } from "@/lib/db/store";
import type { UATStatus } from "@/types";

export const MCP_TOOLS = [
  {
    name: "get_active_roadmap",
    description: "Fetch current sprint tasks, phases, and next action for the project",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "fetch_uat_status",
    description: "Retrieve UAT items with their current status, filterable by status",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status e.g. failed, not_started" },
      },
    },
  },
  {
    name: "update_uat_item",
    description: "Update a UAT item status after running local tests",
    inputSchema: {
      type: "object",
      properties: {
        uat_id: { type: "string" },
        status: { type: "string", enum: ["passed", "failed", "fixed", "verified", "in_progress", "needs_review"] },
        remark: { type: "string" },
      },
      required: ["uat_id", "status"],
    },
  },
  {
    name: "get_sprint_prompt",
    description: "Fetch the latest Cursor master prompt and approved AI audit suggestions for this sprint",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "log_bug",
    description: "Log a bug when a build or test fails in Cursor",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
      },
      required: ["title", "description"],
    },
  },
];

export async function executeMcpTool(
  toolName: string,
  args: Record<string, unknown>,
  projectId: string,
  userId: string
) {
  const project = await getProject(projectId, userId);
  if (!project) throw new Error("Project not found");

  switch (toolName) {
    case "get_active_roadmap": {
      const latestPrompt = project.prompt_runs?.[0] ?? null;
      return {
        project: project.name,
        stage: project.stage,
        phases: project.phases ?? [],
        tasks: (project.tasks ?? []).map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          description: t.description,
        })),
        nextAction: project.context_versions?.[0]?.analysis_json?.nextAction ?? "Complete highest priority task",
        openBugs: (project.bugs ?? []).filter((b) => b.status === "open").length,
        approvedSuggestions: (project.ai_suggestions ?? [])
          .filter((item) => item.approved && item.status !== "dismissed")
          .map((item) => ({ id: item.id, title: item.title, category: item.category, severity: item.severity })),
        latestPromptType: latestPrompt?.prompt_type ?? null,
        latestPromptAt: latestPrompt?.created_at ?? null,
      };
    }

    case "get_sprint_prompt": {
      const latestPrompt = project.prompt_runs?.[0] ?? null;
      return {
        project: project.name,
        website_url: project.website_url,
        prompt: latestPrompt?.prompt_text ?? null,
        prompt_type: latestPrompt?.prompt_type ?? null,
        created_at: latestPrompt?.created_at ?? null,
        suggestions: project.ai_suggestions ?? [],
        failedUat: (project.uat_items ?? [])
          .filter((item) => item.status === "failed" || item.status === "reopened")
          .map((item) => ({ id: item.id, title: item.title, status: item.status })),
        openBugs: (project.bugs ?? [])
          .filter((bug) => bug.status === "open" || bug.status === "in_progress")
          .map((bug) => ({ id: bug.id, title: bug.title, severity: bug.severity })),
      };
    }

    case "fetch_uat_status": {
      let items = project.uat_items ?? [];
      if (args.status) items = items.filter((u) => u.status === args.status);
      return {
        total: items.length,
        items: items.map((u) => ({
          id: u.id,
          title: u.title,
          status: u.status,
          expected_result: u.expected_result,
          test_path: u.test_path,
          priority: u.priority,
          severity: u.severity,
          remark: u.remark,
        })),
      };
    }

    case "update_uat_item": {
      const uatId = String(args.uat_id);
      const status = String(args.status) as UATStatus;
      const remark = args.remark ? String(args.remark) : undefined;
      const updated = await updateUATItem(uatId, projectId, { status, remark }, remark ? { text: remark, updatedBy: "Cursor MCP" } : undefined);
      return { success: true, uat: updated };
    }

    case "log_bug": {
      const { v4: uuidv4 } = await import("uuid");
      const bug = {
        id: uuidv4(),
        project_id: projectId,
        linked_uat_item_id: null,
        title: String(args.title),
        description: String(args.description),
        severity: (args.severity as string) ?? "medium",
        status: "open" as const,
        fix_note: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { isSupabaseConfigured, createServiceClient } = await import("@/lib/supabase/server");
      if (isSupabaseConfigured()) {
        await createServiceClient().from("bugs").insert(bug);
      } else {
        const { promises: fs } = await import("fs");
        const path = await import("path");
        const storeFile = path.join(process.cwd(), ".data", "store.json");
        try {
          const store = JSON.parse(await fs.readFile(storeFile, "utf-8"));
          store.bugs = store.bugs ?? [];
          store.bugs.push(bug);
          await fs.writeFile(storeFile, JSON.stringify(store, null, 2));
        } catch { /* store will sync on next read */ }
      }

      await logActivity(projectId, "bug_logged", `Bug logged via MCP: ${bug.title}`, { source: "cursor_mcp" });
      return { success: true, bug: { id: bug.id, title: bug.title } };
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

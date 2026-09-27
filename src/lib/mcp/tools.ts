import { getProject, updateUATItem, updateTask, logActivity, setPromptExecution } from "@/lib/db/store";
import { openNextSprint } from "@/lib/ai/open-next-sprint";
import { shippingCue } from "@/lib/mcp/shipping";
import type { Task, UATStatus } from "@/types";

const MCP_TASK_STATUS = {
  todo: "todo",
  in_progress: "in_progress",
  completed: "done",
} as const;

export const MCP_TOOLS = [
  {
    name: "get_active_roadmap",
    description:
      "每次只做一件事之前先呼叫。只把 shipping.nextStep.say 問使用者。使用者回覆確認後，只做 shipping.nextStep.onConfirm。做完再呼叫一次。不要一次問很多步，也不要在沒確認時改程式。",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "fetch_uat_status",
    description: "查看驗收項目與狀態。出貨停住時，用它列出還沒標成通過或失敗的項目。",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status e.g. failed, not_started" },
      },
    },
  },
  {
    name: "update_uat_item",
    description: "更新一條驗收。只有你實際測過，或使用者明確說通過或失敗，才可以改。",
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
    description:
      "讀取最新一輪出貨提示詞和 shipping 狀態。若 shipping.mustStop 是 true，停下來問使用者，不要把舊提示詞再做一遍，也不要自己開下一輪。",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "log_bug",
    description: "建置或測試失敗時記錄一筆錯誤，讓下一輪可以帶著修。",
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
  {
    name: "update_task_status",
    description: "把看板上的任務標成 todo、in_progress 或 completed。只標你真的做完的任務。",
    inputSchema: {
      type: "object",
      properties: {
        task_id: { type: "string", description: "任務 ID" },
        status: { type: "string", enum: ["todo", "in_progress", "completed"], description: "todo、in_progress 或 completed" },
        commit_msg: { type: "string", description: "關聯的 Git Commit 訊息" },
      },
      required: ["task_id", "status"],
    },
  },
  {
    name: "report_build_status",
    description: "回報這一次建置是成功還是失敗。失敗會自動記一筆錯誤。",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["success", "failed"] },
        error_log: { type: "string", description: "終端機輸出的錯誤訊息全文" },
        environment: { type: "string", enum: ["local", "vercel"], description: "預設 local" },
      },
      required: ["status"],
    },
  },
  {
    name: "start_next_sprint",
    description:
      "只有使用者明確同意繼續下一衝刺才呼叫，而且 confirmed 必須是 true。沒有同意會被拒絕。還沒標成通過或失敗的驗收也會擋住。沒有傳入的 task_ids 不會變成新功能。開完之後做完那一輪就要再問一次。",
    inputSchema: {
      type: "object",
      properties: {
        confirmed: { type: "boolean", description: "使用者這次對話明確同意繼續時才是 true" },
        task_ids: { type: "array", items: { type: "string" }, description: "使用者點名要帶進下一輪的任務" },
        enhancement_ids: { type: "array", items: { type: "string" }, description: "使用者點名的改進" },
        suggestion_ids: { type: "array", items: { type: "string" }, description: "使用者點名的 AI 建議" },
      },
      required: ["confirmed"],
    },
  },
];

function mcpTaskStatus(stored: string) {
  return stored === "done" ? "completed" : stored;
}

async function insertMcpBug(
  projectId: string,
  input: { title: string; description: string; severity?: string },
) {
  const { v4: uuidv4 } = await import("uuid");
  const bug = {
    id: uuidv4(),
    project_id: projectId,
    linked_uat_item_id: null,
    title: input.title,
    description: input.description,
    severity: input.severity ?? "medium",
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
    } catch {
      /* store will sync on next read */
    }
  }

  await logActivity(projectId, "bug_logged", `Bug logged via MCP: ${bug.title}`, { source: "cursor_mcp" });
  return { id: bug.id, title: bug.title };
}

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
          status: mcpTaskStatus(t.status),
          priority: t.priority,
          description: t.description,
          technical_checklist: t.technical_checklist ?? [],
        })),
        nextAction: project.context_versions?.[0]?.analysis_json?.nextAction ?? "Complete highest priority task",
        openBugs: (project.bugs ?? []).filter((b) => b.status === "open").length,
        approvedSuggestions: (project.ai_suggestions ?? [])
          .filter((item) => item.approved && item.status !== "dismissed")
          .map((item) => ({ id: item.id, title: item.title, category: item.category, severity: item.severity })),
        plannedEnhancements: (project.enhancements ?? [])
          .filter((item) => item.status === "planned")
          .map((item) => ({ id: item.id, title: item.title, priority: item.priority })),
        openUat: (project.uat_items ?? [])
          .filter((item) => item.status === "not_started" || item.status === "in_progress" || item.status === "failed" || item.status === "reopened")
          .map((item) => ({ id: item.id, title: item.title, status: item.status, test_path: item.test_path })),
        latestPromptType: latestPrompt?.prompt_type ?? null,
        latestPromptAt: latestPrompt?.created_at ?? null,
        latestPromptExecuted: latestPrompt?.is_executed ?? false,
        shipping: projectShipping(project),
      };
    }

    case "get_sprint_prompt": {
      const latestPrompt = project.prompt_runs?.[0] ?? null;
      const newestFirst = [...(project.prompt_runs ?? [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      const newest = newestFirst[0] ?? latestPrompt;
      return {
        project: project.name,
        website_url: project.website_url,
        newest: true,
        prompt: newest?.prompt_text ?? null,
        prompt_type: newest?.prompt_type ?? null,
        created_at: newest?.created_at ?? null,
        is_executed: newest?.is_executed ?? false,
        executed_at: newest?.executed_at ?? null,
        versions: newestFirst.slice(0, 8).map((run) => ({
          id: run.id,
          prompt_type: run.prompt_type,
          created_at: run.created_at,
          is_executed: run.is_executed,
        })),
        sprint_scope: {
          appliedSuggestions: (project.ai_suggestions ?? [])
            .filter((item) => item.status === "applied")
            .map((item) => ({ id: item.id, title: item.title, category: item.category, severity: item.severity })),
          plannedEnhancements: (project.enhancements ?? [])
            .filter((item) => item.status === "planned")
            .map((item) => ({ id: item.id, title: item.title, description: item.description, priority: item.priority })),
        },
        openUat: (project.uat_items ?? [])
          .filter((item) =>
            ["not_started", "in_progress", "failed", "reopened", "needs_review"].includes(item.status),
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
            status: item.status,
            test_path: item.test_path,
            expected_result: item.expected_result,
            priority: item.priority,
          })),
        failedUat: (project.uat_items ?? [])
          .filter((item) => item.status === "failed" || item.status === "reopened")
          .map((item) => ({ id: item.id, title: item.title, status: item.status })),
        openBugs: (project.bugs ?? [])
          .filter((bug) => bug.status === "open" || bug.status === "in_progress")
          .map((bug) => ({ id: bug.id, title: bug.title, severity: bug.severity })),
        shipping: projectShipping(project),
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
      const bug = await insertMcpBug(projectId, {
        title: String(args.title),
        description: String(args.description),
        severity: args.severity ? String(args.severity) : "medium",
      });
      return { success: true, bug };
    }

    case "update_task_status": {
      const taskId = String(args.task_id ?? "");
      const requested = String(args.status ?? "");
      if (!taskId) throw new Error("task_id is required");
      if (!(requested in MCP_TASK_STATUS)) {
        throw new Error("status must be todo, in_progress, or completed");
      }
      const task = project.tasks?.find((item) => item.id === taskId);
      if (!task) throw new Error("Task not found");
      const stored = MCP_TASK_STATUS[requested as keyof typeof MCP_TASK_STATUS];
      const updated = await updateTask(taskId, projectId, { status: stored as Task["status"] });
      const commitMsg = args.commit_msg ? String(args.commit_msg).slice(0, 500) : null;
      await logActivity(projectId, "task_updated", `Task marked ${requested} via MCP: ${task.title}`, {
        source: "cursor_mcp",
        task_id: taskId,
        status: requested,
        commit_msg: commitMsg,
      });
      return {
        success: true,
        task: { id: updated.id, title: updated.title, status: mcpTaskStatus(updated.status) },
        commit_msg: commitMsg,
      };
    }

    case "report_build_status": {
      const status = String(args.status ?? "");
      if (status !== "success" && status !== "failed") {
        throw new Error("status must be success or failed");
      }
      const environment = args.environment == null || args.environment === "" ? "local" : String(args.environment);
      if (environment !== "local" && environment !== "vercel") {
        throw new Error("environment must be local or vercel");
      }
      const errorLog = args.error_log ? String(args.error_log).slice(0, 20000) : "";
      if (status === "success") {
        await logActivity(projectId, "build_reported", `Build succeeded via MCP (${environment})`, {
          source: "cursor_mcp",
          status,
          environment,
        });
        return { success: true, status, environment, bug: null };
      }
      const bug = await insertMcpBug(projectId, {
        title: `Build Failed in ${environment}`,
        description: errorLog || "Build failed without an error log.",
        severity: "high",
      });
      await logActivity(projectId, "build_reported", `Build failed via MCP (${environment})`, {
        source: "cursor_mcp",
        status,
        environment,
      });
      return { success: true, status, environment, bug };
    }

    case "start_next_sprint":
      return startNextSprint(project, args, projectId, userId);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

function projectShipping(project: NonNullable<Awaited<ReturnType<typeof getProject>>>) {
  const bugs = (project.bugs ?? []).filter((bug) => bug.status === "open" || bug.status === "in_progress");
  return shippingCue({
    uatItems: (project.uat_items ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      expected_result: item.expected_result,
      test_path: item.test_path,
    })),
    tasks: (project.tasks ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
    })),
    openBugCount: bugs.length,
  });
}

function idList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
}

async function startNextSprint(
  project: NonNullable<Awaited<ReturnType<typeof getProject>>>,
  args: Record<string, unknown>,
  projectId: string,
  userId: string,
) {
  const agreed = args.confirmed === true || args.confirmed === "true";
  const shipping = projectShipping(project);
  if (!agreed) {
    return { started: false, reason: "need_confirmation", shipping, askUser: shipping.askUser };
  }
  if (shipping.phase === "build") {
    return {
      started: false,
      reason: "round_open",
      openTasks: shipping.openTasks,
      askUser: "這一輪還有未完成的任務。先做完，或告訴我哪些要帶進下一輪。不要在沒問過的情況下直接開下一輪。",
    };
  }
  if (shipping.phase === "waiting_for_uat") {
    return {
      started: false,
      reason: "uat_unmarked",
      unmarked: shipping.unmarkedUat,
      askUser: shipping.askUser,
    };
  }
  const taskIds = idList(args.task_ids);
  const enhancementIds = idList(args.enhancement_ids);
  const suggestionIds = idList(args.suggestion_ids);
  if (shipping.phase === "idle" && !taskIds.length && !enhancementIds.length && !suggestionIds.length) {
    return { started: false, reason: "nothing_to_ship", askUser: shipping.askUser };
  }

  const previousId = project.prompt_runs?.[0]?.id ?? null;
  const opened = await openNextSprint({ projectId, userId, taskIds, enhancementIds, suggestionIds });
  if (!opened.ok) {
    return {
      started: false,
      reason: opened.error,
      message: "message" in opened ? opened.message : opened.error,
      unmarked: "unmarked" in opened ? opened.unmarked : [],
    };
  }
  if (previousId && previousId !== opened.promptRun.id) {
    await setPromptExecution(previousId, projectId, true);
  }
  return {
    started: true,
    promptRunId: opened.promptRun.id,
    prompt: opened.promptRun.prompt_text,
    backlog: opened.backlog,
    askUser: "下一輪的範圍已經寫好。請立刻呼叫 get_active_roadmap，只把 nextStep.say 問使用者。使用者回覆「確認」才做那一件。",
  };
}

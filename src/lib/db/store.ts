import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  ActivityLog,
  AiSuggestion,
  Bug,
  ContextVersion,
  Enhancement,
  Profile,
  Project,
  ProjectArtifact,
  ProjectPhase,
  PromptRun,
  Task,
  TestRun,
  UATItem,
  UATRemark,
} from "@/types";
import { DEMO_USER } from "@/lib/auth/session";
import { inferTargetFile } from "@/lib/ai/executable-spec";
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase/server";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const CAN_PERSIST_LOCAL = !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;

interface LocalStore {
  profiles: Profile[];
  projects: Project[];
  artifacts: ProjectArtifact[];
  phases: ProjectPhase[];
  tasks: Task[];
  uatItems: UATItem[];
  uatRemarks: UATRemark[];
  bugs: Bug[];
  enhancements: Enhancement[];
  promptRuns: PromptRun[];
  contextVersions: ContextVersion[];
  testRuns: TestRun[];
  activityLogs: ActivityLog[];
  aiSuggestions: AiSuggestion[];
}

const emptyStore = (): LocalStore => ({
  profiles: [DEMO_USER],
  projects: [],
  artifacts: [],
  phases: [],
  tasks: [],
  uatItems: [],
  uatRemarks: [],
  bugs: [],
  enhancements: [],
  promptRuns: [],
  contextVersions: [],
  testRuns: [],
  activityLogs: [],
  aiSuggestions: [],
});

const SITE_AUDIT_MARKER = "site_audit_suggestions";

function asSuggestionBundle(value: unknown): AiSuggestion[] {
  if (!value || typeof value !== "object") return [];
  const record = value as { kind?: string; suggestions?: AiSuggestion[] };
  if (record.kind !== "site_audit" || !Array.isArray(record.suggestions)) return [];
  return record.suggestions;
}

async function persistStoreFile(store: LocalStore) {
  if (!CAN_PERSIST_LOCAL) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2));
  } catch (error) {
    console.warn("Local project store is memory-only:", error);
  }
}

async function ensureStore(): Promise<LocalStore> {
  if (CAN_PERSIST_LOCAL) {
    try {
      const raw = await fs.readFile(STORE_FILE, "utf-8");
      const parsed = JSON.parse(raw) as LocalStore;
      parsed.aiSuggestions = parsed.aiSuggestions ?? [];
      return parsed;
    } catch {
      /* seed an empty local file below */
    }
  }
  const store = emptyStore();
  await persistStoreFile(store);
  return store;
}

async function saveStore(store: LocalStore) {
  await persistStoreFile(store);
}

export async function logActivity(
  projectId: string,
  eventType: string,
  message: string,
  metadata: Record<string, unknown> = {}
) {
  const entry: ActivityLog = {
    id: uuidv4(),
    project_id: projectId,
    event_type: eventType,
    message,
    metadata,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("activity_logs").insert(entry);
    return entry;
  }

  const store = await ensureStore();
  store.activityLogs.unshift(entry);
  await saveStore(store);
  return entry;
}

export const getProjects = cache(async function getProjects(userId: string): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .neq("status", "archived")
      .order("updated_at", { ascending: false });
    return (data ?? []) as Project[];
  }

  const store = await ensureStore();
  return store.projects
    .filter((p) => p.user_id === userId && p.status !== "archived")
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
});

export async function getProject(projectId: string, userId: string) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (!project) return null;

    const [phases, tasks, uatItems, bugs, enhancements, artifacts, promptRuns, contextVersions, testRuns, activityLogs] =
      await Promise.all([
        supabase.from("project_phases").select("*").eq("project_id", projectId).order("order"),
        supabase.from("tasks").select("*").eq("project_id", projectId),
        supabase.from("uat_items").select("*").eq("project_id", projectId),
        supabase.from("bugs").select("*").eq("project_id", projectId),
        supabase.from("enhancements").select("*").eq("project_id", projectId),
        supabase.from("project_artifacts").select("*").eq("project_id", projectId),
        supabase.from("prompt_runs").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
        supabase.from("context_versions").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
        supabase.from("test_runs").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
        supabase.from("activity_logs").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(50),
      ]);

    const suggestions = await loadAiSuggestions(projectId);

    return {
      ...(project as Project),
      phases: phases.data ?? [],
      tasks: tasks.data ?? [],
      uat_items: uatItems.data ?? [],
      bugs: bugs.data ?? [],
      enhancements: enhancements.data ?? [],
      artifacts: artifacts.data ?? [],
      prompt_runs: ((promptRuns.data ?? []) as PromptRun[]).map(normalizePromptRun),
      context_versions: contextVersions.data ?? [],
      test_runs: testRuns.data ?? [],
      activity_logs: activityLogs.data ?? [],
      ai_suggestions: suggestions,
    };
  }

  const store = await ensureStore();
  const project = store.projects.find((p) => p.id === projectId && p.user_id === userId);
  if (!project) return null;

  return {
    ...project,
    phases: store.phases.filter((p) => p.project_id === projectId).sort((a, b) => a.order - b.order),
    tasks: store.tasks.filter((t) => t.project_id === projectId),
    uat_items: store.uatItems.filter((u) => u.project_id === projectId),
    bugs: store.bugs.filter((b) => b.project_id === projectId),
    enhancements: store.enhancements.filter((e) => e.project_id === projectId),
    artifacts: store.artifacts.filter((a) => a.project_id === projectId),
    prompt_runs: store.promptRuns.filter((p) => p.project_id === projectId).map(normalizePromptRun),
    context_versions: store.contextVersions.filter((c) => c.project_id === projectId),
    test_runs: store.testRuns.filter((t) => t.project_id === projectId),
    activity_logs: store.activityLogs.filter((a) => a.project_id === projectId).slice(0, 50),
    ai_suggestions: store.aiSuggestions.filter((item) => item.project_id === projectId),
  };
}

export async function ensureProfile(user: {
  id: string;
  email: string;
  name: string;
  default_ai_model?: string;
  default_tool?: string;
}) {
  if (!isSupabaseConfigured()) return;
  const supabase = createServiceClient();
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    name: user.name,
    default_ai_model: user.default_ai_model ?? "openai",
    default_tool: user.default_tool ?? "cursor",
  });
  if (error) throw new Error(error.message);
}

export async function createProject(
  userId: string,
  data: Omit<Project, "id" | "user_id" | "created_at" | "updated_at" | "status">
): Promise<Project> {
  const now = new Date().toISOString();
  const project: Project = {
    id: uuidv4(),
    user_id: userId,
    status: "active",
    created_at: now,
    updated_at: now,
    ...data,
  };

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data: created, error } = await supabase.from("projects").insert(project).select().single();
    if (error) throw new Error(error.message);
    await logActivity(created.id, "project_created", `Project "${created.name}" created`);
    return created as Project;
  }

  const store = await ensureStore();
  store.projects.unshift(project);
  await saveStore(store);
  await logActivity(project.id, "project_created", `Project "${project.name}" created`);
  return project;
}

export async function updateProject(projectId: string, userId: string, updates: Partial<Project>) {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("projects")
      .update({ ...updates, updated_at: now })
      .eq("id", projectId)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  }

  const store = await ensureStore();
  const idx = store.projects.findIndex((p) => p.id === projectId && p.user_id === userId);
  if (idx === -1) throw new Error("Project not found");
  store.projects[idx] = { ...store.projects[idx], ...updates, updated_at: now };
  await saveStore(store);
  return store.projects[idx];
}

export async function archiveProject(projectId: string, userId: string) {
  return updateProject(projectId, userId, { status: "archived" });
}

export function normalizePromptRun(run: PromptRun): PromptRun {
  return {
    ...run,
    is_executed: Boolean(run.is_executed),
    executed_at: run.executed_at ?? null,
  };
}

export async function deleteProject(projectId: string, userId: string) {
  const owned = await getProject(projectId, userId);
  if (!owned) throw new Error("Project not found");

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return;
  }

  const store = await ensureStore();
  store.projects = store.projects.filter((p) => p.id !== projectId);
  store.artifacts = store.artifacts.filter((item) => item.project_id !== projectId);
  store.phases = store.phases.filter((item) => item.project_id !== projectId);
  store.tasks = store.tasks.filter((item) => item.project_id !== projectId);
  store.uatItems = store.uatItems.filter((item) => item.project_id !== projectId);
  store.uatRemarks = store.uatRemarks.filter((item) => {
    const parent = store.uatItems.find((uat) => uat.id === item.uat_item_id);
    return Boolean(parent);
  });
  store.bugs = store.bugs.filter((item) => item.project_id !== projectId);
  store.enhancements = store.enhancements.filter((item) => item.project_id !== projectId);
  store.promptRuns = store.promptRuns.filter((item) => item.project_id !== projectId);
  store.contextVersions = store.contextVersions.filter((item) => item.project_id !== projectId);
  store.testRuns = store.testRuns.filter((item) => item.project_id !== projectId);
  store.activityLogs = store.activityLogs.filter((item) => item.project_id !== projectId);
  store.aiSuggestions = store.aiSuggestions.filter((item) => item.project_id !== projectId);
  await saveStore(store);
}

export async function setPromptExecution(
  promptRunId: string,
  projectId: string,
  isExecuted: boolean,
) {
  const now = new Date().toISOString();
  const executedAt = isExecuted ? now : null;

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("prompt_runs")
      .update({ is_executed: isExecuted, executed_at: executedAt })
      .eq("id", promptRunId)
      .eq("project_id", projectId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logActivity(
      projectId,
      isExecuted ? "prompt_executed" : "prompt_unexecuted",
      isExecuted ? "標記為已貼至 Cursor 執行" : "取消 Cursor 執行標記",
      { promptRunId },
    );
    return normalizePromptRun(data as PromptRun);
  }

  const store = await ensureStore();
  const idx = store.promptRuns.findIndex((run) => run.id === promptRunId && run.project_id === projectId);
  if (idx === -1) throw new Error("Prompt run not found");
  store.promptRuns[idx] = {
    ...normalizePromptRun(store.promptRuns[idx]),
    is_executed: isExecuted,
    executed_at: executedAt,
  };
  await saveStore(store);
  await logActivity(
    projectId,
    isExecuted ? "prompt_executed" : "prompt_unexecuted",
    isExecuted ? "標記為已貼至 Cursor 執行" : "取消 Cursor 執行標記",
    { promptRunId },
  );
  return store.promptRuns[idx];
}

export async function saveAnalysisResults(
  projectId: string,
  contextVersion: ContextVersion,
  phases: ProjectPhase[],
  tasks: Task[],
  uatItems: UATItem[],
  bugs: Bug[],
  enhancements: Enhancement[],
  promptRun: PromptRun
) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("context_versions").insert(contextVersion);
    if (phases.length) await supabase.from("project_phases").insert(phases);
    if (tasks.length) await supabase.from("tasks").insert(tasks);
    if (uatItems.length) await supabase.from("uat_items").insert(uatItems);
    if (bugs.length) await supabase.from("bugs").insert(bugs);
    if (enhancements.length) await supabase.from("enhancements").insert(enhancements);
    await supabase.from("prompt_runs").insert(promptRun);
    return;
  }

  const store = await ensureStore();
  store.contextVersions.unshift(contextVersion);
  store.phases.push(...phases);
  store.tasks.push(...tasks);
  store.uatItems.push(...uatItems);
  store.bugs.push(...bugs);
  store.enhancements.push(...enhancements);
  store.promptRuns.unshift(promptRun);
  await saveStore(store);
}

export async function addArtifact(artifact: ProjectArtifact) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("project_artifacts").insert(artifact);
    return artifact;
  }
  const store = await ensureStore();
  store.artifacts.push(artifact);
  await saveStore(store);
  return artifact;
}

export async function updateUATItem(
  uatId: string,
  projectId: string,
  updates: Partial<UATItem>,
  remark?: { text: string; updatedBy: string; evidenceUrl?: string }
) {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data: existing } = await supabase.from("uat_items").select("*").eq("id", uatId).single();
    const { data, error } = await supabase
      .from("uat_items")
      .update({ ...updates, updated_at: now })
      .eq("id", uatId)
      .eq("project_id", projectId)
      .select()
      .single();
    if (error) throw error;

    if (remark) {
      await supabase.from("uat_remarks").insert({
        id: uuidv4(),
        uat_item_id: uatId,
        remark: remark.text,
        status_before: existing?.status,
        status_after: updates.status ?? existing?.status,
        evidence_url: remark.evidenceUrl,
        updated_by: remark.updatedBy,
        created_at: now,
      });
    }

    if (updates.status && updates.status !== existing?.status) {
      await logActivity(projectId, "uat_status_changed", `UAT "${data.title}" status: ${existing?.status} → ${updates.status}`, {
        uatId,
        from: existing?.status,
        to: updates.status,
      });
    }
    return data as UATItem;
  }

  const store = await ensureStore();
  const idx = store.uatItems.findIndex((u) => u.id === uatId && u.project_id === projectId);
  if (idx === -1) throw new Error("UAT item not found");
  const existing = store.uatItems[idx];
  store.uatItems[idx] = { ...existing, ...updates, updated_at: now };

  if (remark) {
    store.uatRemarks.unshift({
      id: uuidv4(),
      uat_item_id: uatId,
      remark: remark.text,
      status_before: existing.status,
      status_after: updates.status ?? existing.status,
      evidence_url: remark.evidenceUrl ?? null,
      updated_by: remark.updatedBy,
      created_at: now,
    });
  }

  if (updates.status && updates.status !== existing.status) {
    await logActivity(projectId, "uat_status_changed", `UAT "${existing.title}" status: ${existing.status} → ${updates.status}`, {
      uatId,
      from: existing.status,
      to: updates.status,
    });
  }

  await saveStore(store);
  return store.uatItems[idx];
}

export async function getUATItem(uatId: string, projectId: string) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data: item } = await supabase.from("uat_items").select("*").eq("id", uatId).eq("project_id", projectId).single();
    const { data: remarks } = await supabase
      .from("uat_remarks")
      .select("*")
      .eq("uat_item_id", uatId)
      .order("created_at", { ascending: false });
    return { item, remarks: remarks ?? [] };
  }

  const store = await ensureStore();
  const item = store.uatItems.find((u) => u.id === uatId && u.project_id === projectId) ?? null;
  const remarks = store.uatRemarks.filter((r) => r.uat_item_id === uatId);
  return { item, remarks };
}

export async function updateBug(bugId: string, projectId: string, updates: Partial<Bug>) {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("bugs")
      .update({ ...updates, updated_at: now })
      .eq("id", bugId)
      .eq("project_id", projectId)
      .select()
      .single();
    if (error) throw error;
    return data as Bug;
  }

  const store = await ensureStore();
  const idx = store.bugs.findIndex((b) => b.id === bugId && b.project_id === projectId);
  if (idx === -1) throw new Error("Bug not found");
  store.bugs[idx] = { ...store.bugs[idx], ...updates, updated_at: now };
  await saveStore(store);
  return store.bugs[idx];
}

export async function createTask(
  projectId: string,
  data: { title: string; description?: string | null; priority?: Task["priority"]; source?: Task["source"] },
) {
  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    project_id: projectId,
    phase_id: null,
    title: data.title.trim(),
    description: data.description?.trim() || null,
    status: "todo",
    priority: data.priority ?? "medium",
    source: data.source ?? "manual",
    created_at: now,
    updated_at: now,
  };
  if (isSupabaseConfigured()) {
    const { data: created, error } = await createServiceClient().from("tasks").insert(task).select().single();
    if (error) throw new Error(error.message);
    await logActivity(projectId, "task_created", `Task "${task.title}" added`);
    return created as Task;
  }
  const store = await ensureStore();
  store.tasks.push(task);
  await saveStore(store);
  await logActivity(projectId, "task_created", `Task "${task.title}" added`);
  return task;
}

export async function deleteTask(taskId: string, projectId: string) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("tasks").delete().eq("id", taskId).eq("project_id", projectId);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensureStore();
  store.tasks = store.tasks.filter((item) => !(item.id === taskId && item.project_id === projectId));
  await saveStore(store);
}

export async function createUATItem(
  projectId: string,
  data: {
    title: string;
    expected_result?: string | null;
    test_path?: string | null;
    severity?: UATItem["severity"];
    priority?: UATItem["priority"];
  },
) {
  const now = new Date().toISOString();
  const priority = data.priority ?? (data.severity === "high" || data.severity === "critical" ? "high" : data.severity === "low" ? "low" : "medium");
  const item: UATItem = {
    id: uuidv4(),
    project_id: projectId,
    task_id: null,
    phase_id: null,
    title: data.title.trim(),
    test_path: data.test_path?.trim() || null,
    expected_result: data.expected_result?.trim() || null,
    actual_result: null,
    status: "not_started",
    severity: data.severity ?? (priority === "high" ? "high" : priority === "low" ? "low" : "medium"),
    remark: null,
    evidence_url: null,
    owner: null,
    priority,
    created_at: now,
    updated_at: now,
  };
  if (isSupabaseConfigured()) {
    const { data: created, error } = await createServiceClient().from("uat_items").insert(item).select().single();
    if (error) throw new Error(error.message);
    await logActivity(projectId, "uat_created", `UAT "${item.title}" added`);
    return created as UATItem;
  }
  const store = await ensureStore();
  store.uatItems.push(item);
  await saveStore(store);
  await logActivity(projectId, "uat_created", `UAT "${item.title}" added`);
  return item;
}

export async function deleteUATItem(uatId: string, projectId: string) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("uat_remarks").delete().eq("uat_item_id", uatId);
    const { error } = await supabase.from("uat_items").delete().eq("id", uatId).eq("project_id", projectId);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensureStore();
  store.uatRemarks = store.uatRemarks.filter((item) => item.uat_item_id !== uatId);
  store.uatItems = store.uatItems.filter((item) => !(item.id === uatId && item.project_id === projectId));
  await saveStore(store);
}

export async function createBug(
  projectId: string,
  data: { title: string; description?: string | null; severity?: Bug["severity"] },
) {
  const now = new Date().toISOString();
  const bug: Bug = {
    id: uuidv4(),
    project_id: projectId,
    linked_uat_item_id: null,
    title: data.title.trim(),
    description: data.description?.trim() || null,
    severity: data.severity ?? "medium",
    status: "open",
    fix_note: null,
    created_at: now,
    updated_at: now,
  };
  if (isSupabaseConfigured()) {
    const { data: created, error } = await createServiceClient().from("bugs").insert(bug).select().single();
    if (error) throw new Error(error.message);
    await logActivity(projectId, "bug_created", `Bug "${bug.title}" added`);
    return created as Bug;
  }
  const store = await ensureStore();
  store.bugs.push(bug);
  await saveStore(store);
  await logActivity(projectId, "bug_created", `Bug "${bug.title}" added`);
  return bug;
}

export async function deleteBug(bugId: string, projectId: string) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("bugs").delete().eq("id", bugId).eq("project_id", projectId);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensureStore();
  store.bugs = store.bugs.filter((item) => !(item.id === bugId && item.project_id === projectId));
  await saveStore(store);
}

export async function createEnhancement(
  projectId: string,
  data: { title: string; description?: string | null; priority?: Enhancement["priority"] },
) {
  const item: Enhancement = {
    id: uuidv4(),
    project_id: projectId,
    title: data.title.trim(),
    description: data.description?.trim() || null,
    priority: data.priority ?? "medium",
    status: "suggested",
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    const { data: created, error } = await createServiceClient().from("enhancements").insert(item).select().single();
    if (error) throw new Error(error.message);
    return created as Enhancement;
  }
  const store = await ensureStore();
  store.enhancements.push(item);
  await saveStore(store);
  return item;
}

export async function updateEnhancement(id: string, projectId: string, updates: Partial<Enhancement>) {
  if (isSupabaseConfigured()) {
    const { data, error } = await createServiceClient()
      .from("enhancements")
      .update(updates)
      .eq("id", id)
      .eq("project_id", projectId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Enhancement;
  }
  const store = await ensureStore();
  const idx = store.enhancements.findIndex((item) => item.id === id && item.project_id === projectId);
  if (idx === -1) throw new Error("Enhancement not found");
  store.enhancements[idx] = { ...store.enhancements[idx], ...updates };
  await saveStore(store);
  return store.enhancements[idx];
}

export async function deleteEnhancement(id: string, projectId: string) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("enhancements").delete().eq("id", id).eq("project_id", projectId);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensureStore();
  store.enhancements = store.enhancements.filter((item) => !(item.id === id && item.project_id === projectId));
  await saveStore(store);
}

export async function createPhase(projectId: string, data: { name: string; description?: string | null }) {
  const phase: ProjectPhase = {
    id: uuidv4(),
    project_id: projectId,
    name: data.name.trim(),
    description: data.description?.trim() || null,
    order: 99,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    const { data: created, error } = await createServiceClient().from("project_phases").insert(phase).select().single();
    if (error) throw new Error(error.message);
    return created as ProjectPhase;
  }
  const store = await ensureStore();
  store.phases.push(phase);
  await saveStore(store);
  return phase;
}

export async function updatePhase(id: string, projectId: string, updates: Partial<ProjectPhase>) {
  if (isSupabaseConfigured()) {
    const { data, error } = await createServiceClient()
      .from("project_phases")
      .update(updates)
      .eq("id", id)
      .eq("project_id", projectId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as ProjectPhase;
  }
  const store = await ensureStore();
  const idx = store.phases.findIndex((item) => item.id === id && item.project_id === projectId);
  if (idx === -1) throw new Error("Phase not found");
  store.phases[idx] = { ...store.phases[idx], ...updates };
  await saveStore(store);
  return store.phases[idx];
}

export async function deletePhase(id: string, projectId: string) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("project_phases").delete().eq("id", id).eq("project_id", projectId);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensureStore();
  store.phases = store.phases.filter((item) => !(item.id === id && item.project_id === projectId));
  await saveStore(store);
}

export async function updateTask(taskId: string, projectId: string, updates: Partial<Task>) {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: now })
      .eq("id", taskId)
      .eq("project_id", projectId)
      .select()
      .single();
    if (error) throw error;
    return data as Task;
  }

  const store = await ensureStore();
  const idx = store.tasks.findIndex((t) => t.id === taskId && t.project_id === projectId);
  if (idx === -1) throw new Error("Task not found");
  store.tasks[idx] = { ...store.tasks[idx], ...updates, updated_at: now };
  await saveStore(store);
  return store.tasks[idx];
}

export async function addPromptRun(promptRun: PromptRun) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("prompt_runs").insert(promptRun);
    return promptRun;
  }
  const store = await ensureStore();
  store.promptRuns.unshift(promptRun);
  await saveStore(store);
  return promptRun;
}

export async function addTestRun(testRun: TestRun) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { error } = await supabase.from("test_runs").insert(testRun);
    if (error && (testRun.http_status != null || testRun.duration_ms != null)) {
      const { http_status: _http, duration_ms: _duration, ...legacy } = testRun;
      await supabase.from("test_runs").insert(legacy);
    }
    return testRun;
  }
  const store = await ensureStore();
  store.testRuns.unshift(testRun);
  await saveStore(store);
  return testRun;
}

async function loadAiSuggestions(projectId: string): Promise<AiSuggestion[]> {
  if (!isSupabaseConfigured()) {
    const store = await ensureStore();
    return store.aiSuggestions.filter((item) => item.project_id === projectId);
  }

  const supabase = createServiceClient();
  const table = await supabase
    .from("ai_suggestions")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (!table.error) return (table.data ?? []) as AiSuggestion[];

  const { data } = await supabase
    .from("context_versions")
    .select("*")
    .eq("project_id", projectId)
    .eq("summary_text", SITE_AUDIT_MARKER)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return asSuggestionBundle(data?.analysis_json);
}

export async function saveAiSuggestions(projectId: string, suggestions: AiSuggestion[]) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const tableRead = await supabase.from("ai_suggestions").select("id").eq("project_id", projectId).limit(1);
    if (!tableRead.error) {
      const incomingIds = new Set(suggestions.map((item) => item.id));
      const { data: existing } = await supabase.from("ai_suggestions").select("id").eq("project_id", projectId);
      const stale = (existing ?? []).map((row) => row.id).filter((id) => !incomingIds.has(id));
      if (stale.length) await supabase.from("ai_suggestions").delete().in("id", stale);
      if (suggestions.length) {
        const { error } = await supabase.from("ai_suggestions").upsert(suggestions);
        if (error) throw new Error(error.message);
      }
      return suggestions;
    }

    const bundle = {
      id: uuidv4(),
      project_id: projectId,
      summary_text: SITE_AUDIT_MARKER,
      analysis_json: { kind: "site_audit", suggestions },
      created_at: new Date().toISOString(),
    };
    await supabase.from("context_versions").delete().eq("project_id", projectId).eq("summary_text", SITE_AUDIT_MARKER);
    await supabase.from("context_versions").insert(bundle);
    return suggestions;
  }

  const store = await ensureStore();
  store.aiSuggestions = [
    ...store.aiSuggestions.filter((item) => item.project_id !== projectId),
    ...suggestions,
  ];
  await saveStore(store);
  return suggestions;
}

export async function applyApprovedSuggestions(
  projectId: string,
  drafts: AiSuggestion[],
  options?: { alwaysCreateUat?: boolean },
) {
  const existing = await loadAiSuggestions(projectId);
  const selected = drafts.filter((item) => item.approved && item.status === "pending");
  const now = new Date().toISOString();
  const created = { tasks: 0, bugs: 0, uat: 0 };
  const taskTitles = new Set<string>();
  const bugTitles = new Set<string>();
  const uatTitles = new Set<string>();

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const [{ data: tasks }, { data: bugs }, { data: uat }] = await Promise.all([
      supabase.from("tasks").select("title").eq("project_id", projectId),
      supabase.from("bugs").select("title").eq("project_id", projectId),
      supabase.from("uat_items").select("title").eq("project_id", projectId),
    ]);
    for (const row of tasks ?? []) if (row.title) taskTitles.add(row.title.toLowerCase());
    for (const row of bugs ?? []) if (row.title) bugTitles.add(row.title.toLowerCase());
    for (const row of uat ?? []) if (row.title) uatTitles.add(row.title.toLowerCase());
  } else {
    const store = await ensureStore();
    for (const row of store.tasks.filter((item) => item.project_id === projectId)) taskTitles.add(row.title.toLowerCase());
    for (const row of store.bugs.filter((item) => item.project_id === projectId)) bugTitles.add(row.title.toLowerCase());
    for (const row of store.uatItems.filter((item) => item.project_id === projectId)) uatTitles.add(row.title.toLowerCase());
  }

  for (const item of selected) {
    const priority = item.severity === "critical" || item.severity === "high" ? "high" : item.severity === "low" ? "low" : "medium";
    const key = item.title.toLowerCase();
    if (!taskTitles.has(key)) {
      await createTask(projectId, {
        title: item.title,
        description: item.description,
        priority,
        source: "ai",
      });
      created.tasks += 1;
      taskTitles.add(key);
    }

    if (item.category === "bug" && !bugTitles.has(key)) {
      await createBug(projectId, {
        title: item.title,
        description: item.description,
        severity: item.severity,
      });
      created.bugs += 1;
      bugTitles.add(key);
    }

    const uatTitle = `驗收：${item.title}`;
    const shouldCreateUat =
      options?.alwaysCreateUat || item.severity === "high" || item.severity === "critical";
    if (shouldCreateUat && !uatTitles.has(uatTitle.toLowerCase())) {
      await createUATItem(projectId, {
        title: uatTitle,
        test_path: inferTargetFile(`${item.title}\n${item.description}`),
        expected_result: item.description,
        severity: item.severity,
        priority,
      });
      created.uat += 1;
      uatTitles.add(uatTitle.toLowerCase());
    }
  }

  const selectedIds = new Set(selected.map((item) => item.id));
  const draftMap = new Map(drafts.map((item) => [item.id, item]));
  const next = existing.map((item) => {
    const edited = draftMap.get(item.id);
    const merged = edited ? { ...item, ...edited, updated_at: now } : item;
    if (selectedIds.has(item.id)) {
      return { ...merged, approved: true, status: "applied" as const, updated_at: now };
    }
    if (edited && !edited.approved) {
      return { ...merged, approved: false, status: "dismissed" as const, updated_at: now };
    }
    return merged;
  });

  const extras = drafts.filter((item) => !existing.some((current) => current.id === item.id));
  await saveAiSuggestions(projectId, [...next, ...extras]);
  return { created, suggestions: await loadAiSuggestions(projectId) };
}

export async function queueEnhancementsForSprint(projectId: string, enhancementIds: string[]) {
  const created = { tasks: 0, uat: 0 };
  if (!enhancementIds.length) return created;

  const project = isSupabaseConfigured()
    ? null
    : await ensureStore();
  const enhancements = isSupabaseConfigured()
    ? ((
        await createServiceClient()
          .from("enhancements")
          .select("*")
          .eq("project_id", projectId)
          .in("id", enhancementIds)
      ).data as Enhancement[] | null) ?? []
    : (project?.enhancements ?? []).filter(
        (item) => item.project_id === projectId && enhancementIds.includes(item.id),
      );

  const taskTitles = new Set<string>();
  const uatTitles = new Set<string>();
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const [{ data: tasks }, { data: uat }] = await Promise.all([
      supabase.from("tasks").select("title").eq("project_id", projectId),
      supabase.from("uat_items").select("title").eq("project_id", projectId),
    ]);
    for (const row of tasks ?? []) if (row.title) taskTitles.add(row.title.toLowerCase());
    for (const row of uat ?? []) if (row.title) uatTitles.add(row.title.toLowerCase());
  } else {
    const store = await ensureStore();
    for (const row of store.tasks.filter((item) => item.project_id === projectId)) taskTitles.add(row.title.toLowerCase());
    for (const row of store.uatItems.filter((item) => item.project_id === projectId)) uatTitles.add(row.title.toLowerCase());
  }

  for (const item of enhancements) {
    const key = item.title.toLowerCase();
    if (!taskTitles.has(key)) {
      await createTask(projectId, {
        title: item.title,
        description: item.description,
        priority: item.priority,
        source: "ai",
      });
      created.tasks += 1;
      taskTitles.add(key);
    }

    const uatTitle = `驗收：${item.title}`;
    if (!uatTitles.has(uatTitle.toLowerCase())) {
      await createUATItem(projectId, {
        title: uatTitle,
        test_path: inferTargetFile(`${item.title}\n${item.description ?? ""}`),
        expected_result: item.description,
        priority: item.priority,
      });
      created.uat += 1;
      uatTitles.add(uatTitle.toLowerCase());
    }

    if (item.status === "suggested") {
      await updateEnhancement(item.id, projectId, { status: "planned" });
    }
  }

  return created;
}

const OPEN_UAT = new Set(["not_started", "in_progress", "failed", "blocked", "needs_review", "reopened"]);

export async function getMemberHubSnapshot(userId: string) {
  const projects = await getProjects(userId);
  const projectIds = projects.map((project) => project.id);
  const projectName = new Map(projects.map((project) => [project.id, project.name]));

  if (projectIds.length === 0) {
    return { projects, openUat: [], recentPrompts: [] };
  }

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const [{ data: uatItems }, { data: promptRuns }] = await Promise.all([
      supabase.from("uat_items").select("*").in("project_id", projectIds),
      supabase.from("prompt_runs").select("*").in("project_id", projectIds).order("created_at", { ascending: false }).limit(6),
    ]);
    return {
      projects,
      openUat: ((uatItems ?? []) as UATItem[])
        .filter((item) => OPEN_UAT.has(item.status))
        .slice(0, 6)
        .map((item) => ({ ...item, project_name: projectName.get(item.project_id) ?? "" })),
      recentPrompts: ((promptRuns ?? []) as PromptRun[]).map((run) => ({
        ...normalizePromptRun(run),
        project_name: projectName.get(run.project_id) ?? "",
      })),
    };
  }

  const store = await ensureStore();
  return {
    projects,
    openUat: store.uatItems
      .filter((item) => projectIds.includes(item.project_id) && OPEN_UAT.has(item.status))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 6)
      .map((item) => ({ ...item, project_name: projectName.get(item.project_id) ?? "" })),
    recentPrompts: store.promptRuns
      .filter((run) => projectIds.includes(run.project_id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6)
      .map((run) => ({ ...run, project_name: projectName.get(run.project_id) ?? "" })),
  };
}

export async function getRecentActivity(userId: string, limit = 10) {
  const projects = await getProjects(userId);
  const projectIds = new Set(projects.map((p) => p.id));

  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .in("project_id", Array.from(projectIds))
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  }

  const store = await ensureStore();
  return store.activityLogs
    .filter((a) => projectIds.has(a.project_id))
    .slice(0, limit);
}

export async function clearProjectAIResults(projectId: string) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await Promise.all([
      supabase.from("project_phases").delete().eq("project_id", projectId),
      supabase.from("tasks").delete().eq("project_id", projectId),
      supabase.from("uat_items").delete().eq("project_id", projectId),
      supabase.from("bugs").delete().eq("project_id", projectId),
      supabase.from("enhancements").delete().eq("project_id", projectId),
    ]);
    return;
  }

  const store = await ensureStore();
  store.phases = store.phases.filter((p) => p.project_id !== projectId);
  store.tasks = store.tasks.filter((t) => t.project_id !== projectId);
  store.uatItems = store.uatItems.filter((u) => u.project_id !== projectId);
  store.bugs = store.bugs.filter((b) => b.project_id !== projectId);
  store.enhancements = store.enhancements.filter((e) => e.project_id !== projectId);
  await saveStore(store);
}

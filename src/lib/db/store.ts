import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  ActivityLog,
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
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase/server";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

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
});

async function ensureStore(): Promise<LocalStore> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    const store = emptyStore();
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2));
    return store;
  }
}

async function saveStore(store: LocalStore) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2));
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

export async function getProjects(userId: string): Promise<Project[]> {
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
}

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

    return {
      ...(project as Project),
      phases: phases.data ?? [],
      tasks: tasks.data ?? [],
      uat_items: uatItems.data ?? [],
      bugs: bugs.data ?? [],
      enhancements: enhancements.data ?? [],
      artifacts: artifacts.data ?? [],
      prompt_runs: promptRuns.data ?? [],
      context_versions: contextVersions.data ?? [],
      test_runs: testRuns.data ?? [],
      activity_logs: activityLogs.data ?? [],
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
    prompt_runs: store.promptRuns.filter((p) => p.project_id === projectId),
    context_versions: store.contextVersions.filter((c) => c.project_id === projectId),
    test_runs: store.testRuns.filter((t) => t.project_id === projectId),
    activity_logs: store.activityLogs.filter((a) => a.project_id === projectId).slice(0, 50),
  };
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
    if (error) throw error;
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
    await supabase.from("test_runs").insert(testRun);
    return testRun;
  }
  const store = await ensureStore();
  store.testRuns.unshift(testRun);
  await saveStore(store);
  return testRun;
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

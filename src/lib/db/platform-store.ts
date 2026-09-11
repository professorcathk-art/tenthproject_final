import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createHash, randomBytes } from "crypto";
import type {
  CaseStudy,
  Certificate,
  Course,
  EnterpriseEnquiry,
  Lesson,
  LessonProgress,
  McpApiKey,
} from "@/types/platform";
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase/server";

const DATA_DIR = path.join(process.cwd(), ".data");
const PLATFORM_FILE = path.join(DATA_DIR, "platform.json");

interface PlatformStore {
  courses: Course[];
  lessons: Lesson[];
  lessonProgress: LessonProgress[];
  certificates: Certificate[];
  caseStudies: CaseStudy[];
  enterpriseEnquiries: EnterpriseEnquiry[];
  mcpApiKeys: McpApiKey[];
}

async function ensurePlatformStore(): Promise<PlatformStore> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(PLATFORM_FILE, "utf-8");
    return JSON.parse(raw) as PlatformStore;
  } catch {
    const store: PlatformStore = {
      courses: [],
      lessons: [],
      lessonProgress: [],
      certificates: [],
      caseStudies: [],
      enterpriseEnquiries: [],
      mcpApiKeys: [],
    };
    await fs.writeFile(PLATFORM_FILE, JSON.stringify(store, null, 2));
    return store;
  }
}

async function savePlatformStore(store: PlatformStore) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PLATFORM_FILE, JSON.stringify(store, null, 2));
}

// ─── Courses ───────────────────────────────────────────────

export async function getCourses(publishedOnly = true): Promise<Course[]> {
  if (isSupabaseConfigured()) {
    let q = createServiceClient().from("courses").select("*").order("created_at");
    if (publishedOnly) q = q.eq("published", true);
    const { data } = await q;
    return (data ?? []) as Course[];
  }
  const store = await ensurePlatformStore();
  return store.courses.filter((c) => !publishedOnly || c.published);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data: course } = await supabase.from("courses").select("*").eq("slug", slug).single();
    if (!course) return null;
    const { data: lessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", course.id)
      .order("order_index");
    return { ...(course as Course), lessons: (lessons ?? []) as Lesson[] };
  }
  const store = await ensurePlatformStore();
  const course = store.courses.find((c) => c.slug === slug);
  if (!course) return null;
  return {
    ...course,
    lessons: store.lessons.filter((l) => l.course_id === course.id).sort((a, b) => a.order_index - b.order_index),
  };
}

export async function getLesson(courseSlug: string, lessonId: string): Promise<{ course: Course; lesson: Lesson } | null> {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return null;
  const lesson = course.lessons?.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { course, lesson };
}

export async function upsertCourse(course: Course, lessons: Lesson[]) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("courses").upsert(course);
    if (lessons.length) await supabase.from("lessons").upsert(lessons);
    return;
  }
  const store = await ensurePlatformStore();
  const idx = store.courses.findIndex((c) => c.id === course.id);
  if (idx >= 0) store.courses[idx] = course;
  else store.courses.push(course);
  store.lessons = store.lessons.filter((l) => l.course_id !== course.id);
  store.lessons.push(...lessons);
  await savePlatformStore(store);
}

// ─── Progress & Certificates ─────────────────────────────

export async function getLessonProgress(userId: string, courseId: string): Promise<LessonProgress[]> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient()
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .in("lesson_id", (await createServiceClient().from("lessons").select("id").eq("course_id", courseId)).data?.map((l: { id: string }) => l.id) ?? []);
    return (data ?? []) as LessonProgress[];
  }
  const store = await ensurePlatformStore();
  const lessonIds = new Set(store.lessons.filter((l) => l.course_id === courseId).map((l) => l.id));
  return store.lessonProgress.filter((p) => p.user_id === userId && lessonIds.has(p.lesson_id));
}

export async function markLessonComplete(userId: string, lessonId: string, quizScore?: number) {
  const now = new Date().toISOString();
  const entry: LessonProgress = {
    id: uuidv4(),
    user_id: userId,
    lesson_id: lessonId,
    completed: true,
    quiz_score: quizScore ?? null,
    completed_at: now,
    created_at: now,
  };

  if (isSupabaseConfigured()) {
    await createServiceClient().from("lesson_progress").upsert(entry, { onConflict: "user_id,lesson_id" });
    return entry;
  }
  const store = await ensurePlatformStore();
  const idx = store.lessonProgress.findIndex((p) => p.user_id === userId && p.lesson_id === lessonId);
  if (idx >= 0) store.lessonProgress[idx] = { ...store.lessonProgress[idx], ...entry };
  else store.lessonProgress.push(entry);
  await savePlatformStore(store);
  return entry;
}

export async function issueCertificate(userId: string, courseId: string, courseTitle: string): Promise<Certificate> {
  const code = `TP-${courseTitle.slice(0, 3).toUpperCase()}-${randomBytes(4).toString("hex").toUpperCase()}`;
  const cert: Certificate = {
    id: uuidv4(),
    user_id: userId,
    course_id: courseId,
    issued_at: new Date().toISOString(),
    certificate_code: code,
  };

  if (isSupabaseConfigured()) {
    await createServiceClient().from("certificates").insert(cert);
    return cert;
  }
  const store = await ensurePlatformStore();
  store.certificates.push(cert);
  await savePlatformStore(store);
  return cert;
}

export async function getCertificateByCode(code: string): Promise<Certificate | null> {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data } = await supabase.from("certificates").select("*").eq("certificate_code", code).single();
    if (!data) return null;
    const { data: course } = await supabase.from("courses").select("*").eq("id", data.course_id).single();
    return { ...(data as Certificate), course: course as Course };
  }
  const store = await ensurePlatformStore();
  const cert = store.certificates.find((c) => c.certificate_code === code);
  if (!cert) return null;
  const course = store.courses.find((c) => c.id === cert.course_id);
  return { ...cert, course };
}

export async function getUserCertificate(userId: string, courseId: string): Promise<Certificate | null> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient()
      .from("certificates")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();
    return data as Certificate | null;
  }
  const store = await ensurePlatformStore();
  return store.certificates.find((c) => c.user_id === userId && c.course_id === courseId) ?? null;
}

// ─── Case Studies ──────────────────────────────────────────

export async function getCaseStudies(category?: string, publishedOnly = true): Promise<CaseStudy[]> {
  if (isSupabaseConfigured()) {
    let q = createServiceClient().from("case_studies").select("*").order("created_at", { ascending: false });
    if (publishedOnly) q = q.eq("is_published", true);
    if (category && category !== "all") q = q.eq("category", category);
    const { data } = await q;
    return ((data ?? []) as CaseStudy[]).map(normalizeCaseStudy);
  }
  const store = await ensurePlatformStore();
  return store.caseStudies
    .filter((c) => (!publishedOnly || c.is_published) && (!category || category === "all" || c.category === category));
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient().from("case_studies").select("*").eq("slug", slug).single();
    return data ? normalizeCaseStudy(data as CaseStudy) : null;
  }
  const store = await ensurePlatformStore();
  const cs = store.caseStudies.find((c) => c.slug === slug);
  return cs ?? null;
}

function normalizeCaseStudy(cs: CaseStudy): CaseStudy {
  return { ...cs, tech_stack: Array.isArray(cs.tech_stack) ? cs.tech_stack : JSON.parse(String(cs.tech_stack || "[]")) };
}

export async function upsertCaseStudy(cs: CaseStudy) {
  if (isSupabaseConfigured()) {
    await createServiceClient().from("case_studies").upsert(cs);
    return;
  }
  const store = await ensurePlatformStore();
  const idx = store.caseStudies.findIndex((c) => c.id === cs.id);
  if (idx >= 0) store.caseStudies[idx] = cs;
  else store.caseStudies.push(cs);
  await savePlatformStore(store);
}

export async function deleteCaseStudy(id: string) {
  if (isSupabaseConfigured()) {
    await createServiceClient().from("case_studies").delete().eq("id", id);
    return;
  }
  const store = await ensurePlatformStore();
  store.caseStudies = store.caseStudies.filter((c) => c.id !== id);
  await savePlatformStore(store);
}

// ─── Enterprise ────────────────────────────────────────────

export async function createEnterpriseEnquiry(data: Omit<EnterpriseEnquiry, "id" | "status" | "created_at">) {
  const enquiry: EnterpriseEnquiry = {
    id: uuidv4(),
    status: "pending",
    created_at: new Date().toISOString(),
    ...data,
  };

  if (isSupabaseConfigured()) {
    await createServiceClient().from("enterprise_enquiries").insert(enquiry);
    return enquiry;
  }
  const store = await ensurePlatformStore();
  store.enterpriseEnquiries.unshift(enquiry);
  await savePlatformStore(store);
  return enquiry;
}

export async function getEnterpriseEnquiries(): Promise<EnterpriseEnquiry[]> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient().from("enterprise_enquiries").select("*").order("created_at", { ascending: false });
    return (data ?? []) as EnterpriseEnquiry[];
  }
  const store = await ensurePlatformStore();
  return store.enterpriseEnquiries;
}

export async function updateEnquiryStatus(id: string, status: EnterpriseEnquiry["status"]) {
  if (isSupabaseConfigured()) {
    await createServiceClient().from("enterprise_enquiries").update({ status }).eq("id", id);
    return;
  }
  const store = await ensurePlatformStore();
  const idx = store.enterpriseEnquiries.findIndex((e) => e.id === id);
  if (idx >= 0) store.enterpriseEnquiries[idx].status = status;
  await savePlatformStore(store);
}

// ─── MCP API Keys ──────────────────────────────────────────

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function createMcpApiKey(userId: string, projectId: string, label = "Cursor MCP"): Promise<{ key: string; record: McpApiKey }> {
  const rawKey = `tp_${randomBytes(24).toString("hex")}`;
  const record: McpApiKey = {
    id: uuidv4(),
    user_id: userId,
    project_id: projectId,
    key_prefix: rawKey.slice(0, 10),
    key_hash: hashApiKey(rawKey),
    label,
    last_used_at: null,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    await createServiceClient().from("mcp_api_keys").insert(record);
    return { key: rawKey, record };
  }
  const store = await ensurePlatformStore();
  store.mcpApiKeys.push(record);
  await savePlatformStore(store);
  return { key: rawKey, record };
}

export async function validateMcpApiKey(key: string): Promise<McpApiKey | null> {
  const hash = hashApiKey(key);
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data } = await supabase.from("mcp_api_keys").select("*").eq("key_hash", hash).single();
    if (data) {
      await supabase.from("mcp_api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id);
    }
    return data as McpApiKey | null;
  }
  const store = await ensurePlatformStore();
  const record = store.mcpApiKeys.find((k) => k.key_hash === hash);
  if (record) record.last_used_at = new Date().toISOString();
  await savePlatformStore(store);
  return record ?? null;
}

export async function getMcpKeysForProject(userId: string, projectId: string): Promise<McpApiKey[]> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient()
      .from("mcp_api_keys")
      .select("id, user_id, project_id, key_prefix, label, last_used_at, created_at")
      .eq("user_id", userId)
      .eq("project_id", projectId);
    return (data ?? []) as McpApiKey[];
  }
  const store = await ensurePlatformStore();
  return store.mcpApiKeys.filter((k) => k.user_id === userId && k.project_id === projectId);
}

export async function revokeMcpApiKey(id: string, userId: string) {
  if (isSupabaseConfigured()) {
    await createServiceClient().from("mcp_api_keys").delete().eq("id", id).eq("user_id", userId);
    return;
  }
  const store = await ensurePlatformStore();
  store.mcpApiKeys = store.mcpApiKeys.filter((k) => !(k.id === id && k.user_id === userId));
  await savePlatformStore(store);
}

// ─── Bulk seed helper ──────────────────────────────────────

export async function seedPlatformData(courses: Course[], lessons: Lesson[], caseStudies: CaseStudy[]) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    if (courses.length) await supabase.from("courses").upsert(courses, { onConflict: "slug" });
    if (lessons.length) await supabase.from("lessons").upsert(lessons);
    if (caseStudies.length) await supabase.from("case_studies").upsert(caseStudies, { onConflict: "slug" });
    return;
  }
  const store = await ensurePlatformStore();
  for (const c of courses) {
    const idx = store.courses.findIndex((x) => x.slug === c.slug);
    if (idx >= 0) store.courses[idx] = c;
    else store.courses.push(c);
  }
  for (const l of lessons) {
    if (!store.lessons.find((x) => x.id === l.id)) store.lessons.push(l);
  }
  for (const cs of caseStudies) {
    const idx = store.caseStudies.findIndex((x) => x.slug === cs.slug);
    if (idx >= 0) store.caseStudies[idx] = cs;
    else store.caseStudies.push(cs);
  }
  await savePlatformStore(store);
}

export async function getPlatformCounts() {
  const [courses, caseStudies, enquiries] = await Promise.all([
    getCourses(false),
    getCaseStudies(undefined, false),
    getEnterpriseEnquiries(),
  ]);
  return { courses: courses.length, caseStudies: caseStudies.length, enquiries: enquiries.length };
}

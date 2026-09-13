import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createHash, randomBytes } from "crypto";
import type {
  CaseHighlight,
  CaseStudy,
  Certificate,
  Course,
  EnterpriseEnquiry,
  WebinarSignup,
  CaseStudyMark,
  CaseMarkStatus,
  Lesson,
  LessonLink,
  LessonMaterial,
  LessonProgress,
  McpApiKey,
  Member,
  VideoType,
} from "@/types/platform";
import { applyCaseFieldEncoding, extractCaseFields } from "@/lib/inspiration/case-fields";
import { inferVideoType } from "@/lib/classroom/media";
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase/server";

const DATA_DIR = path.join(process.cwd(), ".data");
const PLATFORM_FILE = path.join(DATA_DIR, "platform.json");
const CAN_PERSIST_LOCAL = !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;

interface PlatformStore {
  courses: Course[];
  lessons: Lesson[];
  lessonProgress: LessonProgress[];
  certificates: Certificate[];
  caseStudies: CaseStudy[];
  enterpriseEnquiries: EnterpriseEnquiry[];
  webinarSignups: WebinarSignup[];
  mcpApiKeys: McpApiKey[];
  members: Member[];
  caseMarks: CaseStudyMark[];
}

function emptyPlatformStore(): PlatformStore {
  return {
    courses: [],
    lessons: [],
    lessonProgress: [],
    certificates: [],
    caseStudies: [],
    enterpriseEnquiries: [],
    webinarSignups: [],
    mcpApiKeys: [],
    members: [],
    caseMarks: [],
  };
}

let memoryStore: PlatformStore | null = null;

async function persistPlatformFile(store: PlatformStore) {
  if (!CAN_PERSIST_LOCAL) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(PLATFORM_FILE, JSON.stringify(store, null, 2));
  } catch (error) {
    console.warn("Local platform store is memory-only:", error);
  }
}

async function ensurePlatformStore(): Promise<PlatformStore> {
  if (memoryStore) return memoryStore;
  if (CAN_PERSIST_LOCAL) {
    try {
      const raw = await fs.readFile(PLATFORM_FILE, "utf-8");
      const parsed = JSON.parse(raw) as PlatformStore;
      memoryStore = {
        ...parsed,
        members: parsed.members ?? [],
        webinarSignups: parsed.webinarSignups ?? [],
        caseMarks: parsed.caseMarks ?? [],
      };
      return memoryStore;
    } catch {
      /* seed an empty local file below */
    }
  }
  memoryStore = emptyPlatformStore();
  await persistPlatformFile(memoryStore);
  return memoryStore;
}

async function savePlatformStore(store: PlatformStore) {
  memoryStore = store;
  await persistPlatformFile(store);
}

function parseLinks(raw: unknown): LessonLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      title: String((item as LessonLink)?.title || "").trim(),
      url: String((item as LessonLink)?.url || "").trim(),
    }))
    .filter((item) => item.url);
}

function persistLesson(lesson: Lesson) {
  const { materials: _materials, ...rest } = lesson;
  return {
    ...rest,
    video_type: inferVideoType(lesson.video_url, lesson.video_type),
    html_content: lesson.html_content ?? null,
    links: parseLinks(lesson.links),
    content_md: lesson.content_md ?? "",
  };
}

function normalizeLesson(lesson: Lesson, materials: LessonMaterial[] = []): Lesson {
  return {
    ...lesson,
    video_type: inferVideoType(lesson.video_url, lesson.video_type) as VideoType,
    html_content: lesson.html_content ?? null,
    links: parseLinks(lesson.links),
    materials,
  };
}

async function attachMaterials(lessons: Lesson[]): Promise<Lesson[]> {
  if (!lessons.length) return [];
  if (isSupabaseConfigured()) {
    const ids = lessons.map((lesson) => lesson.id);
    const { data } = await createServiceClient()
      .from("lesson_materials")
      .select("*")
      .in("lesson_id", ids)
      .order("created_at");
    const grouped = new Map<string, LessonMaterial[]>();
    for (const row of (data ?? []) as LessonMaterial[]) {
      const list = grouped.get(row.lesson_id) ?? [];
      list.push(row);
      grouped.set(row.lesson_id, list);
    }
    return lessons.map((lesson) => normalizeLesson(lesson, grouped.get(lesson.id) ?? []));
  }
  return lessons.map((lesson) => normalizeLesson(lesson, lesson.materials ?? []));
}

async function replaceLessonMaterials(lessonId: string, materials: LessonMaterial[]) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("lesson_materials").delete().eq("lesson_id", lessonId);
    if (materials.length) {
      await supabase.from("lesson_materials").insert(
        materials.map((item) => ({
          id: item.id,
          lesson_id: lessonId,
          title: item.title,
          file_url: item.file_url,
          file_name: item.file_name,
          created_at: item.created_at,
        })),
      );
    }
    return;
  }
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
    return { ...(course as Course), lessons: await attachMaterials((lessons ?? []) as Lesson[]) };
  }
  const store = await ensurePlatformStore();
  const course = store.courses.find((c) => c.slug === slug);
  if (!course) return null;
  return {
    ...course,
    lessons: await attachMaterials(
      store.lessons.filter((l) => l.course_id === course.id).sort((a, b) => a.order_index - b.order_index),
    ),
  };
}

export async function getLesson(courseSlug: string, lessonId: string): Promise<{ course: Course; lesson: Lesson } | null> {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return null;
  const lesson = course.lessons?.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { course, lesson };
}

export async function getCoursesWithLessons(): Promise<Course[]> {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { data: courses } = await supabase.from("courses").select("*").order("created_at");
    const { data: lessons } = await supabase.from("lessons").select("*").order("order_index");
    const lessonList = await attachMaterials((lessons ?? []) as Lesson[]);
    return ((courses ?? []) as Course[]).map((c) => ({
      ...c,
      lessons: lessonList.filter((l) => l.course_id === c.id).sort((a, b) => a.order_index - b.order_index),
    }));
  }
  const store = await ensurePlatformStore();
  const lessonList = await attachMaterials(store.lessons);
  return store.courses.map((c) => ({
    ...c,
    lessons: lessonList.filter((l) => l.course_id === c.id).sort((a, b) => a.order_index - b.order_index),
  }));
}

export async function upsertCourse(course: Course, lessons?: Lesson[]) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("courses").upsert(course);
    if (lessons?.length) await supabase.from("lessons").upsert(lessons);
    return;
  }
  const store = await ensurePlatformStore();
  const idx = store.courses.findIndex((c) => c.id === course.id);
  if (idx >= 0) store.courses[idx] = course;
  else store.courses.push(course);
  if (lessons) {
    store.lessons = store.lessons.filter((l) => l.course_id !== course.id);
    store.lessons.push(...lessons);
  }
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

export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient().from("certificates").select("*").eq("user_id", userId);
    return (data ?? []) as Certificate[];
  }
  const store = await ensurePlatformStore();
  return store.certificates.filter((cert) => cert.user_id === userId);
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

const CASE_CARD_COLUMNS = "id, title, slug, category, summary, tech_stack, is_published, created_at";
const CASE_STUDIES_TAG = "case-studies";

export type CaseStudyCard = Pick<
  CaseStudy,
  "id" | "title" | "slug" | "category" | "categories" | "summary" | "website_url" | "difficulty"
>;

function invalidateCaseCaches() {
  try {
    revalidateTag(CASE_STUDIES_TAG, "max");
  } catch {
    /* script / seed context has no request cache */
  }
}

function cardsFromRows(rows: CaseStudy[]): CaseStudyCard[] {
  return rows.map((study) => ({
    id: study.id,
    title: study.title,
    slug: study.slug,
    category: study.category,
    categories: study.categories,
    summary: study.summary,
    website_url: study.website_url,
    difficulty: study.difficulty,
  }));
}

async function fetchCaseStudyCards(publishedOnly: boolean): Promise<CaseStudyCard[]> {
  let rows: CaseStudy[] = [];
  if (isSupabaseConfigured()) {
    let q = createServiceClient()
      .from("case_studies")
      .select(CASE_CARD_COLUMNS)
      .order("created_at", { ascending: false });
    if (publishedOnly) q = q.eq("is_published", true);
    const { data } = await q;
    rows = ((data ?? []) as CaseStudy[]).map(normalizeCaseStudy);
  } else {
    const store = await ensurePlatformStore();
    rows = store.caseStudies.filter((c) => !publishedOnly || c.is_published).map(normalizeCaseStudy);
  }
  return cardsFromRows(rows);
}

const cachedCaseStudyCards = unstable_cache(
  async (publishedOnly: boolean) => fetchCaseStudyCards(publishedOnly),
  ["case-study-cards"],
  { revalidate: 300, tags: [CASE_STUDIES_TAG] },
);

export const getCaseStudyCards = cache(async (publishedOnly = true): Promise<CaseStudyCard[]> => {
  if (process.env.NODE_ENV !== "production") return fetchCaseStudyCards(publishedOnly);
  return cachedCaseStudyCards(publishedOnly);
});

export async function listPublishedCaseSlugs(): Promise<string[]> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient()
      .from("case_studies")
      .select("slug")
      .eq("is_published", true);
    return ((data ?? []) as { slug: string }[]).map((row) => row.slug);
  }
  const store = await ensurePlatformStore();
  return store.caseStudies.filter((c) => c.is_published).map((c) => c.slug);
}

export async function countPublishedCaseStudies(): Promise<number> {
  if (isSupabaseConfigured()) {
    const { count } = await createServiceClient()
      .from("case_studies")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true);
    return count ?? 0;
  }
  const store = await ensurePlatformStore();
  return store.caseStudies.filter((c) => c.is_published).length;
}

export async function getCaseStudies(category?: string, publishedOnly = true): Promise<CaseStudy[]> {
  let rows: CaseStudy[] = [];
  if (isSupabaseConfigured()) {
    let q = createServiceClient().from("case_studies").select("*").order("created_at", { ascending: false });
    if (publishedOnly) q = q.eq("is_published", true);
    const { data } = await q;
    rows = ((data ?? []) as CaseStudy[]).map(normalizeCaseStudy);
  } else {
    const store = await ensurePlatformStore();
    rows = store.caseStudies.filter((c) => !publishedOnly || c.is_published).map(normalizeCaseStudy);
  }
  if (category && category !== "all") {
    rows = rows.filter((c) => (c.categories?.length ? c.categories : [c.category]).includes(category as CaseStudy["category"]));
  }
  return rows;
}

async function fetchCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient().from("case_studies").select("*").eq("slug", slug).maybeSingle();
    return data ? normalizeCaseStudy(data as CaseStudy) : null;
  }
  const store = await ensurePlatformStore();
  const cs = store.caseStudies.find((c) => c.slug === slug);
  return cs ? normalizeCaseStudy(cs) : null;
}

const cachedCaseStudyBySlug = unstable_cache(
  async (slug: string) => fetchCaseStudyBySlug(slug),
  ["case-study-by-slug"],
  { revalidate: 300, tags: [CASE_STUDIES_TAG] },
);

export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudy | null> => {
  if (process.env.NODE_ENV !== "production") return fetchCaseStudyBySlug(slug);
  return cachedCaseStudyBySlug(slug);
});

function parseStack(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  try {
    return JSON.parse(String(raw || "[]")) as string[];
  } catch {
    return [];
  }
}

function persistCaseStudy(cs: CaseStudy): CaseStudy {
  return applyCaseFieldEncoding(cs);
}

function parseHighlight(raw: string): CaseHighlight | null {
  const parts = raw.slice(3).split("|");
  if (parts.length < 3) return null;
  const [zh, en, ...value] = parts;
  return { zh, en, value: value.join("|") };
}

function normalizeCaseStudy(cs: CaseStudy): CaseStudy {
  const stack = parseStack(cs.tech_stack);
  const tagged = stack.filter((t) => t.startsWith("cat:")).map((t) => t.slice(4)) as CaseStudy["category"][];
  const categories = tagged.length ? tagged : cs.categories?.length ? cs.categories : [cs.category];
  const site = stack.find((t) => t.startsWith("site:"))?.slice(5) ?? cs.website_url ?? null;
  const highlights = [
    ...stack.filter((t) => t.startsWith("hl:")).map(parseHighlight).filter((h): h is CaseHighlight => Boolean(h)),
    ...(cs.highlights ?? []),
  ];
  const uniqueHighlights = highlights.filter(
    (h, i, all) => all.findIndex((x) => x.zh === h.zh && x.value === h.value) === i,
  );
  const extras = extractCaseFields({ ...cs, tech_stack: stack, breakdown_md: cs.breakdown_md });
  return {
    ...cs,
    category: categories[0],
    categories,
    website_url: site,
    highlights: uniqueHighlights,
    difficulty: extras.difficulty,
    pitch_deck_url: extras.pitch_deck_url,
    clone_prompt: extras.clone_prompt,
    breakdown_md: extras.breakdown_md,
    tech_stack: stack.filter(
      (t) => !t.startsWith("cat:") && !t.startsWith("site:") && !t.startsWith("hl:") && !t.startsWith("diff:") && !t.startsWith("deck:"),
    ),
  };
}

export async function upsertCaseStudy(cs: CaseStudy) {
  invalidateCaseCaches();
  const row = persistCaseStudy(cs);
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("case_studies").upsert(row);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensurePlatformStore();
  const idx = store.caseStudies.findIndex((c) => c.id === cs.id);
  if (idx >= 0) store.caseStudies[idx] = cs;
  else store.caseStudies.push(cs);
  await savePlatformStore(store);
}

export async function deleteCaseStudy(id: string) {
  invalidateCaseCaches();
  if (isSupabaseConfigured()) {
    await createServiceClient().from("case_studies").delete().eq("id", id);
    return;
  }
  const store = await ensurePlatformStore();
  store.caseStudies = store.caseStudies.filter((c) => c.id !== id);
  await savePlatformStore(store);
}

export async function getCaseMarksForUser(userId: string): Promise<Record<string, CaseMarkStatus>> {
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient().from("case_study_marks").select("case_slug, status").eq("user_id", userId);
    return Object.fromEntries(((data ?? []) as { case_slug: string; status: CaseMarkStatus }[]).map((row) => [row.case_slug, row.status]));
  }
  const store = await ensurePlatformStore();
  return Object.fromEntries(
    (store.caseMarks ?? []).filter((row) => row.user_id === userId).map((row) => [row.case_slug, row.status]),
  );
}

export async function setCaseMarkForUser(userId: string, slug: string, status: CaseMarkStatus | null): Promise<Record<string, CaseMarkStatus>> {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    if (!status) {
      const { error } = await supabase.from("case_study_marks").delete().eq("user_id", userId).eq("case_slug", slug);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("case_study_marks").upsert({
        user_id: userId,
        case_slug: slug,
        status,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
    }
    return getCaseMarksForUser(userId);
  }
  const store = await ensurePlatformStore();
  store.caseMarks = store.caseMarks ?? [];
  store.caseMarks = store.caseMarks.filter((row) => !(row.user_id === userId && row.case_slug === slug));
  if (status) {
    store.caseMarks.push({
      user_id: userId,
      case_slug: slug,
      status,
      updated_at: new Date().toISOString(),
    });
  }
  await savePlatformStore(store);
  return getCaseMarksForUser(userId);
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

export async function seedPlatformData(courses: Course[], lessons: Lesson[]) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    if (courses.length) await supabase.from("courses").upsert(courses, { onConflict: "id" });
    const courseIds = courses.map((c) => c.id);
    if (courseIds.length) {
      await supabase.from("lessons").delete().in("course_id", courseIds);
    }
    if (lessons.length) await supabase.from("lessons").upsert(lessons);
    return;
  }
  const store = await ensurePlatformStore();
  for (const c of courses) {
    const idx = store.courses.findIndex((x) => x.id === c.id || x.slug === c.slug);
    if (idx >= 0) store.courses[idx] = c;
    else store.courses.push(c);
  }
  const courseIds = new Set(courses.map((c) => c.id));
  store.lessons = store.lessons.filter((l) => !courseIds.has(l.course_id));
  store.lessons.push(...lessons);
  await savePlatformStore(store);
}

export async function replaceCaseStudies(studies: CaseStudy[]) {
  invalidateCaseCaches();
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const { error: delError } = await supabase.from("case_studies").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (delError) throw new Error(delError.message);
    if (studies.length) {
      const { error } = await supabase.from("case_studies").upsert(studies.map(persistCaseStudy));
      if (error) throw new Error(error.message);
    }
    return;
  }
  const store = await ensurePlatformStore();
  store.caseStudies = studies;
  await savePlatformStore(store);
}

export async function upsertLesson(lesson: Lesson) {
  const row = persistLesson(lesson);
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("lessons").upsert(row);
    if (error) throw new Error(error.message);
    if (lesson.materials) await replaceLessonMaterials(lesson.id, lesson.materials);
    return;
  }
  const store = await ensurePlatformStore();
  const idx = store.lessons.findIndex((l) => l.id === lesson.id);
  const next = normalizeLesson(lesson, lesson.materials ?? []);
  if (idx >= 0) store.lessons[idx] = next;
  else store.lessons.push(next);
  await savePlatformStore(store);
}

export async function deleteCourse(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    await supabase.from("lessons").delete().eq("course_id", id);
    await supabase.from("courses").delete().eq("id", id);
    return;
  }
  const store = await ensurePlatformStore();
  store.courses = store.courses.filter((c) => c.id !== id);
  store.lessons = store.lessons.filter((l) => l.course_id !== id);
  await savePlatformStore(store);
}

export async function deleteLesson(id: string) {
  if (isSupabaseConfigured()) {
    await createServiceClient().from("lessons").delete().eq("id", id);
    return;
  }
  const store = await ensurePlatformStore();
  store.lessons = store.lessons.filter((l) => l.id !== id);
  await savePlatformStore(store);
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  if (isSupabaseConfigured()) {
    const { data, error } = await createServiceClient()
      .from("members")
      .select("*")
      .eq("email", normalized)
      .maybeSingle();
    if (error) {
      console.error("getMemberByEmail:", error.message);
      return null;
    }
    return (data as Member | null) ?? null;
  }
  const store = await ensurePlatformStore();
  return store.members.find((member) => member.email === normalized) ?? null;
}

export async function createWebinarSignup(data: Omit<WebinarSignup, "id" | "status" | "created_at">) {
  const signup: WebinarSignup = {
    id: uuidv4(),
    status: "pending",
    created_at: new Date().toISOString(),
    ...data,
  };

  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("webinar_signups").insert(signup);
    if (error) throw new Error(error.message);
    return signup;
  }
  const store = await ensurePlatformStore();
  store.webinarSignups.unshift(signup);
  await savePlatformStore(store);
  return signup;
}

export async function getWebinarSignups(): Promise<WebinarSignup[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await createServiceClient()
      .from("webinar_signups")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as WebinarSignup[];
  }
  const store = await ensurePlatformStore();
  return store.webinarSignups ?? [];
}

export async function updateWebinarSignupStatus(id: string, status: WebinarSignup["status"]) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("webinar_signups").update({ status }).eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensurePlatformStore();
  const idx = store.webinarSignups.findIndex((item) => item.id === id);
  if (idx >= 0) store.webinarSignups[idx].status = status;
  await savePlatformStore(store);
}

export async function deleteWebinarSignup(id: string) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("webinar_signups").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensurePlatformStore();
  store.webinarSignups = store.webinarSignups.filter((item) => item.id !== id);
  await savePlatformStore(store);
}

export async function deleteEnquiry(id: string) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("enterprise_enquiries").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensurePlatformStore();
  store.enterpriseEnquiries = store.enterpriseEnquiries.filter((item) => item.id !== id);
  await savePlatformStore(store);
}

export async function getMembers(): Promise<Member[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await createServiceClient().from("members").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("getMembers:", error.message);
      return [];
    }
    return (data ?? []) as Member[];
  }
  const store = await ensurePlatformStore();
  return store.members;
}

export async function upsertMember(member: Member) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("members").upsert(member, { onConflict: "email" });
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensurePlatformStore();
  const idx = store.members.findIndex((m) => m.id === member.id || m.email === member.email);
  if (idx >= 0) store.members[idx] = { ...store.members[idx], ...member };
  else store.members.unshift(member);
  await savePlatformStore(store);
}

export async function deleteMember(id: string) {
  if (isSupabaseConfigured()) {
    const { error } = await createServiceClient().from("members").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const store = await ensurePlatformStore();
  store.members = store.members.filter((m) => m.id !== id);
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

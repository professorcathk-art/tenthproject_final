import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/session";
import { upsertCourse, upsertLesson, deleteCourse, deleteLesson } from "@/lib/db/platform-store";
import { inferVideoType } from "@/lib/classroom/media";
import type { Course, Lesson, LessonLink, LessonMaterial, QuizQuestion } from "@/types/platform";

function toSlug(input: string) {
  const ascii = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii.length >= 2 ? ascii : `c-${Date.now().toString(36)}`;
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

function parseMaterials(raw: unknown, lessonId: string): LessonMaterial[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = item as Partial<LessonMaterial>;
      return {
        id: String(row.id || uuidv4()),
        lesson_id: lessonId,
        title: String(row.title || row.file_name || "File"),
        file_url: String(row.file_url || ""),
        file_name: row.file_name ?? null,
        created_at: row.created_at || new Date().toISOString(),
      };
    })
    .filter((item) => item.file_url);
}

function parseQuiz(raw: unknown): QuizQuestion[] {
  if (Array.isArray(raw)) return raw as QuizQuestion[];
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuizQuestion[]) : [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const course: Course = {
      id: body.id || uuidv4(),
      title: String(body.title || "").trim(),
      slug: toSlug(body.slug || body.title || "course"),
      description: body.description ?? "",
      cover_image: body.cover_image || null,
      level: body.level || "beginner",
      duration_hours: Number(body.duration_hours) || 1,
      published: body.published !== false,
      created_at: body.created_at || new Date().toISOString(),
    };
    if (!course.title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }
    await upsertCourse(course);
    return NextResponse.json({ course });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (body.kind === "lesson") {
      const id = body.id || uuidv4();
      const lesson: Lesson = {
        id,
        course_id: body.course_id,
        title: String(body.title || "").trim(),
        order_index: Number(body.order_index) || 0,
        video_url: body.video_url || null,
        video_type: inferVideoType(body.video_url, body.video_type),
        content_md: body.content_md || "",
        html_content: body.html_content ?? body.content_md ?? "",
        links: parseLinks(body.links),
        materials: parseMaterials(body.materials, id),
        quiz_data: parseQuiz(body.quiz_data),
        created_at: body.created_at || new Date().toISOString(),
      };
      if (!lesson.title || !lesson.course_id) {
        return NextResponse.json({ error: "Lesson title and course required" }, { status: 400 });
      }
      await upsertLesson(lesson);
      return NextResponse.json({ lesson });
    }
    if (body.kind === "course" && body.id) {
      const course: Course = {
        id: body.id,
        title: String(body.title || "").trim(),
        slug: toSlug(body.slug || body.title || "course"),
        description: body.description ?? "",
        cover_image: body.cover_image || null,
        level: body.level || "beginner",
        duration_hours: Number(body.duration_hours) || 1,
        published: Boolean(body.published),
        created_at: body.created_at || new Date().toISOString(),
      };
      await upsertCourse(course);
      return NextResponse.json({ course });
    }
    return NextResponse.json({ error: "Unknown patch" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (body.kind === "lesson") {
      await deleteLesson(body.id);
      return NextResponse.json({ success: true });
    }
    await deleteCourse(body.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/session";
import { upsertCourse, upsertLesson, deleteCourse, deleteLesson } from "@/lib/db/platform-store";
import type { Course, Lesson, QuizQuestion } from "@/types/platform";

function toSlug(input: string) {
  const ascii = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii.length >= 2 ? ascii : `c-${Date.now().toString(36)}`;
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
      const lesson: Lesson = {
        id: body.id || uuidv4(),
        course_id: body.course_id,
        title: String(body.title || "").trim(),
        order_index: Number(body.order_index) || 0,
        video_url: body.video_url || null,
        content_md: body.content_md || "",
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

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { markLessonComplete, issueCertificate, getUserCertificate, getCourseBySlug } from "@/lib/db/platform-store";
import { getLessonProgress } from "@/lib/db/platform-store";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const courseId = request.nextUrl.searchParams.get("courseId");
    if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });
    const progress = await getLessonProgress(user.id, courseId);
    const cert = await getUserCertificate(user.id, courseId);
    return NextResponse.json({ progress, certificate: cert });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const { lessonId, courseSlug, quizScore } = await request.json();

    await markLessonComplete(user.id, lessonId, quizScore);

    // Check if all lessons complete → issue certificate
    const course = courseSlug ? await getCourseBySlug(courseSlug) : null;
    if (course && course.lessons) {
      const progress = await getLessonProgress(user.id, course.id);
      const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));
      const allDone = course.lessons.every((l) => completedIds.has(l.id));

      if (allDone) {
        const existing = await getUserCertificate(user.id, course.id);
        if (!existing) {
          const cert = await issueCertificate(user.id, course.id, course.title);
          return NextResponse.json({ success: true, certificate: cert });
        }
        return NextResponse.json({ success: true, certificate: existing });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

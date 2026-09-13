import { notFound, redirect } from "next/navigation";
import { LessonClient } from "@/components/courses/lesson-client";
import { getLesson, getLessonProgress } from "@/lib/db/platform-store";
import { ensureCoursesSeeded } from "@/lib/seed/init";
import { getSession } from "@/lib/auth/session";
import { getMembershipAccess } from "@/lib/auth/membership";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  await ensureCoursesSeeded();
  const { slug, lessonId } = await params;
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated) redirect(`/login?redirect=/learning/${slug}/lessons/${lessonId}`);

  const result = await getLesson(slug, lessonId);
  if (!result) notFound();

  const { course, lesson } = result;
  const lessons = course.lessons ?? [];
  const idx = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = idx > 0 ? lessons[idx - 1] : null;
  const nextLesson = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const progress = user ? await getLessonProgress(user.id, course.id) : [];
  const isCompleted = progress.some((p) => p.lesson_id === lessonId && p.completed);
  const access = user ? await getMembershipAccess(user.email, user.isAdmin) : { paid: false };

  return (
      <LessonClient
        course={course}
        lesson={lesson}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        isCompleted={isCompleted}
        paid={access.paid}
      />
  );
}

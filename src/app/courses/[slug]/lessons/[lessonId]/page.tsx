import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LessonClient } from "@/components/courses/lesson-client";
import { getLesson, getLessonProgress } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getSession } from "@/lib/auth/session";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  await ensurePlatformSeeded();
  const { slug, lessonId } = await params;
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated) redirect(`/login?redirect=/courses/${slug}/lessons/${lessonId}`);

  const result = await getLesson(slug, lessonId);
  if (!result) notFound();

  const { course, lesson } = result;
  const lessons = course.lessons ?? [];
  const idx = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = idx > 0 ? lessons[idx - 1] : null;
  const nextLesson = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const progress = user ? await getLessonProgress(user.id, course.id) : [];
  const isCompleted = progress.some((p) => p.lesson_id === lessonId && p.completed);

  return (
    <AppShell>
      <LessonClient
        course={course}
        lesson={lesson}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        isCompleted={isCompleted}
      />
    </AppShell>
  );
}

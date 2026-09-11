import { notFound, redirect } from "next/navigation";
import { PlatformHeader } from "@/components/layout/platform-nav";
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
    <div className="min-h-screen bg-slate-50">
      <PlatformHeader showAuth={false} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <LessonClient
          course={course}
          lesson={lesson}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          isCompleted={isCompleted}
        />
      </div>
    </div>
  );
}

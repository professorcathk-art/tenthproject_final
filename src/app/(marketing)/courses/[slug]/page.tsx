import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowLeft, Lock } from "lucide-react";
import { getCourseBySlug, getLessonProgress } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getSession } from "@/lib/auth/session";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return pageMetadata({
    title: course.title,
    description: course.description || course.title,
    path: `/courses/${course.slug}`,
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await ensurePlatformSeeded();
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const dict = await getDict();

  const { user, isAuthenticated } = await getSession();
  let completedIds = new Set<string>();
  if (isAuthenticated && user) {
    const progress = await getLessonProgress(user.id, course.id);
    completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));
  }

  const lessons = course.lessons ?? [];
  const progressPct = lessons.length ? Math.round((completedIds.size / lessons.length) * 100) : 0;

  return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/courses" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> {dict.courses.allCourses}
        </Link>
        <p className="text-sm font-medium text-slate-500">{dict.courses.instructors}</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">{course.title}</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">{course.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">{lessons.length} {dict.courses.lessons}</Badge>
        </div>

        {isAuthenticated ? (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{dict.courses.progress}</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        ) : null}

        <div className="mt-8 space-y-2">
          {lessons.map((lesson, i) => {
            const done = completedIds.has(lesson.id);
            const href = isAuthenticated ? `/learning/${slug}/lessons/${lesson.id}` : `/login?redirect=/learning/${slug}/lessons/${lesson.id}`;
            return (
              <Link key={lesson.id} href={href}>
                <div className="flex items-center gap-3 rounded-xl glass-panel glow-card p-4">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : isAuthenticated ? (
                    <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                  ) : (
                    <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {i + 1}. {lesson.title}
                    </p>
                    {lesson.quiz_data?.length ? (
                      <p className="text-xs text-slate-400 mt-0.5">{dict.courses.includesQuiz}</p>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!isAuthenticated && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <JoinLifetimeButton>{dict.courses.enroll}</JoinLifetimeButton>
          </div>
        )}
      </div>
  );
}

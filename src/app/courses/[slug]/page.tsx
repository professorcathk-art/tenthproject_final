import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { getCourseBySlug, getLessonProgress } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getSession } from "@/lib/auth/session";
import { getDict } from "@/lib/i18n/server";

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
    <MarketingShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/courses" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> {dict.courses.allCourses}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
        <p className="text-slate-600 mt-2 leading-relaxed">{course.description}</p>
        <div className="flex gap-2 mt-3">
          <Badge>{course.level}</Badge>
          <Badge variant="outline">{lessons.length} {dict.courses.lessons}</Badge>
        </div>

        {isAuthenticated && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{dict.courses.progress}</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        )}

        <div className="mt-8 space-y-2">
          {lessons.map((lesson, i) => {
            const done = completedIds.has(lesson.id);
            return (
              <Link key={lesson.id} href={`/courses/${slug}/lessons/${lesson.id}`}>
                <Card className="hover:border-slate-300 transition-colors">
                  <CardContent className="flex items-center gap-3 py-4">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {i + 1}. {lesson.title}
                      </p>
                      {lesson.quiz_data?.length ? (
                        <p className="text-xs text-slate-400">{dict.courses.includesQuiz}</p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </MarketingShell>
  );
}

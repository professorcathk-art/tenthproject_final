import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowLeft, Lock } from "lucide-react";
import { getCourseBySlug, getLessonProgress } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getSession } from "@/lib/auth/session";
import { getMembershipAccess } from "@/lib/auth/membership";
import { getDict } from "@/lib/i18n/server";
import { redirect } from "next/navigation";
import { PaidGate } from "@/components/courses/paid-gate";
import { classroomFileSrc } from "@/lib/classroom/media";

export default async function LearningCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { isAuthenticated, user } = await getSession();
  const { slug } = await params;
  if (!isAuthenticated || !user) redirect(`/login?redirect=/learning/${slug}`);

  await ensurePlatformSeeded();
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const dict = await getDict();
  const progress = await getLessonProgress(user.id, course.id);
  const completedIds = new Set(progress.filter((item) => item.completed).map((item) => item.lesson_id));
  const lessons = course.lessons ?? [];
  const progressPct = lessons.length ? Math.round((completedIds.size / lessons.length) * 100) : 0;
  const access = await getMembershipAccess(user.email, user.isAdmin);
  const coverSrc = classroomFileSrc(course.cover_image);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/learning" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="mr-1 h-4 w-4" /> {dict.portal.learning}
      </Link>
      {coverSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverSrc} alt="" className="mb-5 h-44 w-full rounded-2xl object-cover border" />
      ) : null}
      <p className="text-sm font-medium text-slate-500">{dict.courses.instructors}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{course.title}</h1>
      <p className="mt-3 leading-relaxed text-slate-600">{course.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline">{lessons.length} {dict.courses.lessons}</Badge>
        {!access.paid ? <Badge variant="secondary">{dict.courses.locked}</Badge> : null}
      </div>
      {!access.paid ? (
        <div className="mt-6">
          <PaidGate title={dict.courses.paidOnly} body={dict.courses.upgradeToWatch} cta={dict.courses.enroll} />
        </div>
      ) : (
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-sm">
            <span>{dict.courses.progress}</span>
            <span>{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      )}
      <div className="mt-8 space-y-2">
        {lessons.map((lesson, index) => {
          const done = completedIds.has(lesson.id);
          const inner = (
            <div className="flex items-center gap-3 rounded-xl glass-panel glow-card p-4">
              {access.paid ? (
                done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                )
              ) : (
                <Lock className="h-5 w-5 shrink-0 text-slate-300" />
              )}
              <div>
                <p className="text-sm font-medium">{index + 1}. {lesson.title}</p>
                {lesson.quiz_data?.length ? (
                  <p className="mt-0.5 text-xs text-slate-400">{dict.courses.includesQuiz}</p>
                ) : null}
              </div>
            </div>
          );
          return access.paid ? (
            <Link key={lesson.id} href={`/learning/${slug}/lessons/${lesson.id}`}>{inner}</Link>
          ) : (
            <div key={lesson.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

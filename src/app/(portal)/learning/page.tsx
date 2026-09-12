import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen } from "lucide-react";
import { getCourseBySlug, getCourses, getLessonProgress, getUserCertificates } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getSession } from "@/lib/auth/session";
import { getDict } from "@/lib/i18n/server";
import { redirect } from "next/navigation";

export default async function LearningHomePage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login?redirect=/learning");

  await ensurePlatformSeeded();
  const courses = await getCourses();
  const dict = await getDict();

  const [rows, certificates] = await Promise.all([
    Promise.all(
      courses.map(async (course) => {
        const full = await getCourseBySlug(course.slug);
        const lessons = full?.lessons ?? [];
        const progress = await getLessonProgress(user.id, course.id);
        const done = progress.filter((item) => item.completed).length;
        return { course, lessons: lessons.length, done, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
      }),
    ),
    getUserCertificates(user.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-800">
          <BookOpen className="h-4 w-4" /> {dict.portal.learning}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.portal.learning}</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{dict.courses.subtitle}</p>
      </div>
      <div className="grid gap-4">
        {rows.map(({ course, lessons, done, pct }) => (
          <Link key={course.id} href={`/learning/${course.slug}`} className="rounded-2xl glass-panel glow-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{course.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{lessons} {dict.courses.lessons}</Badge>
                  <Badge variant="secondary">{done}/{lessons}</Badge>
                </div>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
            </div>
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>{dict.courses.progress}</span>
                <span>{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          </Link>
        ))}
      </div>
      <div className="rounded-2xl glass-panel p-6">
        <h2 className="text-lg font-semibold">{dict.courses.yourCerts}</h2>
        {certificates.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{dict.courses.noCerts}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificate/${cert.certificate_code}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <span className="font-mono">{cert.certificate_code}</span>
                <span className="text-slate-500">{dict.courses.viewCert}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

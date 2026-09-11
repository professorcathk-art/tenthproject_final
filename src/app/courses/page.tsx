import Link from "next/link";
import { MarketingShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, ArrowRight, Award, Users } from "lucide-react";
import { getCourses } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getDict } from "@/lib/i18n/server";
import { getSession } from "@/lib/auth/session";
import { FLAGSHIP_SLUG } from "@/lib/seed/platform-seed";

export default async function CoursesPage() {
  await ensurePlatformSeeded();
  const courses = await getCourses();
  const dict = await getDict();
  const { isAuthenticated } = await getSession();

  return (
    <MarketingShell>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 mb-4 shadow-sm">
            <GraduationCap className="h-4 w-4" /> {dict.courses.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{dict.courses.title}</h1>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">{dict.courses.subtitle}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-4 py-1.5 text-sm text-slate-700">
            <Users className="h-4 w-4" /> {dict.courses.instructors}
          </div>
        </div>

        <div className="space-y-6">
          {courses.map((course) => (
            <article
              key={course.id}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <Badge variant="secondary" className="mb-3">{course.level}</Badge>
              <h2 className="text-2xl font-semibold tracking-tight">{course.title}</h2>
              <p className="text-slate-600 mt-3 leading-relaxed">{course.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {course.duration_hours} {dict.courses.hours}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" /> {dict.courses.certBadge}
                </span>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {isAuthenticated ? (
                  <Link href={`/courses/${course.slug}`}>
                    <Button size="lg" className="h-11 px-6 font-semibold">
                      {dict.nav.classroom} <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href={`/courses/${course.slug}`}>
                      <Button size="lg" variant="outline" className="h-11 px-6 font-semibold">
                        {dict.courses.outline}
                      </Button>
                    </Link>
                    <Link href={`/login?redirect=/courses/${course.slug}`}>
                      <Button size="lg" className="h-11 px-6 font-semibold">
                        {dict.courses.enroll} <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        {!courses.length ? (
          <p className="text-center text-slate-500">
            <Link href={`/courses/${FLAGSHIP_SLUG}`} className="underline">{dict.courses.outline}</Link>
          </p>
        ) : null}
      </div>
    </MarketingShell>
  );
}

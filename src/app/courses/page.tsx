import Link from "next/link";
import { MarketingShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, ArrowRight } from "lucide-react";
import { getCourses } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getDict } from "@/lib/i18n/server";

export default async function CoursesPage() {
  await ensurePlatformSeeded();
  const courses = await getCourses();
  const dict = await getDict();

  return (
    <MarketingShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800 mb-4">
            <GraduationCap className="h-4 w-4" /> {dict.courses.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{dict.courses.title}</h1>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">{dict.courses.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Badge variant="secondary" className="mb-2 w-fit">{course.level}</Badge>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="mt-2 leading-relaxed">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock className="h-4 w-4" /> {course.duration_hours}{dict.courses.hours}
                </span>
                <Link href={`/courses/${course.slug}`}>
                  <Button>
                    {dict.courses.start} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MarketingShell>
  );
}

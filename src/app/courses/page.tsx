import Link from "next/link";
import { PlatformHeader } from "@/components/layout/platform-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, ArrowRight } from "lucide-react";
import { getCourses } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";

export default async function CoursesPage() {
  await ensurePlatformSeeded();
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-slate-50">
      <PlatformHeader />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            <GraduationCap className="h-4 w-4" /> Tenth Project Academy
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Learn Vibe Coding & AI Agents</h1>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">
            From zero to hero — interactive courses with quizzes and certifications.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">{course.level}</Badge>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="mt-2">{course.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock className="h-4 w-4" /> {course.duration_hours}h
                </span>
                <Link href={`/courses/${course.slug}`}>
                  <Button>Start course <ArrowRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

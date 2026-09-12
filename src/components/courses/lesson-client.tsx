"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizDialog } from "@/components/courses/quiz-dialog";
import { useI18n } from "@/components/i18n/provider";
import type { Course, Lesson } from "@/types/platform";

interface LessonClientProps {
  course: Course;
  lesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  isCompleted: boolean;
}

export function LessonClient({ course, lesson, prevLesson, nextLesson, isCompleted }: LessonClientProps) {
  const { dict } = useI18n();
  const [completed, setCompleted] = useState(isCompleted);
  const [quizOpen, setQuizOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function markComplete(quizScore?: number) {
    setLoading(true);
    const res = await fetch("/api/courses/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, courseId: course.id, courseSlug: course.slug, quizScore }),
    });
    const data = await res.json();
    setCompleted(true);
    setLoading(false);
    if (data.certificate) {
      alert(`${dict.courses.certificateIssued}${data.certificate.certificate_code}`);
    }
  }

  function handleCompleteClick() {
    if (lesson.quiz_data?.length) setQuizOpen(true);
    else markComplete();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href={`/learning/${course.slug}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> {course.title}
        </Link>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
      </div>

      {lesson.video_url && (
        <div className="aspect-video rounded-xl overflow-hidden border bg-slate-900">
          <iframe src={lesson.video_url} className="w-full h-full" allowFullScreen title={lesson.title} />
        </div>
      )}

      {lesson.content_md && (
        <Card>
          <CardContent className="pt-6 prose prose-slate prose-sm max-w-none">
            {lesson.content_md.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
              if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-3 mb-1">{line.slice(3)}</h2>;
              if (line.startsWith("```")) return null;
              if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
              if (line.match(/^\d+\./)) return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\.\s*/, "")}</li>;
              if (line.includes("**")) return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
              if (line.trim()) return <p key={i} className="mb-2 text-slate-600">{line}</p>;
              return null;
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        {prevLesson ? (
          <Link href={`/learning/${course.slug}/lessons/${prevLesson.id}`}>
            <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-1" /> {dict.courses.previous}</Button>
          </Link>
        ) : <div />}
        <div className="flex gap-2">
          {!completed ? (
            <Button onClick={handleCompleteClick} disabled={loading}>
              {loading ? dict.courses.saving : dict.courses.markComplete}
            </Button>
          ) : (
            <span className="flex items-center gap-1 text-green-700 text-sm"><CheckCircle2 className="h-4 w-4" /> {dict.courses.completed}</span>
          )}
          {nextLesson && (
            <Link href={`/learning/${course.slug}/lessons/${nextLesson.id}`}>
              <Button>{dict.courses.next} <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          )}
        </div>
      </div>

      <QuizDialog
        questions={lesson.quiz_data ?? []}
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onComplete={(score) => { setQuizOpen(false); markComplete(score); }}
      />
    </div>
  );
}

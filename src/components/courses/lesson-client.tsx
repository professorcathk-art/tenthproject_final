"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizDialog } from "@/components/courses/quiz-dialog";
import { PaidGate } from "@/components/courses/paid-gate";
import { useI18n } from "@/components/i18n/provider";
import { classroomFileSrc, inferVideoType, sanitizeClassroomHtml, toYoutubeEmbed } from "@/lib/classroom/media";
import type { Course, Lesson } from "@/types/platform";

interface LessonClientProps {
  course: Course;
  lesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  isCompleted: boolean;
  paid: boolean;
}

export function LessonClient({ course, lesson, prevLesson, nextLesson, isCompleted, paid }: LessonClientProps) {
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

  if (!paid) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href={`/learning/${course.slug}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="mr-1 h-4 w-4" /> {course.title}
        </Link>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <PaidGate title={dict.courses.paidOnly} body={dict.courses.upgradeToWatch} cta={dict.courses.unlockFull} />
      </div>
    );
  }

  const notes = lesson.html_content || lesson.content_md || "";
  const videoType = inferVideoType(lesson.video_url, lesson.video_type);
  const videoSrc = lesson.video_url
    ? videoType === "youtube"
      ? toYoutubeEmbed(lesson.video_url)
      : classroomFileSrc(lesson.video_url)
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href={`/learning/${course.slug}`} className="mb-2 inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="mr-1 h-4 w-4" /> {course.title}
        </Link>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
      </div>

      {videoSrc && videoType === "youtube" ? (
        <div className="aspect-video overflow-hidden rounded-xl border bg-slate-900">
          <iframe src={videoSrc} className="h-full w-full" allowFullScreen title={lesson.title} />
        </div>
      ) : null}

      {videoSrc && videoType === "mp4" ? (
        <div className="overflow-hidden rounded-xl border bg-slate-900">
          <video src={videoSrc} className="aspect-video w-full" controls playsInline preload="metadata" />
        </div>
      ) : null}

      {notes ? (
        <Card>
          <CardContent
            className="prose prose-sm prose-slate max-w-none pt-6"
            dangerouslySetInnerHTML={{ __html: sanitizeClassroomHtml(notes) }}
          />
        </Card>
      ) : null}

      {(lesson.links ?? []).length ? (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <h2 className="text-sm font-semibold">{dict.courses.resources}</h2>
            {(lesson.links ?? []).map((link) => (
              <a
                key={`${link.title}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-700 hover:underline"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                {link.title || link.url}
              </a>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {(lesson.materials ?? []).length ? (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <h2 className="text-sm font-semibold">{dict.courses.downloads}</h2>
            {(lesson.materials ?? []).map((file) => {
              const href = classroomFileSrc(file.file_url, true);
              if (!href) return null;
              return (
                <a
                  key={file.id}
                  href={href}
                  className="flex items-center gap-2 text-sm text-slate-700 hover:underline"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  {file.title || file.file_name || dict.courses.downloads}
                </a>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex items-center justify-between border-t pt-4">
        {prevLesson ? (
          <Link href={`/learning/${course.slug}/lessons/${prevLesson.id}`}>
            <Button variant="outline"><ArrowLeft className="mr-1 h-4 w-4" /> {dict.courses.previous}</Button>
          </Link>
        ) : <div />}
        <div className="flex gap-2">
          {!completed ? (
            <Button onClick={handleCompleteClick} disabled={loading}>
              {loading ? dict.courses.saving : dict.courses.markComplete}
            </Button>
          ) : (
            <span className="flex items-center gap-1 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" /> {dict.courses.completed}</span>
          )}
          {nextLesson && (
            <Link href={`/learning/${course.slug}/lessons/${nextLesson.id}`}>
              <Button>{dict.courses.next} <ArrowRight className="ml-1 h-4 w-4" /></Button>
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

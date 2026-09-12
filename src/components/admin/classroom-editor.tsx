"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classroomFileSrc } from "@/lib/classroom/media";
import { useI18n } from "@/components/i18n/provider";
import type { Course, Lesson, LessonLink, LessonMaterial, VideoType } from "@/types/platform";

const emptyCourse = {
  id: "",
  title: "",
  slug: "",
  description: "",
  level: "beginner",
  duration_hours: "4",
  cover_image: "",
  published: true,
};

const emptyLesson = {
  id: "",
  title: "",
  order_index: "0",
  video_url: "",
  video_type: "youtube" as VideoType,
  html_content: "",
  quiz_data: "",
  links: [] as LessonLink[],
  materials: [] as LessonMaterial[],
};

async function uploadClassroomFile(
  file: File,
  kind: "cover" | "video" | "material",
  extra: { courseId?: string; lessonId?: string },
) {
  const res = await fetch("/api/admin/classroom/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      kind,
      courseId: extra.courseId,
      lessonId: extra.lessonId,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload URL failed");
  const put = await fetch(data.signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!put.ok) throw new Error("Upload failed");
  return data.path as string;
}

export function ClassroomEditor({
  courses,
  setCourses,
}: {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}) {
  const { dict } = useI18n();
  const a = dict.admin;
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? "");
  const [courseForm, setCourseForm] = useState(() => {
    const first = courses[0];
    return first
      ? {
          id: first.id,
          title: first.title,
          slug: first.slug,
          description: first.description ?? "",
          level: first.level,
          duration_hours: String(first.duration_hours),
          cover_image: first.cover_image ?? "",
          published: first.published,
        }
      : emptyCourse;
  });
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const selected = courses.find((c) => c.id === selectedCourseId);

  function loadCourse(course: Course) {
    setSelectedCourseId(course.id);
    setCourseForm({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description ?? "",
      level: course.level,
      duration_hours: String(course.duration_hours),
      cover_image: course.cover_image ?? "",
      published: course.published,
    });
    setLessonForm(emptyLesson);
  }

  function startNewCourse() {
    setSelectedCourseId("");
    setCourseForm(emptyCourse);
    setLessonForm(emptyLesson);
  }

  function loadLesson(lesson: Lesson) {
    setLessonForm({
      id: lesson.id,
      title: lesson.title,
      order_index: String(lesson.order_index),
      video_url: lesson.video_url ?? "",
      video_type: lesson.video_type === "mp4" ? "mp4" : "youtube",
      html_content: lesson.html_content || lesson.content_md || "",
      quiz_data: lesson.quiz_data?.length ? JSON.stringify(lesson.quiz_data, null, 2) : "",
      links: lesson.links ?? [],
      materials: lesson.materials ?? [],
    });
  }

  async function saveCourse() {
    setSaving(true);
    const payload = {
      id: courseForm.id || undefined,
      title: courseForm.title,
      slug: courseForm.slug,
      description: courseForm.description,
      level: courseForm.level,
      duration_hours: Number(courseForm.duration_hours) || 1,
      cover_image: courseForm.cover_image || null,
      published: courseForm.published,
    };
    const res = await fetch("/api/admin/courses", {
      method: courseForm.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseForm.id ? { kind: "course", ...payload } : payload),
    });
    const data = await res.json();
    if (data.course) {
      setCourses((list) => {
        const next = { ...data.course, lessons: list.find((c) => c.id === data.course.id)?.lessons ?? [] } as Course;
        const exists = list.some((c) => c.id === next.id);
        return exists ? list.map((c) => (c.id === next.id ? { ...c, ...next } : c)) : [next, ...list];
      });
      setSelectedCourseId(data.course.id);
      setCourseForm((form) => ({ ...form, id: data.course.id, slug: data.course.slug }));
    }
    setSaving(false);
  }

  async function togglePublished(course: Course) {
    const res = await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "course", ...course, published: !course.published }),
    });
    const data = await res.json();
    if (data.course) {
      setCourses((list) => list.map((c) => (c.id === course.id ? { ...c, published: data.course.published } : c)));
      if (courseForm.id === course.id) setCourseForm((form) => ({ ...form, published: data.course.published }));
    }
  }

  async function removeCourse(id: string) {
    if (!confirm(a.confirmDelete)) return;
    await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCourses((list) => list.filter((c) => c.id !== id));
    if (selectedCourseId === id || courseForm.id === id) startNewCourse();
  }

  async function saveLesson() {
    const courseId = selectedCourseId || courseForm.id;
    if (!courseId) return;
    setSaving(true);
    const lessonId = lessonForm.id || uuidv4();
    const res = await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "lesson",
        id: lessonId,
        course_id: courseId,
        title: lessonForm.title,
        order_index: Number(lessonForm.order_index) || 0,
        video_url: lessonForm.video_url,
        video_type: lessonForm.video_type,
        content_md: lessonForm.html_content,
        html_content: lessonForm.html_content,
        quiz_data: lessonForm.quiz_data,
        links: lessonForm.links,
        materials: lessonForm.materials,
      }),
    });
    const data = await res.json();
    if (data.lesson) {
      setCourses((list) =>
        list.map((c) => {
          if (c.id !== courseId) return c;
          const lessons = c.lessons ?? [];
          const exists = lessons.some((l) => l.id === data.lesson.id);
          return {
            ...c,
            lessons: exists
              ? lessons.map((l) => (l.id === data.lesson.id ? data.lesson : l))
              : [...lessons, data.lesson as Lesson],
          };
        }),
      );
      setLessonForm((form) => ({ ...form, id: data.lesson.id }));
    }
    setSaving(false);
  }

  async function removeLesson(id: string) {
    if (!confirm(a.confirmDelete)) return;
    await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "lesson", id }),
    });
    setCourses((list) => list.map((c) => ({ ...c, lessons: (c.lessons ?? []).filter((l) => l.id !== id) })));
    if (lessonForm.id === id) setLessonForm(emptyLesson);
  }

  async function handleUpload(
    file: File | undefined,
    kind: "cover" | "video" | "material",
  ) {
    if (!file) return;
    const courseId = courseForm.id || selectedCourseId || "draft";
    const lessonId = lessonForm.id || uuidv4();
    if (kind !== "cover" && !lessonForm.id) {
      setLessonForm((form) => ({ ...form, id: lessonId }));
    }
    setUploading(kind);
    try {
      const path = await uploadClassroomFile(file, kind, { courseId, lessonId });
      if (kind === "cover") setCourseForm((form) => ({ ...form, cover_image: path }));
      if (kind === "video") {
        setLessonForm((form) => ({ ...form, id: form.id || lessonId, video_url: path, video_type: "mp4" }));
      }
      if (kind === "material") {
        const material: LessonMaterial = {
          id: uuidv4(),
          lesson_id: lessonId,
          title: file.name,
          file_url: path,
          file_name: file.name,
          created_at: new Date().toISOString(),
        };
        setLessonForm((form) => ({ ...form, id: form.id || lessonId, materials: [...form.materials, material] }));
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : a.uploadFail);
    }
    setUploading("");
  }

  const coverSrc = classroomFileSrc(courseForm.cover_image);

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{courseForm.id ? a.editCourse : a.addCourse}</CardTitle>
            <CardDescription>{a.coursesHint}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={startNewCourse}>
                {a.addCourse}
              </Button>
            </div>
            <div className="space-y-1">
              <Label>{a.titleField}</Label>
              <Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{a.slug}</Label>
              <Input value={courseForm.slug} onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{a.description}</Label>
              <Textarea rows={3} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={courseForm.level} onValueChange={(v) => v && setCourseForm({ ...courseForm, level: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{a.beginner}</SelectItem>
                  <SelectItem value="intermediate">{a.intermediate}</SelectItem>
                  <SelectItem value="advanced">{a.advanced}</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" min={1} placeholder={a.hours} value={courseForm.duration_hours} onChange={(e) => setCourseForm({ ...courseForm, duration_hours: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{a.cover}</Label>
              <p className="text-xs text-slate-500">{a.coverHint}</p>
              <Input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0], "cover")} />
              {uploading === "cover" ? <p className="text-xs text-slate-500">{a.uploading}</p> : null}
              {coverSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverSrc} alt="" className="mt-2 h-28 w-full rounded-lg object-cover border" />
              ) : null}
            </div>
            <Button onClick={saveCourse} disabled={!courseForm.title || saving}>
              {courseForm.id ? a.saveCourse : a.addCourse}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {courses.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => loadCourse(c)}
              className={`w-full text-left rounded-xl border p-4 transition-colors ${
                selectedCourseId === c.id ? "border-slate-900 bg-white shadow-sm" : "border-slate-200 bg-white/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {c.slug} · {(c.lessons ?? []).length} {a.chapters}
                  </p>
                </div>
                <Badge variant={c.published ? "default" : "secondary"}>{c.published ? a.published : a.draft}</Badge>
              </div>
              <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" variant="outline" onClick={() => togglePublished(c)}>
                  {c.published ? a.draft : a.published}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeCourse(c.id)}>{a.delete}</Button>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{lessonForm.id ? a.editChapter : a.addChapter}</CardTitle>
          <CardDescription>{selected ? selected.title : a.emptyLessons}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!selected && !courseForm.id ? (
            <p className="text-sm text-slate-500">{a.emptyLessons}</p>
          ) : (
            <>
              <Button type="button" size="sm" variant="outline" onClick={() => setLessonForm(emptyLesson)}>
                {a.addChapter}
              </Button>
              <div className="space-y-1">
                <Label>{a.titleField}</Label>
                <Input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{a.order}</Label>
                <p className="text-xs text-slate-500">{a.orderHint}</p>
                <Input type="number" min={0} value={lessonForm.order_index} onChange={(e) => setLessonForm({ ...lessonForm, order_index: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{a.videoType}</Label>
                <Select
                  value={lessonForm.video_type}
                  onValueChange={(v) => v && setLessonForm({ ...lessonForm, video_type: v as VideoType })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">{a.mp4Hosted}</SelectItem>
                    <SelectItem value="youtube">{a.youtube}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {lessonForm.video_type === "youtube" ? (
                <div className="space-y-1">
                  <Label>{a.video}</Label>
                  <p className="text-xs text-slate-500">{a.youtubeHint}</p>
                  <Input value={lessonForm.video_url} onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })} />
                </div>
              ) : (
                <div className="space-y-1">
                  <Label>{a.mp4Upload}</Label>
                  <p className="text-xs text-slate-500">{a.mp4Hint}</p>
                  <Input type="file" accept="video/mp4,video/*" onChange={(e) => handleUpload(e.target.files?.[0], "video")} />
                  {uploading === "video" ? <p className="text-xs text-slate-500">{a.uploading}</p> : null}
                  {lessonForm.video_url ? <p className="text-xs text-slate-500 break-all">{lessonForm.video_url}</p> : null}
                </div>
              )}
              <div className="space-y-1">
                <Label>{a.htmlNotes}</Label>
                <p className="text-xs text-slate-500">{a.htmlHint}</p>
                <Textarea rows={8} value={lessonForm.html_content} onChange={(e) => setLessonForm({ ...lessonForm, html_content: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{a.links}</Label>
                {lessonForm.links.map((link, index) => (
                  <div key={`${link.url}-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <Input
                      placeholder={a.linkTitle}
                      value={link.title}
                      onChange={(e) => {
                        const links = [...lessonForm.links];
                        links[index] = { ...link, title: e.target.value };
                        setLessonForm({ ...lessonForm, links });
                      }}
                    />
                    <Input
                      placeholder={a.linkUrl}
                      value={link.url}
                      onChange={(e) => {
                        const links = [...lessonForm.links];
                        links[index] = { ...link, url: e.target.value };
                        setLessonForm({ ...lessonForm, links });
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setLessonForm({ ...lessonForm, links: lessonForm.links.filter((_, i) => i !== index) })}
                    >
                      {a.delete}
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setLessonForm({ ...lessonForm, links: [...lessonForm.links, { title: "", url: "" }] })}
                >
                  {a.addLink}
                </Button>
              </div>
              <div className="space-y-2">
                <Label>{a.materials}</Label>
                <Input type="file" onChange={(e) => handleUpload(e.target.files?.[0], "material")} />
                {uploading === "material" ? <p className="text-xs text-slate-500">{a.uploading}</p> : null}
                {lessonForm.materials.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                    <span className="truncate">{file.title}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setLessonForm({ ...lessonForm, materials: lessonForm.materials.filter((item) => item.id !== file.id) })}
                    >
                      {a.delete}
                    </Button>
                  </div>
                ))}
              </div>
              <Textarea placeholder={a.quizHint} value={lessonForm.quiz_data} onChange={(e) => setLessonForm({ ...lessonForm, quiz_data: e.target.value })} rows={4} className="font-mono text-xs" />
              <p className="text-xs text-slate-400">{a.quizJson}</p>
              <Button onClick={saveLesson} disabled={!lessonForm.title || saving}>{lessonForm.id ? a.save : a.addChapter}</Button>
              <div className="pt-4 space-y-2 border-t">
                {(selected?.lessons ?? []).length === 0 ? (
                  <p className="text-sm text-slate-500">{a.emptyLessons}</p>
                ) : (
                  (selected?.lessons ?? [])
                    .slice()
                    .sort((x, y) => x.order_index - y.order_index)
                    .map((l) => (
                      <div key={l.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <button type="button" className="text-left" onClick={() => loadLesson(l)}>
                          <p className="font-medium">{l.order_index}. {l.title}</p>
                          <p className="text-xs text-slate-500">
                            {l.video_url ? `${l.video_type === "mp4" ? "MP4" : "YouTube"} · ` : ""}
                            {(l.links?.length ?? 0) ? `${a.links} · ` : ""}
                            {(l.materials?.length ?? 0) ? `${a.materials} · ` : ""}
                            {a.editChapter}
                          </p>
                        </button>
                        <Button size="sm" variant="ghost" onClick={() => removeLesson(l.id)}>{a.delete}</Button>
                      </div>
                    ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

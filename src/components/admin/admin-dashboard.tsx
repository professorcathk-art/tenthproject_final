"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/components/i18n/provider";
import type { CaseStudy, Course, EnterpriseEnquiry, Lesson, Member } from "@/types/platform";

interface AdminDashboardProps {
  initialCaseStudies: CaseStudy[];
  initialEnquiries: EnterpriseEnquiry[];
  initialCourses: Course[];
  initialMembers: Member[];
}

const emptyCourse = {
  title: "",
  slug: "",
  description: "",
  level: "beginner",
  duration_hours: "4",
  cover_image: "",
  published: true,
};

const emptyLesson = {
  title: "",
  order_index: "0",
  video_url: "",
  content_md: "",
  quiz_data: "",
};

const emptyMember = {
  email: "",
  name: "",
  plan: "academy" as Member["plan"],
  status: "active" as Member["status"],
  notes: "",
};

export function AdminDashboard({
  initialCaseStudies,
  initialEnquiries,
  initialCourses,
  initialMembers,
}: AdminDashboardProps) {
  const { dict, locale } = useI18n();
  const a = dict.admin;
  const [caseStudies, setCaseStudies] = useState(initialCaseStudies);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [courses, setCourses] = useState(initialCourses);
  const [members, setMembers] = useState(initialMembers);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourses[0]?.id ?? "");
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [newStudy, setNewStudy] = useState({
    title: "",
    summary: "",
    category: "saas",
    breakdown_md: "",
    tech_stack: "",
  });
  const [saving, setSaving] = useState(false);

  const selected = courses.find((c) => c.id === selectedCourseId);

  async function saveCourse() {
    setSaving(true);
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: courseForm.title,
        slug: courseForm.slug,
        description: courseForm.description,
        level: courseForm.level,
        duration_hours: Number(courseForm.duration_hours) || 1,
        cover_image: courseForm.cover_image || null,
        published: courseForm.published,
      }),
    });
    const data = await res.json();
    if (data.course) {
      setCourses((list) => [{ ...data.course, lessons: [] }, ...list]);
      setSelectedCourseId(data.course.id);
      setCourseForm(emptyCourse);
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
    if (selectedCourseId === id) setSelectedCourseId("");
  }

  async function saveLesson() {
    if (!selectedCourseId) return;
    setSaving(true);
    const res = await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "lesson",
        course_id: selectedCourseId,
        title: lessonForm.title,
        order_index: Number(lessonForm.order_index) || 0,
        video_url: lessonForm.video_url,
        content_md: lessonForm.content_md,
        quiz_data: lessonForm.quiz_data,
      }),
    });
    const data = await res.json();
    if (data.lesson) {
      setCourses((list) =>
        list.map((c) =>
          c.id === selectedCourseId ? { ...c, lessons: [...(c.lessons ?? []), data.lesson as Lesson] } : c
        )
      );
      setLessonForm(emptyLesson);
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
    setCourses((list) =>
      list.map((c) => ({ ...c, lessons: (c.lessons ?? []).filter((l) => l.id !== id) }))
    );
  }

  async function saveMember() {
    setSaving(true);
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberForm),
    });
    const data = await res.json();
    if (data.member) {
      setMembers((list) => [data.member, ...list.filter((m) => m.email !== data.member.email)]);
      setMemberForm(emptyMember);
    }
    setSaving(false);
  }

  async function removeMember(id: string) {
    if (!confirm(a.confirmDelete)) return;
    await fetch("/api/admin/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMembers((list) => list.filter((m) => m.id !== id));
  }

  async function addCaseStudy() {
    const res = await fetch("/api/admin/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newStudy,
        tech_stack: newStudy.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
        breakdown_md: newStudy.breakdown_md || `# ${newStudy.title}\n\n${newStudy.summary}`,
      }),
    });
    const data = await res.json();
    if (data.caseStudy) {
      setCaseStudies((s) => [data.caseStudy, ...s]);
      setNewStudy({ title: "", summary: "", category: "saas", breakdown_md: "", tech_stack: "" });
    }
  }

  async function updateEnquiryStatus(id: string, status: string) {
    await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setEnquiries((e) => e.map((x) => (x.id === id ? { ...x, status: status as EnterpriseEnquiry["status"] } : x)));
  }

  async function deleteStudy(id: string) {
    if (!confirm(a.confirmDelete)) return;
    await fetch("/api/admin/case-studies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCaseStudies((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{a.title}</h1>
        <p className="text-slate-600 mt-1">{a.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">{a.courses}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">{a.members}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{members.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">{a.cases}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{caseStudies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">{a.leads}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {enquiries.filter((e) => e.status === "pending").length}{" "}
              <span className="text-sm font-normal text-slate-500">{a.pending}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="courses">{a.courses}</TabsTrigger>
          <TabsTrigger value="members">{a.members}</TabsTrigger>
          <TabsTrigger value="case-studies">{a.cases}</TabsTrigger>
          <TabsTrigger value="enquiries">{a.leads}</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{a.addCourse}</CardTitle>
                <CardDescription>{a.coursesHint}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder={a.titleField} value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
                <Input placeholder={a.slug} value={courseForm.slug} onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })} />
                <Textarea placeholder={a.description} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} rows={3} />
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
                <Input placeholder={a.cover} value={courseForm.cover_image} onChange={(e) => setCourseForm({ ...courseForm, cover_image: e.target.value })} />
                <Button onClick={saveCourse} disabled={!courseForm.title || saving}>{a.addCourse}</Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-colors ${
                    selectedCourseId === c.id ? "border-slate-900 bg-white shadow-sm" : "border-slate-200 bg-white/60 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {c.slug} · {(c.lessons ?? []).length} {a.lessons}
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
              <CardTitle className="text-base">{a.addLesson}</CardTitle>
              <CardDescription>
                {selected ? selected.title : a.emptyLessons}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!selected ? (
                <p className="text-sm text-slate-500">{a.emptyLessons}</p>
              ) : (
                <>
                  <Input placeholder={a.titleField} value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" min={0} placeholder={a.order} value={lessonForm.order_index} onChange={(e) => setLessonForm({ ...lessonForm, order_index: e.target.value })} />
                    <Input placeholder={a.video} value={lessonForm.video_url} onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })} />
                  </div>
                  <Textarea placeholder={a.notes} value={lessonForm.content_md} onChange={(e) => setLessonForm({ ...lessonForm, content_md: e.target.value })} rows={8} />
                  <Textarea placeholder={a.quizHint} value={lessonForm.quiz_data} onChange={(e) => setLessonForm({ ...lessonForm, quiz_data: e.target.value })} rows={5} className="font-mono text-xs" />
                  <p className="text-xs text-slate-400">{a.quizJson}</p>
                  <Button onClick={saveLesson} disabled={!lessonForm.title || saving}>{a.addLesson}</Button>
                  <div className="pt-4 space-y-2 border-t">
                    {(selected.lessons ?? []).length === 0 ? (
                      <p className="text-sm text-slate-500">{a.emptyLessons}</p>
                    ) : (
                      (selected.lessons ?? [])
                        .slice()
                        .sort((x, y) => x.order_index - y.order_index)
                        .map((l) => (
                          <div key={l.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                            <div>
                              <p className="font-medium">{l.order_index}. {l.title}</p>
                              <p className="text-xs text-slate-500">
                                {l.video_url ? "Video · " : ""}
                                {l.quiz_data?.length ? `${a.quizJson.split(" ")[0]} · ` : ""}
                                {(l.content_md || "").length} chars
                              </p>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => removeLesson(l.id)}>{a.delete}</Button>
                          </div>
                        ))
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{a.addMember}</CardTitle>
              <CardDescription>{a.membersHint}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Input placeholder={a.email} type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
              <Input placeholder={a.name} value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
              <Select value={memberForm.plan} onValueChange={(v) => v && setMemberForm({ ...memberForm, plan: v as Member["plan"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">{a.free}</SelectItem>
                  <SelectItem value="academy">{a.academyPlan}</SelectItem>
                  <SelectItem value="enterprise">{a.enterprisePlan}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={memberForm.status} onValueChange={(v) => v && setMemberForm({ ...memberForm, status: v as Member["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{a.active}</SelectItem>
                  <SelectItem value="paused">{a.paused}</SelectItem>
                </SelectContent>
              </Select>
              <Textarea className="sm:col-span-2" placeholder={a.notes} value={memberForm.notes} onChange={(e) => setMemberForm({ ...memberForm, notes: e.target.value })} rows={2} />
              <Button className="sm:col-span-2 w-fit" onClick={saveMember} disabled={!memberForm.email || saving}>{a.addMember}</Button>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {members.length === 0 ? (
              <p className="text-sm text-slate-500">{a.membersHint}</p>
            ) : (
              members.map((m) => (
                <Card key={m.id}>
                  <CardContent className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{m.name} · {m.email}</p>
                      <p className="text-sm text-slate-500">{m.plan} · {m.status}</p>
                      {m.notes ? <p className="text-xs text-slate-400 mt-1">{m.notes}</p> : null}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => removeMember(m.id)}>{a.delete}</Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{a.addCase}</CardTitle>
              <CardDescription>{a.casesHint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder={a.titleField} value={newStudy.title} onChange={(e) => setNewStudy({ ...newStudy, title: e.target.value })} />
              <Input placeholder={a.summary} value={newStudy.summary} onChange={(e) => setNewStudy({ ...newStudy, summary: e.target.value })} />
              <Input placeholder={a.tech} value={newStudy.tech_stack} onChange={(e) => setNewStudy({ ...newStudy, tech_stack: e.target.value })} />
              <Select value={newStudy.category} onValueChange={(v) => v && setNewStudy({ ...newStudy, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tooling">{dict.inspiration.cats.tooling}</SelectItem>
                  <SelectItem value="platform">{dict.inspiration.cats.platform}</SelectItem>
                  <SelectItem value="content">{dict.inspiration.cats.content}</SelectItem>
                  <SelectItem value="saas">{dict.inspiration.cats.saas}</SelectItem>
                  <SelectItem value="workflow_agent">{dict.inspiration.cats.workflow_agent}</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder={a.body} value={newStudy.breakdown_md} onChange={(e) => setNewStudy({ ...newStudy, breakdown_md: e.target.value })} rows={4} />
              <Button onClick={addCaseStudy} disabled={!newStudy.title || !newStudy.summary}>{a.addCase}</Button>
            </CardContent>
          </Card>
          <div className="space-y-2 max-h-[28rem] overflow-y-auto">
            {caseStudies.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border bg-white p-3 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">{s.category}</Badge>
                  {s.title}
                </div>
                <Button size="sm" variant="ghost" onClick={() => deleteStudy(s.id)}>{a.delete}</Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enquiries" className="mt-4 space-y-2">
          <p className="text-sm text-slate-500 mb-3">{a.leadsHint}</p>
          {enquiries.length === 0 ? (
            <p className="text-slate-500 text-sm">{a.leadsHint}</p>
          ) : (
            enquiries.map((e) => (
              <Card key={e.id}>
                <CardContent className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{e.company_name} — {e.contact_name}</p>
                    <p className="text-sm text-slate-500">{e.email} · {e.service_type}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{e.project_description}</p>
                  </div>
                  <Select value={e.status} onValueChange={(v) => v && updateEnquiryStatus(e.id, v)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{a.pending}</SelectItem>
                      <SelectItem value="contacted">{locale === "zh" ? "已聯絡" : "Contacted"}</SelectItem>
                      <SelectItem value="closed">{locale === "zh" ? "已結束" : "Closed"}</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

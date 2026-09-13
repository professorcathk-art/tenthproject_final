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
import { ClassroomEditor } from "@/components/admin/classroom-editor";
import type { CaseStudy, Course, EnterpriseEnquiry, Member, WebinarSignup } from "@/types/platform";

interface AdminDashboardProps {
  initialCaseStudies: CaseStudy[];
  initialEnquiries: EnterpriseEnquiry[];
  initialCourses: Course[];
  initialMembers: Member[];
  initialWebinars: WebinarSignup[];
}

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
  initialWebinars,
}: AdminDashboardProps) {
  const { dict, locale } = useI18n();
  const a = dict.admin;
  const [caseStudies, setCaseStudies] = useState(initialCaseStudies);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [courses, setCourses] = useState(initialCourses);
  const [members, setMembers] = useState(initialMembers);
  const [webinars, setWebinars] = useState(initialWebinars);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [newStudy, setNewStudy] = useState({
    title: "",
    summary: "",
    category: "saas",
    breakdown_md: "",
    tech_stack: "",
  });
  const [saving, setSaving] = useState(false);

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

  async function updateMember(member: Member, patch: Partial<Member>) {
    const next = { ...member, ...patch };
    const res = await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await res.json();
    if (data.member) {
      setMembers((list) => list.map((item) => (item.id === member.id ? data.member : item)));
    }
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

  async function removeEnquiry(id: string) {
    if (!confirm(a.confirmDelete)) return;
    await fetch("/api/admin/enquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEnquiries((list) => list.filter((item) => item.id !== id));
  }

  async function updateWebinarStatus(id: string, status: string) {
    await fetch("/api/admin/webinars", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setWebinars((list) => list.map((item) => (item.id === id ? { ...item, status: status as WebinarSignup["status"] } : item)));
  }

  async function removeWebinar(id: string) {
    if (!confirm(a.confirmDelete)) return;
    await fetch("/api/admin/webinars", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setWebinars((list) => list.filter((item) => item.id !== id));
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">{a.webinars}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {webinars.filter((item) => item.status === "pending").length}{" "}
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
          <TabsTrigger value="webinars">{a.webinars}</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <ClassroomEditor courses={courses} setCourses={setCourses} />
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
                      {m.notes ? <p className="text-xs text-slate-400 mt-1">{m.notes}</p> : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={m.plan} onValueChange={(v) => v && updateMember(m, { plan: v as Member["plan"] })}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">{a.free}</SelectItem>
                          <SelectItem value="academy">{a.academyPlan}</SelectItem>
                          <SelectItem value="enterprise">{a.enterprisePlan}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={m.status} onValueChange={(v) => v && updateMember(m, { status: v as Member["status"] })}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{a.active}</SelectItem>
                          <SelectItem value="paused">{a.paused}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="ghost" onClick={() => removeMember(m.id)}>{a.delete}</Button>
                    </div>
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
                  <div className="flex items-center gap-2">
                    <Select value={e.status} onValueChange={(v) => v && updateEnquiryStatus(e.id, v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{a.pending}</SelectItem>
                        <SelectItem value="contacted">{locale === "zh" ? "已聯絡" : "Contacted"}</SelectItem>
                        <SelectItem value="closed">{locale === "zh" ? "已結束" : "Closed"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" onClick={() => removeEnquiry(e.id)}>{a.delete}</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="webinars" className="mt-4 space-y-2">
          <p className="mb-3 text-sm text-slate-500">{a.webinarsHint}</p>
          {webinars.length === 0 ? (
            <p className="text-sm text-slate-500">{a.webinarsHint}</p>
          ) : (
            webinars.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col justify-between gap-3 pt-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.email} · {a.whatsapp} {item.whatsapp}</p>
                    <p className="mt-1 text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={item.status} onValueChange={(v) => v && updateWebinarStatus(item.id, v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{a.pending}</SelectItem>
                        <SelectItem value="contacted">{locale === "zh" ? "已聯絡" : "Contacted"}</SelectItem>
                        <SelectItem value="closed">{locale === "zh" ? "已結束" : "Closed"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" onClick={() => removeWebinar(item.id)}>{a.delete}</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CaseStudy, Course, EnterpriseEnquiry } from "@/types/platform";

interface AdminDashboardProps {
  initialCaseStudies: CaseStudy[];
  initialEnquiries: EnterpriseEnquiry[];
  initialCourses: Course[];
}

export function AdminDashboard({ initialCaseStudies, initialEnquiries, initialCourses }: AdminDashboardProps) {
  const [caseStudies, setCaseStudies] = useState(initialCaseStudies);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [newStudy, setNewStudy] = useState({ title: "", summary: "", category: "vibe_coding", breakdown_md: "", tech_stack: "" });

  async function addCaseStudy() {
    const slug = newStudy.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const res = await fetch("/api/admin/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newStudy,
        slug,
        tech_stack: newStudy.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
        breakdown_md: newStudy.breakdown_md || `# ${newStudy.title}\n\n${newStudy.summary}`,
      }),
    });
    const data = await res.json();
    if (data.caseStudy) {
      setCaseStudies((s) => [data.caseStudy, ...s]);
      setNewStudy({ title: "", summary: "", category: "vibe_coding", breakdown_md: "", tech_stack: "" });
    }
  }

  async function updateEnquiryStatus(id: string, status: string) {
    await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setEnquiries((e) => e.map((x) => x.id === id ? { ...x, status: status as EnterpriseEnquiry["status"] } : x));
  }

  async function deleteStudy(id: string) {
    await fetch("/api/admin/case-studies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setCaseStudies((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Portal</h1>
        <p className="text-slate-600">Manage courses, case studies, and enterprise leads.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Courses</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{initialCourses.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Case Studies</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{caseStudies.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Enquiries</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{enquiries.filter((e) => e.status === "pending").length} pending</p></CardContent></Card>
      </div>

      <Tabs defaultValue="case-studies">
        <TabsList>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="enquiries">Enterprise Leads</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="case-studies" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Add Case Study</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Title" value={newStudy.title} onChange={(e) => setNewStudy({ ...newStudy, title: e.target.value })} />
              <Input placeholder="Summary" value={newStudy.summary} onChange={(e) => setNewStudy({ ...newStudy, summary: e.target.value })} />
              <Input placeholder="Tech stack (comma separated)" value={newStudy.tech_stack} onChange={(e) => setNewStudy({ ...newStudy, tech_stack: e.target.value })} />
              <Select value={newStudy.category} onValueChange={(v) => v && setNewStudy({ ...newStudy, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vibe_coding">Vibe Coding</SelectItem>
                  <SelectItem value="ai_agent">AI Agent</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Breakdown (markdown)" value={newStudy.breakdown_md} onChange={(e) => setNewStudy({ ...newStudy, breakdown_md: e.target.value })} rows={4} />
              <Button onClick={addCaseStudy} disabled={!newStudy.title || !newStudy.summary}>Add Case Study</Button>
            </CardContent>
          </Card>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {caseStudies.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">{s.category}</Badge>
                  {s.title}
                </div>
                <Button size="sm" variant="ghost" onClick={() => deleteStudy(s.id)}>Delete</Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enquiries" className="mt-4 space-y-2">
          {enquiries.length === 0 ? <p className="text-slate-500 text-sm">No enquiries yet.</p> : enquiries.map((e) => (
            <Card key={e.id}>
              <CardContent className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{e.company_name} — {e.contact_name}</p>
                  <p className="text-sm text-slate-500">{e.email} · {e.service_type}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{e.project_description}</p>
                </div>
                <Select value={e.status} onValueChange={(v) => v && updateEnquiryStatus(e.id, v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="courses" className="mt-4 space-y-2">
          {initialCourses.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-slate-500">{c.slug} · {c.level}</p>
                </div>
                <Badge variant={c.published ? "default" : "secondary"}>{c.published ? "Published" : "Draft"}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

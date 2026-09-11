import { PlatformHeader } from "@/components/layout/platform-nav";
import { EnterpriseBookingForm } from "@/components/enterprise/booking-form";
import { Building2, Bot, Workflow, GraduationCap } from "lucide-react";

const services = [
  { icon: Bot, title: "Custom AI Agents", desc: "Production-ready agents with tool calling, MCP, and monitoring." },
  { icon: Workflow, title: "Workflow Automation", desc: "Automate repetitive business processes with AI-powered pipelines." },
  { icon: Building2, title: "Digital Transformation", desc: "Modernize legacy workflows with vibe coding and AI integration." },
  { icon: GraduationCap, title: "Team Training", desc: "Upskill your team on Cursor, AI agents, and UAT-driven development." },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">
      <PlatformHeader />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 mb-4">
              <Building2 className="h-4 w-4" /> Enterprise AI Solutions
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              AI transformation for your business
            </h1>
            <p className="text-slate-600 mt-4 leading-relaxed">
              From custom AI agents to full digital transformation — we help enterprises adopt vibe coding and AI workflows at scale.
            </p>
            <div className="mt-8 space-y-4">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-sm text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <EnterpriseBookingForm />
        </div>
      </div>
    </div>
  );
}

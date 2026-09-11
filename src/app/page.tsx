import Link from "next/link";
import { PlatformHeader } from "@/components/layout/platform-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  GraduationCap,
  Building2,
  Lightbulb,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  Plug,
} from "lucide-react";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getPlatformCounts } from "@/lib/db/platform-store";

const pillars = [
  {
    icon: GraduationCap,
    title: "Academy",
    subtitle: "Courses & Certifications",
    description: "Vibe Coding and AI Agent courses from zero to hero — with quizzes and verified certificates.",
    href: "/courses",
    cta: "Start learning",
    color: "bg-blue-50 border-blue-200",
  },
  {
    icon: Building2,
    title: "Enterprise",
    subtitle: "AI Consulting & Booking",
    description: "Custom AI agents, workflow automation, and digital transformation for your business.",
    href: "/enterprise",
    cta: "Book consultation",
    color: "bg-slate-50 border-slate-200",
  },
  {
    icon: Lightbulb,
    title: "Inspiration Vault",
    subtitle: "50+ Case Studies",
    description: "Real vibe coding startups and AI agent solutions with architecture breakdowns.",
    href: "/inspiration",
    cta: "Browse cases",
    color: "bg-amber-50 border-amber-200",
  },
  {
    icon: LayoutDashboard,
    title: "AI Project Hub",
    subtitle: "Planner + Cursor MCP",
    description: "Plan projects, track UAT, generate master prompts, and sync progress with Cursor IDE.",
    href: "/dashboard",
    cta: "Open project hub",
    color: "bg-green-50 border-green-200",
  },
];

export default async function LandingPage() {
  await ensurePlatformSeeded();
  const counts = await getPlatformCounts();

  return (
    <div className="min-h-screen bg-white">
      <PlatformHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 mb-6">
            <Sparkles className="h-4 w-4" />
            All-in-one Vibe Coding & AI Agent Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
            Learn. Build. Ship.{" "}
            <span className="text-slate-500">With AI.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Tenth Project combines AI-powered project planning, interactive courses,
            enterprise consulting, and 50+ case studies — plus a Cursor MCP integration
            that syncs your UAT progress automatically.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get started free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Academy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-4">Four pillars. One platform.</h2>
          <p className="text-center text-slate-600 mb-12 max-w-xl mx-auto">
            Everything you need to go from idea to production — whether you&apos;re learning, building, or scaling.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className={`${p.color} hover:shadow-md transition-shadow`}>
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border mb-3">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <CardDescription className="font-medium text-slate-700">{p.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">{p.description}</p>
                    <Link href={p.href}>
                      <Button variant="outline" size="sm">{p.cta} <ArrowRight className="h-3 w-3 ml-1" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold">{counts.courses}</p>
              <p className="text-sm text-slate-500 mt-1">Courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{counts.caseStudies}+</p>
              <p className="text-sm text-slate-500 mt-1">Case Studies</p>
            </div>
            <div>
              <p className="text-3xl font-bold flex items-center justify-center gap-1">
                <Plug className="h-6 w-6" /> MCP
              </p>
              <p className="text-sm text-slate-500 mt-1">Cursor Integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to build with AI?</h2>
          <p className="text-slate-400 mb-8">Join creators who ship faster with structured AI development.</p>
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-slate-400 mb-8">
            {["Free to start", "Cursor MCP sync", "Verified certificates", "50+ case studies"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> {item}
              </span>
            ))}
          </div>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Start your journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Tenth Project</span>
          <div className="flex gap-4">
            <Link href="/courses" className="hover:text-slate-900">Academy</Link>
            <Link href="/inspiration" className="hover:text-slate-900">Inspiration</Link>
            <Link href="/enterprise" className="hover:text-slate-900">Enterprise</Link>
            <Link href="/dashboard" className="hover:text-slate-900">Project Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

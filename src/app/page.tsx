import Link from "next/link";
import { MarketingShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Building2,
  Lightbulb,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Briefcase,
  PenLine,
  ListChecks,
  FileOutput,
} from "lucide-react";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getDict } from "@/lib/i18n/server";

export default async function LandingPage() {
  await ensurePlatformSeeded();
  const dict = await getDict();

  const pillars = [
    { icon: GraduationCap, ...dict.pillars.academy, href: "/courses" },
    { icon: Building2, ...dict.pillars.enterprise, href: "/enterprise" },
    { icon: Lightbulb, ...dict.pillars.inspiration, href: "/inspiration" },
    { icon: LayoutDashboard, ...dict.pillars.hub, href: "/mcp" },
  ];

  const metrics = [
    { n: dict.metrics.m1n, l: dict.metrics.m1 },
    { n: dict.metrics.m2n, l: dict.metrics.m2 },
    { n: dict.metrics.m3n, l: dict.metrics.m3 },
  ];

  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.07),_transparent_58%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-700 mb-6 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              {dict.hero.badge}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-[3.15rem] font-semibold tracking-tight text-slate-900 leading-[1.2]">
              {dict.hero.title}
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">{dict.hero.subtitle}</p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Cursor · Claude · ChatGPT · Gemini · Lovable
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/enterprise">
                <Button size="lg" className="w-full sm:w-auto h-11 px-6 font-semibold">
                  {dict.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 px-6 font-semibold">
                  {dict.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-center">
          {metrics.map((m) => (
            <div key={m.l}>
              <p className="text-3xl font-semibold tracking-tight text-slate-900">{m.n}</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-[#f7f7f5]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">{dict.founders.title}</h2>
          <p className="text-center text-slate-600 mt-3 mb-12 max-w-2xl mx-auto">{dict.founders.subtitle}</p>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { name: dict.founders.felixName, role: dict.founders.felixRole, body: dict.founders.felix, icon: Sparkles },
              { name: dict.founders.chrisName, role: dict.founders.chrisRole, body: dict.founders.chris, icon: Briefcase },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <article
                  key={p.name}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-md hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{p.role}</p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900">{p.name}</h3>
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-slate-600 leading-relaxed">{p.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">{dict.pillarsTitle}</h2>
          <p className="text-center text-slate-600 mt-3 mb-12 max-w-xl mx-auto">{dict.pillarsSubtitle}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <Link key={p.title} href={p.href} className="group">
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 mb-5 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{p.subtitle}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{p.title}</h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                    <span className="mt-5 inline-flex items-center text-sm font-semibold text-slate-900">
                      {p.cta} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f7f7f5] border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">{dict.preview.title}</h2>
          <p className="text-center text-slate-600 mt-3 mb-12 max-w-2xl mx-auto">{dict.preview.subtitle}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: PenLine, t: dict.preview.s1, n: "01" },
              { icon: ListChecks, t: dict.preview.s2, n: "02" },
              { icon: FileOutput, t: dict.preview.s3, n: "03" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.n} className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400">{s.n}</p>
                  <Icon className="h-5 w-5 text-slate-800 mt-4" />
                  <p className="mt-3 font-semibold text-slate-900">{s.t}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-slate-300 text-sm font-mono leading-relaxed shadow-sm">
            <p className="text-slate-500 text-xs mb-2">master-prompt.md</p>
            <p className="text-slate-200"># Product vision</p>
            <p>Build a focused MVP. Stack: Next.js, Supabase, Cursor. Sprint: auth + core loop. Acceptance: user can complete the happy path without errors.</p>
          </div>
          <div className="mt-8 text-center">
            <Link href="/login?redirect=/projects/new">
              <Button size="lg" variant="outline" className="h-11 px-6 font-semibold">
                {dict.preview.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">{dict.ctaBand.title}</h2>
          <p className="text-slate-400 mb-8">{dict.ctaBand.subtitle}</p>
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-slate-400 mb-8">
            {dict.ctaBand.items.map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {item}
              </span>
            ))}
          </div>
          <Link href="/enterprise">
            <Button size="lg" variant="secondary" className="h-11 px-6 font-semibold">
              {dict.ctaBand.button} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

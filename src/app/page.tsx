import Link from "next/link";
import { MarketingShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
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
import { getDict } from "@/lib/i18n/server";

export default async function LandingPage() {
  await ensurePlatformSeeded();
  const counts = await getPlatformCounts();
  const dict = await getDict();

  const pillars = [
    {
      icon: GraduationCap,
      ...dict.pillars.academy,
      href: "/courses",
      color: "bg-blue-50/80 border-blue-100",
    },
    {
      icon: Building2,
      ...dict.pillars.enterprise,
      href: "/enterprise",
      color: "bg-slate-50 border-slate-200",
    },
    {
      icon: Lightbulb,
      ...dict.pillars.inspiration,
      href: "/inspiration",
      color: "bg-amber-50/80 border-amber-100",
    },
    {
      icon: LayoutDashboard,
      ...dict.pillars.hub,
      href: "/dashboard",
      color: "bg-emerald-50/80 border-emerald-100",
    },
  ];

  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.06),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 mb-6 shadow-sm">
              {dict.hero.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 leading-[1.15]">
              {dict.hero.title}
              <span className="block text-slate-500 mt-2">{dict.hero.titleAccent}</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">{dict.hero.subtitle}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
              Cursor · Claude · ChatGPT · Gemini · Lovable
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto h-11 px-6">
                  {dict.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 px-6">
                  {dict.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center tracking-tight">{dict.howItWorks.title}</h2>
          <p className="text-center text-slate-600 mt-3 mb-12 max-w-xl mx-auto">{dict.howItWorks.subtitle}</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: dict.howItWorks.s1t, d: dict.howItWorks.s1d },
              { n: "02", t: dict.howItWorks.s2t, d: dict.howItWorks.s2d },
              { n: "03", t: dict.howItWorks.s3t, d: dict.howItWorks.s3d },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-slate-200 p-6 bg-[#f7f7f5]">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">{s.n}</p>
                <h3 className="mt-3 font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-[#f7f7f5] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center tracking-tight">{dict.pillarsTitle}</h2>
          <p className="text-center text-slate-600 mt-3 mb-12 max-w-xl mx-auto">{dict.pillarsSubtitle}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className={`${p.color} shadow-none hover:shadow-md transition-shadow`}>
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 mb-3">
                      <Icon className="h-5 w-5 text-slate-800" />
                    </div>
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <CardDescription className="font-medium text-slate-700">{p.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-5 leading-relaxed">{p.desc}</p>
                    <Link href={p.href}>
                      <Button variant="outline" size="sm">
                        {p.cta} <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold tracking-tight">{counts.courses}</p>
              <p className="text-sm text-slate-500 mt-1">{dict.stats.courses}</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{counts.caseStudies}+</p>
              <p className="text-sm text-slate-500 mt-1">{dict.stats.cases}</p>
            </div>
            <div>
              <p className="text-3xl font-bold flex items-center justify-center gap-1.5">
                <Plug className="h-6 w-6" /> MCP
              </p>
              <p className="text-sm text-slate-500 mt-1">{dict.stats.mcp}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{dict.ctaBand.title}</h2>
          <p className="text-slate-400 mb-8">{dict.ctaBand.subtitle}</p>
          <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-slate-400 mb-8">
            {dict.ctaBand.items.map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {item}
              </span>
            ))}
          </div>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              {dict.ctaBand.button} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

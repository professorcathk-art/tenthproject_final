"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Plug,
  HeartHandshake,
  Building2,
  Rocket,
  PenLine,
  ListChecks,
  FileOutput,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { Hero } from "@/components/marketing/hero";
import { useI18n } from "@/components/i18n/provider";
import { useState } from "react";

export function LandingView() {
  const { dict } = useI18n();
  const [tab, setTab] = useState<"wizard" | "prompt" | "mcp">("wizard");

  const vision = [
    { icon: HeartHandshake, ...dict.vision.items.tech },
    { icon: Building2, ...dict.vision.items.enterprise },
    { icon: Rocket, ...dict.vision.items.creator },
  ];

  const membership = [
    { icon: GraduationCap, ...dict.membership.items.course, wide: true },
    { icon: Lightbulb, ...dict.membership.items.cases, wide: false },
    { icon: Plug, ...dict.membership.items.tools, wide: false },
    { icon: Sparkles, ...dict.membership.items.vip, wide: true },
  ];

  const previewTabs = [
    { id: "wizard" as const, icon: PenLine, ...dict.preview.tabs.wizard },
    { id: "prompt" as const, icon: FileOutput, ...dict.preview.tabs.prompt },
    { id: "mcp" as const, icon: ListChecks, ...dict.preview.tabs.mcp },
  ];

  return (
    <>
      <Hero />

      <section id="about" className="scroll-mt-20 py-20 border-t border-slate-200/70 dark:border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-semibold text-center tracking-[-0.03em]">{dict.vision.title}</h2>
            <p className="text-center text-slate-500 mt-3 mb-12 max-w-2xl mx-auto">{dict.vision.subtitle}</p>
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-3">
            {vision.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.title} delay={i * 0.08}>
                  <article className="h-full rounded-2xl glass-panel glow-card p-8">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white mb-5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section id="team" className="scroll-mt-20 py-20 bg-[#f7f7f5] dark:bg-transparent">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-semibold text-center tracking-[-0.03em]">{dict.founders.title}</h2>
            <p className="text-center text-slate-500 mt-3 mb-12 max-w-2xl mx-auto">{dict.founders.subtitle}</p>
          </FadeIn>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                name: dict.founders.felixName,
                role: dict.founders.felixRole,
                body: dict.founders.felix,
                icon: Sparkles,
                badges: ["Alibaba", "Tencent", "AI Agents"],
              },
              {
                name: dict.founders.chrisName,
                role: dict.founders.chrisRole,
                body: dict.founders.chris,
                icon: Briefcase,
                badges: ["Imperial", "Goldman", "J.P. Morgan", "UBS"],
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <FadeIn key={p.name} delay={i * 0.08}>
                  <article className="h-full rounded-2xl glass-panel glow-card p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{p.role}</p>
                        <h3 className="mt-1 text-xl font-semibold">{p.name}</h3>
                      </div>
                    </div>
                    <p className="mt-5 text-sm text-slate-600 leading-relaxed">{p.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.badges.map((b) => (
                        <span key={b} className="rounded-full border border-slate-200/80 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-800/60">
                          {b}
                        </span>
                      ))}
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section id="membership" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-semibold text-center tracking-[-0.03em]">{dict.membership.title}</h2>
            <p className="text-center text-slate-500 mt-3 mb-12 max-w-2xl mx-auto">{dict.membership.subtitle}</p>
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-2">
            {membership.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.title} delay={i * 0.06} className={item.wide ? "md:col-span-2" : ""}>
                  <article className={`h-full rounded-2xl glass-panel glow-card p-8 ${item.wide ? "md:flex md:items-start md:gap-6" : ""}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white mb-5 md:mb-0 dark:bg-slate-900">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/courses"
              className="inline-flex h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              {dict.nav.academy}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f7f7f5] border-t border-slate-200 dark:bg-transparent dark:border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-semibold text-center tracking-[-0.03em]">{dict.preview.title}</h2>
            <p className="text-center text-slate-500 mt-3 mb-10 max-w-2xl mx-auto">{dict.preview.subtitle}</p>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {previewTabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.title}
                </button>
              );
            })}
          </div>
          <FadeIn>
            <div className="rounded-2xl glass-panel p-8 min-h-[180px]">
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                {previewTabs.find((t) => t.id === tab)?.body}
              </p>
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-900 p-5 text-slate-300 text-sm font-mono leading-relaxed">
                {tab === "wizard" && (
                  <>
                    <p className="text-slate-500 text-xs mb-2">01 → 02 → 03</p>
                    <p className="text-slate-200">{dict.preview.s1} · {dict.preview.s2} · {dict.preview.s3}</p>
                  </>
                )}
                {tab === "prompt" && (
                  <>
                    <p className="text-slate-500 text-xs mb-2">master-prompt.md</p>
                    <p className="text-slate-200"># Product vision</p>
                    <p>Build a focused MVP. Stack: Next.js, Supabase, Cursor. Acceptance: user completes the happy path.</p>
                  </>
                )}
                {tab === "mcp" && (
                  <>
                    <p className="text-slate-500 text-xs mb-2">.cursor/mcp.json</p>
                    <p className="text-slate-200">{`{ "mcpServers": { "tenth-project": { "url": "/api/mcp" } } }`}</p>
                  </>
                )}
              </div>
            </div>
          </FadeIn>
          <div className="mt-8 text-center">
            <Link href="/login?redirect=/projects/new">
              <Button size="lg" variant="outline" className="h-11 px-6 rounded-full font-semibold">
                {dict.preview.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-slate-900 py-16 dark:bg-slate-950">
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
            <Button size="lg" variant="secondary" className="h-11 px-6 rounded-full font-semibold">
              {dict.ctaBand.button} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

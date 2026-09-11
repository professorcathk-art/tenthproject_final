"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex rounded-full p-[1px] badge-shine mb-6 shadow-[0_0_24px_rgba(59,130,246,0.25)]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-slate-700 backdrop-blur-md dark:bg-slate-950/80 dark:text-slate-200">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                {dict.hero.badge}
              </div>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl lg:text-[3.15rem] font-semibold tracking-tight leading-[1.2] text-gradient"
            >
              {dict.hero.title}
            </motion.h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">{dict.hero.subtitle}</p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Cursor · Claude · ChatGPT · Gemini · MCP
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/enterprise">
                <Button size="lg" className="w-full sm:w-auto h-11 px-6 font-semibold shadow-[0_0_28px_rgba(59,130,246,0.35)]">
                  {dict.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 px-6 font-semibold glass-panel">
                  {dict.hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-slate-200/70 dark:border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">{dict.vision.title}</h2>
            <p className="text-center text-slate-600 mt-3 mb-12 max-w-2xl mx-auto">{dict.vision.subtitle}</p>
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

      <section className="py-20 bg-[#f7f7f5] dark:bg-transparent">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">{dict.founders.title}</h2>
            <p className="text-center text-slate-600 mt-3 mb-12 max-w-2xl mx-auto">{dict.founders.subtitle}</p>
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

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">{dict.membership.title}</h2>
            <p className="text-center text-slate-600 mt-3 mb-12 max-w-2xl mx-auto">{dict.membership.subtitle}</p>
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
        </div>
      </section>

      <section className="py-20 bg-[#f7f7f5] border-t border-slate-200 dark:bg-transparent dark:border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">{dict.preview.title}</h2>
            <p className="text-center text-slate-600 mt-3 mb-10 max-w-2xl mx-auto">{dict.preview.subtitle}</p>
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
                      ? "border-slate-900 bg-slate-900 text-white shadow-[0_0_20px_rgba(59,130,246,0.28)]"
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
              <Button size="lg" variant="outline" className="h-11 px-6 font-semibold">
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
            <Button size="lg" variant="secondary" className="h-11 px-6 font-semibold">
              {dict.ctaBand.button} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { dict, locale } = useI18n();
  const tools = ["Cursor", "Claude", "ChatGPT", "Gemini", "MCP"];

  return (
    <section className="hero-canvas relative overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent dark:via-slate-700/70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-10 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-2xl">
            <motion.p
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.45, ease }}
              className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/60 px-3 py-1 text-[13px] font-medium text-slate-500 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40"
            >
              {dict.hero.badge}
            </motion.p>

            <motion.h1
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
              className="mt-6 text-[2.35rem] font-semibold tracking-[-0.045em] leading-[1.05] text-slate-950 sm:text-6xl lg:text-[4.25rem] dark:text-white"
            >
              {dict.hero.title}
              <span className="mt-3 block text-[1.2rem] font-medium tracking-[-0.03em] leading-snug text-slate-400 sm:text-[1.7rem] lg:text-[1.85rem] dark:text-slate-500">
                {dict.hero.titleAccent}
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease }}
              className="mt-6 max-w-lg text-[17px] leading-relaxed text-slate-500 dark:text-slate-400"
            >
              {dict.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.55, delay: 0.14, ease }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/enterprise"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {dict.hero.ctaPrimary}
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white/70 px-6 text-sm font-semibold text-slate-800 backdrop-blur-sm transition-colors hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-transparent dark:text-slate-200"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </motion.div>

            <p className="mt-10 text-[13px] tracking-tight text-slate-400">
              {tools.join("  ·  ")}
            </p>
          </div>

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="relative"
          >
            <HeroPreview locale={locale} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroPreview({ locale }: { locale: "zh" | "en" }) {
  const zh = locale === "zh";
  const steps = zh
    ? [
        { n: "01", t: "描述產品意圖", d: "目標使用者與完成樣貌" },
        { n: "02", t: "生成路線圖與 UAT", d: "可驗收的衝刺範圍" },
        { n: "03", t: "匯出 Master Prompt", d: "可貼到 Cursor 的執行稿" },
      ]
    : [
        { n: "01", t: "Describe the intent", d: "Users and the done state" },
        { n: "02", t: "Roadmap and UAT", d: "A sprint you can accept" },
        { n: "03", t: "Export the master prompt", d: "A Cursor-ready brief" },
      ];

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-slate-200/50 via-transparent to-slate-300/20 blur-2xl dark:from-slate-800/40 dark:to-slate-900/10" />
      <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white/80 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span className="ml-2 text-[12px] font-medium text-slate-400">
            {zh ? "專案規劃 · Tenth Project" : "Project planner · Tenth Project"}
          </span>
        </div>
        <div className="grid gap-3 p-4 sm:p-5">
          {steps.map((step) => (
            <div
              key={step.n}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <span className="mt-0.5 font-mono text-[11px] text-slate-400">{step.n}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{step.t}</p>
                <p className="mt-0.5 text-[13px] text-slate-500">{step.d}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-slate-950 p-4 font-mono text-[12px] leading-relaxed text-slate-400">
            <p className="text-slate-500">master-prompt.md</p>
            <p className="mt-2 text-slate-200"># Product vision</p>
            <p className="mt-1">
              {zh
                ? "MVP：Next.js · Supabase · Cursor。驗收：使用者可走完主路徑。"
                : "MVP: Next.js · Supabase · Cursor. Acceptance: user completes the happy path."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

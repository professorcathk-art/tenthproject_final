"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";
import { BrowserMockup } from "@/components/ui/browser-mockup";

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
            <HeroStudio locale={locale} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroStudio({ locale }: { locale: "zh" | "en" }) {
  return (
    <div className="relative">
      <div className="absolute -inset-5 rounded-[2rem] bg-slate-400/15 blur-3xl dark:bg-slate-800/40" />
      <BrowserMockup url="studio.tenthproject.com">
        <div className="relative aspect-[4/3] bg-slate-950">
          <Image
            src="/images/vibe-coding-creator.jpg"
            alt={
              locale === "zh"
                ? "創作者在 Tenth Project 工作區以 Cursor 開發產品"
                : "A creator building a product in the Tenth Project studio"
            }
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 92vw"
            className="object-cover object-[center_35%] brightness-[0.78] contrast-[1.02] saturate-[0.8]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/15" />
        </div>
      </BrowserMockup>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { dict } = useI18n();
  const tools = ["Cursor", "Claude", "ChatGPT", "Gemini", "MCP"];

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="hero-video absolute inset-x-0 top-0 h-[124%] w-full object-cover object-[center_12%]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/vibe-coding-creator.jpg"
          aria-hidden
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/25 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fafafa] to-transparent dark:from-slate-950" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-end px-4 pb-16 pt-24 sm:items-center sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
        <div className="relative max-w-3xl">
          <div className="pointer-events-none absolute -inset-x-8 -inset-y-10 rounded-[2rem] bg-slate-950/50 blur-2xl" />
          <div className="relative">
          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease }}
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[13px] font-medium text-white/80 backdrop-blur-sm"
          >
            {dict.hero.badge}
          </motion.p>

          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="mt-6 text-[2.35rem] font-semibold tracking-[-0.045em] leading-[1.08] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[4.15rem]"
          >
            {dict.hero.title}
            <span className="mt-3 block text-[1.2rem] font-medium tracking-[-0.03em] leading-snug text-white/65 sm:text-[1.7rem] lg:text-[1.85rem]">
              {dict.hero.titleAccent}
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease }}
            className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/72"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.14, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/enterprise"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#ffffff] px-6 text-sm font-semibold text-[#0b1220] transition-colors hover:bg-white/90"
            >
              {dict.hero.ctaPrimary}
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/15"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </motion.div>

          <p className="mt-10 text-[13px] tracking-tight text-white/50">
            {tools.join("  ·  ")}
          </p>
          </div>
        </div>
      </div>
    </section>
  );
}

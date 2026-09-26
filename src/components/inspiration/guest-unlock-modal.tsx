"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FREE_TIER_BENEFITS = {
  zh: [
    {
      title: "50+ 爆款案例解鎖",
      body: "免費查看所有 Vibe Coding 與 AI Agent 創業案例的基礎拆解與架構圖。",
    },
    {
      title: "1 個 AI 專案規劃",
      body: "免費使用三步導引生成專屬 Master Prompt，貼入 Cursor 直接開發。",
    },
    {
      title: "Cursor MCP 體驗",
      body: "免費產生 API 密鑰，體驗 Cursor 本地端與專案中心自動化同步。",
    },
    {
      title: "每週技術與趨勢文案",
      body: "免費訂閱最新 AI 工具鏈評測與海外增長案例分析。",
    },
  ],
  en: [
    {
      title: "Unlock 50+ breakout case studies",
      body: "Read the basic breakdown and architecture diagram of every Vibe Coding and AI agent startup case, free.",
    },
    {
      title: "1 AI project plan",
      body: "Use the three-step guide free to generate your own master prompt, then paste it into Cursor and start building.",
    },
    {
      title: "Try Cursor MCP",
      body: "Create an API key free and try local Cursor syncing with the project hub.",
    },
    {
      title: "Weekly technical and trend notes",
      body: "Subscribe free to the latest AI toolchain reviews and overseas growth case studies.",
    },
  ],
} as const;

export function GuestUnlockModal({ title, slug }: { title: string; slug: string }) {
  const { locale } = useI18n();
  const en = locale === "en";
  const benefits = FREE_TIER_BENEFITS[en ? "en" : "zh"];
  const [open, setOpen] = useState(true);
  const redirectTo = `/inspiration/${slug}`;
  const signupHref = `/signup?redirect=${encodeURIComponent(redirectTo)}`;
  const loginHref = `/login?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 p-5 sm:max-w-lg sm:p-6">
        <DialogHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            {en ? "🎁 100% free to unlock" : "🎁 100% 完全免費解鎖"}
          </div>
          <DialogTitle className="text-lg leading-snug font-semibold sm:text-xl">
            {en ? `Unlock the full breakdown of ${title}` : `解鎖《${title}》完整案例拆解`}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {en
              ? "Create a free account and read this product’s demand insight, tech choices, system diagram, and how it makes money."
              : "建立免費帳號，立即查看該產品的需求洞察、技術選型、系統架構圖與變現邏輯。"}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          {benefits.map((item) => (
            <div key={item.title} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                {en ? ": " : "："}
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <Link
          href={signupHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_0_24px_rgba(16,185,129,0.55)] hover:bg-slate-800 dark:bg-white dark:text-slate-950"
        >
          {en ? "🚀 Sign up free in 10 seconds and unlock ➔" : "🚀 10 秒免費註冊，立即解鎖 ➔"}
        </Link>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          {en ? "🔒 100% free · No credit card · Open in about a minute" : "🔒 100% 完全免費 · 無須綁定信用卡 · 1 分鐘快速開通"}
        </p>

        <p className="mt-4 text-center text-sm text-slate-500">
          {en ? "Already have an account?" : "已有帳號？"}{" "}
          <Link href={loginHref} className="font-semibold text-slate-900 underline underline-offset-2 dark:text-white">
            {en ? "Sign in" : "立即登入"}
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}

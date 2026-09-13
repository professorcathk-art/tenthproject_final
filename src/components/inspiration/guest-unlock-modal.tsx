"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FREE_TIER_BENEFITS = [
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
] as const;

export function GuestUnlockModal({ title, slug }: { title: string; slug: string }) {
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
            🎁 100% 完全免費解鎖
          </div>
          <DialogTitle className="text-lg leading-snug font-semibold sm:text-xl">
            解鎖《{title}》完整案例拆解
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            建立免費帳號，立即查看該產品的需求洞察、技術選型、系統架構圖與變現邏輯。
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          {FREE_TIER_BENEFITS.map((item) => (
            <div key={item.title} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                ：{item.body}
              </p>
            </div>
          ))}
        </div>

        <Link
          href={signupHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_0_24px_rgba(16,185,129,0.55)] hover:bg-slate-800 dark:bg-white dark:text-slate-950"
        >
          🚀 10 秒免費註冊，立即解鎖 ➔
        </Link>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          🔒 100% 完全免費 · 無須綁定信用卡 · 1 分鐘快速開通
        </p>

        <p className="mt-4 text-center text-sm text-slate-500">
          已有帳號？{" "}
          <Link href={loginHref} className="font-semibold text-slate-900 underline underline-offset-2 dark:text-white">
            立即登入
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}

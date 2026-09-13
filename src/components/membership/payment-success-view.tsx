"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { PUBLIC_CONTACT_EMAIL, SKOOL_URL, WHATSAPP_URL } from "@/lib/contact";

export function PaymentSuccessView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">(sessionId ? "loading" : "error");

  useEffect(() => {
    void confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    async function verify() {
      const res = await fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId!)}`);
      if (cancelled) return;
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("ok");
    }

    verify().catch(() => {
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="space-y-6">
        {status === "loading" ? (
          <p className="rounded-3xl glass-panel px-6 py-10 text-center text-slate-600 dark:text-slate-300">
            正在確認付款並為你登入…
          </p>
        ) : null}
        {status === "error" ? (
          <p className="rounded-3xl glass-panel px-6 py-10 text-center text-red-600">
            未能確認付款。若你已付款，請聯絡我們。
          </p>
        ) : null}
        {status === "ok" ? (
          <>
            <header className="rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-50/50 px-6 py-10 text-center dark:border-emerald-500/30 dark:bg-slate-900/50 sm:px-10">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                🎉 歡迎加入 Tenth Project VIP 大家庭！
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                恭喜您成功開通 VIP 終身會員，我們已收到您的付款，即將開啟您的 Vibe Coding 與 AI Agent 學習之旅。
              </p>
            </header>

            <section className="rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-50/50 p-6 text-left dark:border-emerald-500/30 dark:bg-slate-900/50 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">📌 Skool 平台權限開通說明</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                <li>導師團隊將於 24 小時內發送 Skool VIP 獨家教室與社群邀請函至您的電子郵箱。</li>
                <li>請密切留意您的郵件箱（包含垃圾郵件箱 Spam Folder），點擊邀請連結並完成 Skool 帳號註冊。</li>
                <li>完成註冊後，即可透過 Skool 網頁版 或 Skool 手機 App 隨時觀看所有課程、直播錄影與社群討論。</li>
              </ol>
            </section>

            <section className="rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-50/50 p-6 dark:border-emerald-500/30 dark:bg-slate-900/50 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={SKOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  📚 進入 Skool 獨家教室
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-emerald-500/30 bg-white/80 px-5 text-sm font-semibold text-slate-900 hover:bg-white dark:bg-slate-950/60 dark:text-white dark:hover:bg-slate-900"
                >
                  💬 WhatsApp 聯絡導師 (chris.lau)
                </a>
              </div>
            </section>

            <section className="rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-50/50 p-6 text-left dark:border-emerald-500/30 dark:bg-slate-900/50 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">💡 有任何問題？導師團隊隨時協助您</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                <li>• WhatsApp：+852 9690 3338</li>
                <li>
                  • Email：<a href={`mailto:${PUBLIC_CONTACT_EMAIL}`} className="underline-offset-4 hover:underline">{PUBLIC_CONTACT_EMAIL}</a>
                </li>
              </ul>
            </section>

            <div className="pt-2 text-center">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-8 text-sm font-semibold text-white hover:bg-slate-800"
              >
                進入會員學習與專案中心 ➔
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

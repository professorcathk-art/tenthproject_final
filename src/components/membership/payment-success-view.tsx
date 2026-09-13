"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { VipSkoolWelcome } from "@/components/membership/vip-skool-welcome";

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
        {status === "ok" ? <VipSkoolWelcome showHubLink /> : null}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Calendar, MessageCircle, Users } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";
import { MENTOR_BOOKING_URL, SKOOL_URL, WHATSAPP_VIP_URL } from "@/lib/contact";

export function PaymentSuccessView() {
  const { dict } = useI18n();
  const copy = dict.joinLifetime;
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">(sessionId ? "loading" : "error");

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
      void confetti({ particleCount: 140, spread: 80, origin: { y: 0.65 } });
    }

    verify().catch(() => {
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const cards = [
    { href: SKOOL_URL, title: copy.cardSkool, icon: Users },
    { href: WHATSAPP_VIP_URL, title: copy.cardWhatsapp, icon: MessageCircle },
    { href: MENTOR_BOOKING_URL, title: copy.cardBooking, icon: Calendar },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl glass-panel px-6 py-12 text-center sm:px-10">
        {status === "loading" ? (
          <p className="text-slate-600 dark:text-slate-300">{copy.verifying}</p>
        ) : null}
        {status === "error" ? (
          <p className="text-red-600">{copy.verifyError}</p>
        ) : null}
        {status === "ok" ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">{copy.successTitle}</h1>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;
                const external = card.href.startsWith("http");
                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-left hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    <p className="mt-3 text-sm font-semibold leading-relaxed">{card.title}</p>
                  </a>
                );
              })}
            </div>
            <Link
              href="/dashboard"
              className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {copy.enterPortal}
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}

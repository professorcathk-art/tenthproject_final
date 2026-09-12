"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

export function JoinNowButton({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { dict } = useI18n();

  return (
    <Link
      href="/signup?redirect=/dashboard"
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold",
        variant === "dark"
          ? "bg-white text-slate-950 hover:bg-white/90"
          : "bg-slate-950 text-white hover:bg-slate-800",
      )}
    >
      {dict.nav.joinNow}
    </Link>
  );
}

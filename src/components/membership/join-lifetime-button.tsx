"use client";

import Link from "next/link";
import { useJoinLifetime } from "@/components/membership/join-lifetime-provider";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

function lifetimeClass(variant: "primary" | "dark" | "outline", className: string) {
  return cn(
    "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold",
    variant === "primary" &&
      "bg-slate-950 text-white hover:bg-slate-800 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200",
    variant === "dark" &&
      "bg-white text-slate-950 hover:bg-amber-100 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200",
    variant === "outline" &&
      "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:bg-amber-300 dark:text-slate-950",
    className,
  );
}

export function JoinLifetimeButton({
  className = "",
  variant = "primary",
  children,
}: {
  className?: string;
  variant?: "primary" | "dark" | "outline";
  children?: React.ReactNode;
}) {
  const { openJoinLifetime } = useJoinLifetime();
  const { dict } = useI18n();

  return (
    <button type="button" onClick={openJoinLifetime} className={lifetimeClass(variant, className)}>
      {children ?? dict.courses.enroll}
    </button>
  );
}

/** Opens the Lifetime plan page so the member can read the syllabus before checkout. */
export function LifetimePlanLink({
  className = "",
  variant = "primary",
  children,
}: {
  className?: string;
  variant?: "primary" | "dark" | "outline";
  children: React.ReactNode;
}) {
  return (
    <Link href="/learning" className={lifetimeClass(variant, className)}>
      {children}
    </Link>
  );
}

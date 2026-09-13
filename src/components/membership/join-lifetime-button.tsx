"use client";

import { useJoinLifetime } from "@/components/membership/join-lifetime-provider";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

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
    <button
      type="button"
      onClick={openJoinLifetime}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold",
        variant === "primary" &&
          "bg-slate-950 text-white hover:bg-slate-800 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200",
        variant === "dark" &&
          "bg-white text-slate-950 hover:bg-amber-100 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200",
        variant === "outline" &&
          "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:bg-amber-300 dark:text-slate-950",
        className,
      )}
    >
      {children ?? dict.courses.enroll}
    </button>
  );
}

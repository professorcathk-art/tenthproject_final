"use client";

import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/dictionaries";

export function LanguageToggle({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "inverse";
}) {
  const { locale, setLocale, dict } = useI18n();

  const options: { id: Locale; label: string }[] = [
    { id: "zh", label: dict.lang.zh },
    { id: "en", label: dict.lang.en },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-xs font-medium backdrop-blur-md",
        tone === "inverse"
          ? "border-white/20 bg-white/10"
          : "border-slate-200/80 bg-white/70 dark:border-slate-800/60 dark:bg-slate-950/40",
        className
      )}
      role="group"
      aria-label={locale === "zh" ? "語言" : "Language"}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setLocale(opt.id)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            tone === "inverse"
              ? locale === opt.id
                ? "bg-white text-slate-950 shadow-sm"
                : "text-white/70 hover:text-white"
              : locale === opt.id
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

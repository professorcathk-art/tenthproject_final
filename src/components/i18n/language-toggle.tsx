"use client";

import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/dictionaries";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, dict } = useI18n();

  const options: { id: Locale; label: string }[] = [
    { id: "zh", label: dict.lang.zh },
    { id: "en", label: dict.lang.en },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium",
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
            locale === opt.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

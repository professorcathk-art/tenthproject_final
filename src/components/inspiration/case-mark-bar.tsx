"use client";

import { EyeOff, Heart } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";
import { useCaseMarks } from "@/components/inspiration/use-case-marks";
import type { CaseMarkStatus } from "@/types/platform";

export function CaseMarkBar({
  slug,
  initialStatus,
}: {
  slug: string;
  initialStatus?: CaseMarkStatus | null;
}) {
  const { dict } = useI18n();
  const initial = initialStatus ? { [slug]: initialStatus } : {};
  const { marks, toggle, pendingSlug } = useCaseMarks(initial);
  const status = marks[slug] ?? null;
  const busy = pendingSlug === slug;

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-950/40">
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{dict.inspiration.markHint}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          aria-pressed={status === "saved"}
          onClick={() => toggle(slug, "saved")}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            status === "saved"
              ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          }`}
        >
          <Heart className={`h-4 w-4 ${status === "saved" ? "fill-rose-500 text-rose-500" : ""}`} />
          {status === "saved" ? dict.inspiration.saved : dict.inspiration.save}
        </button>
        <button
          type="button"
          disabled={busy}
          aria-pressed={status === "passed"}
          onClick={() => toggle(slug, "passed")}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
            status === "passed"
              ? "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          }`}
        >
          <EyeOff className="h-4 w-4" />
          {dict.inspiration.notInterested}
        </button>
      </div>
    </section>
  );
}

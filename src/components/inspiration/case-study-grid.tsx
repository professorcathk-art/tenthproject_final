"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { CaseStudy, CaseStudyCategory } from "@/types/platform";
import { CASE_CATEGORIES, caseCategories } from "@/types/platform";
import { useI18n } from "@/components/i18n/provider";

const FILTERS = ["all", ...CASE_CATEGORIES.map((c) => c.value)] as const;

export function CaseStudyGrid({ studies }: { studies: CaseStudy[] }) {
  const { dict } = useI18n();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const filtered =
    filter === "all" ? studies : studies.filter((s) => caseCategories(s).includes(filter as CaseStudyCategory));
  const cats = dict.inspiration.cats;

  function label(key: string) {
    return cats[key as keyof typeof cats] ?? key;
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-slate-200/80 sm:mx-0 sm:px-0 sm:rounded-full sm:border sm:bg-white/70 dark:sm:bg-slate-950/40">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:justify-center">
          {FILTERS.map((value) => {
            const count =
              value === "all"
                ? studies.length
                : studies.filter((s) => caseCategories(s).includes(value as CaseStudyCategory)).length;
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300"
                }`}
              >
                {label(value)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((study) => (
          <Link key={study.id} href={`/inspiration/${study.slug}`}>
            <article className="h-full rounded-2xl glass-panel glow-card p-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {caseCategories(study).map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {label(cat)}
                  </Badge>
                ))}
              </div>
              <h2 className="text-lg font-semibold leading-snug">{study.title}</h2>
              <p className="text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed">{study.summary}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {study.tech_stack.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

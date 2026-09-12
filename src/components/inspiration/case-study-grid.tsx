"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CaseStudy, CaseStudyCategory } from "@/types/platform";
import { CASE_CATEGORIES, caseCategories } from "@/types/platform";
import { useI18n } from "@/components/i18n/provider";
import { localizedCaseText } from "@/lib/inspiration/locale-text";
import { DifficultyStars } from "@/components/inspiration/difficulty-stars";

const FILTERS = ["all", ...CASE_CATEGORIES.map((c) => c.value)] as const;

type CaseCard = Pick<CaseStudy, "id" | "title" | "slug" | "category" | "categories" | "summary" | "website_url" | "difficulty">;

export function CaseStudyGrid({ studies, basePath = "/inspiration" }: { studies: CaseCard[]; basePath?: string }) {
  const { dict, locale } = useI18n();
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
          <Link key={study.id} href={`${basePath}/${study.slug}`}>
            <article className="h-full rounded-2xl glass-panel glow-card p-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {caseCategories(study).map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {label(cat)}
                  </Badge>
                ))}
              </div>
              <h2 className="text-lg font-semibold leading-snug">{study.title}</h2>
              <div className="mt-2">
                <DifficultyStars value={study.difficulty} locale={locale} />
              </div>
              <p className="text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                {localizedCaseText(study.summary, locale)}
              </p>
              {study.website_url ? (
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                  {study.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  <ArrowUpRight className="h-3 w-3" />
                </p>
              ) : null}
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

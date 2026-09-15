"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, EyeOff, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CaseMarkStatus, CaseStudy, CaseStudyCategory } from "@/types/platform";
import { CASE_CATEGORIES, caseCategories } from "@/types/platform";
import { useI18n } from "@/components/i18n/provider";
import { localizedCaseText } from "@/lib/inspiration/locale-text";
import { DifficultyStars } from "@/components/inspiration/difficulty-stars";
import { useCaseMarks } from "@/components/inspiration/use-case-marks";
import { isPublicInspirationSlug, sortInspirationCases } from "@/lib/inspiration/public-cases";

const FILTERS = ["all", ...CASE_CATEGORIES.map((c) => c.value)] as const;
const MARK_FILTERS = ["all", "saved", "passed"] as const;

type CaseCard = Pick<CaseStudy, "id" | "title" | "slug" | "category" | "categories" | "summary" | "website_url" | "difficulty">;
type MarkFilter = (typeof MARK_FILTERS)[number];

function CaseMarkBadge({ status, savedLabel, passedLabel }: { status?: CaseMarkStatus; savedLabel: string; passedLabel: string }) {
  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
        <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
        {savedLabel}
      </span>
    );
  }
  if (status === "passed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <EyeOff className="h-3 w-3" />
        {passedLabel}
      </span>
    );
  }
  return null;
}

export function CaseStudyGrid({
  studies,
  basePath = "/inspiration",
  initialMarks,
  initialReads,
  personal = false,
}: {
  studies: CaseCard[];
  basePath?: string;
  initialMarks?: Record<string, CaseMarkStatus>;
  initialReads?: string[];
  personal?: boolean;
}) {
  const { dict, locale } = useI18n();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [markFilter, setMarkFilter] = useState<MarkFilter>("all");
  const { marks, reads, toggle, pendingSlug } = useCaseMarks(initialMarks ?? {}, initialReads ?? []);
  const cats = dict.inspiration.cats;

  function label(key: string) {
    return cats[key as keyof typeof cats] ?? key;
  }

  const categoryFiltered =
    filter === "all" ? studies : studies.filter((s) => caseCategories(s).includes(filter as CaseStudyCategory));
  const markFiltered =
    !personal || markFilter === "all"
      ? categoryFiltered
      : categoryFiltered.filter((s) => marks[s.slug] === markFilter);
  const filtered = useMemo(
    () => sortInspirationCases(markFiltered, { readSlugs: personal ? reads : [] }),
    [markFiltered, personal, reads],
  );

  const savedCount = studies.filter((s) => marks[s.slug] === "saved").length;
  const passedCount = studies.filter((s) => marks[s.slug] === "passed").length;

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

      {personal ? (
        <div className="flex gap-2 overflow-x-auto">
          {MARK_FILTERS.map((value) => {
            const count = value === "all" ? studies.length : value === "saved" ? savedCount : passedCount;
            const active = markFilter === value;
            const text =
              value === "saved"
                ? dict.inspiration.filterSaved
                : value === "passed"
                  ? dict.inspiration.filterPassed
                  : dict.inspiration.all;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMarkFilter(value)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                }`}
              >
                {text} ({count})
              </button>
            );
          })}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
          {markFilter === "saved" ? dict.inspiration.noSaved : markFilter === "passed" ? dict.inspiration.noPassed : dict.inspiration.noMatches}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((study) => {
            const status = marks[study.slug];
            const read = reads.includes(study.slug);
            const freePreview = isPublicInspirationSlug(study.slug);
            return (
              <article
                key={study.id}
                className={`relative h-full rounded-2xl glass-panel glow-card p-6 ${read ? "opacity-80" : ""}`}
              >
                {personal ? (
                  <button
                    type="button"
                    disabled={pendingSlug === study.slug}
                    aria-pressed={status === "saved"}
                    aria-label={status === "saved" ? dict.inspiration.saved : dict.inspiration.save}
                    onClick={() => toggle(study.slug, "saved")}
                    className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-500 hover:text-rose-600 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950/80"
                  >
                    <Heart className={`h-4 w-4 ${status === "saved" ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                ) : null}
                <Link href={`${basePath}/${study.slug}`} className="block pr-10">
                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    {freePreview ? (
                      <Badge variant="secondary">{dict.inspiration.freePreview}</Badge>
                    ) : null}
                    {caseCategories(study).map((cat) => (
                      <Badge key={cat} variant="secondary">
                        {label(cat)}
                      </Badge>
                    ))}
                    {personal ? (
                      <CaseMarkBadge
                        status={status}
                        savedLabel={dict.inspiration.saved}
                        passedLabel={dict.inspiration.markedPassed}
                      />
                    ) : null}
                    {personal && read ? (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {dict.inspiration.read}
                      </span>
                    ) : null}
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
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

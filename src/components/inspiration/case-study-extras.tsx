"use client";

import { useState } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/provider";
import { DifficultyStars } from "@/components/inspiration/difficulty-stars";
import { localizedClonePrompt } from "@/lib/inspiration/case-fields";
import type { CaseStudy } from "@/types/platform";

export function CaseStudyMeta({ study }: { study: Pick<CaseStudy, "difficulty" | "pitch_deck_url"> }) {
  const { dict, locale } = useI18n();

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <DifficultyStars value={study.difficulty} locale={locale} size="md" />
      {study.pitch_deck_url ? (
        <a
          href={study.pitch_deck_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:border-slate-300"
        >
          {dict.inspiration.pitchDeck}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ) : null}
    </div>
  );
}

export function CaseClonePrompt({ study }: { study: Pick<CaseStudy, "clone_prompt"> }) {
  const { dict, locale } = useI18n();
  const prompt = localizedClonePrompt(study.clone_prompt, locale);
  const [copied, setCopied] = useState(false);
  if (!prompt) return null;

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">
            {dict.inspiration.clonePrompt}
          </p>
          <p className="mt-1 text-sm text-slate-400">{dict.inspiration.clonePromptHint}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={copyPrompt}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? dict.inspiration.copiedClone : dict.inspiration.copyClone}
        </Button>
      </div>
      <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-sm leading-7 text-slate-100">{prompt}</pre>
    </section>
  );
}

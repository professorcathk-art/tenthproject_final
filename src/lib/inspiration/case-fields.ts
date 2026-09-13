import { CASE_LOCALE_SPLIT } from "@/lib/inspiration/constants";
import type { CaseStudy } from "@/types/platform";

export const DIFF_PREFIX = "diff:";
export const DECK_PREFIX = "deck:";
export const CLONE_MARKER = "<!--clone-->";

export const CASE_ENCODED_PREFIXES = ["cat:", "site:", "hl:", DIFF_PREFIX, DECK_PREFIX] as const;

export const DIFFICULTY_LABELS: Record<number, { zh: string; en: string }> = {
  1: { zh: "週末可模仿", en: "Weekend imitate" },
  2: { zh: "輕量 vibe coding", en: "Light vibe coding" },
  3: { zh: "可模仿核心迴路", en: "Imitable core loop" },
  4: { zh: "要平台／整合能力", en: "Needs platform work" },
  5: { zh: "接近自研系統", en: "Near custom system" },
};

export function clampDifficulty(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export function splitCloneBlock(markdown: string): { body: string; clone: string | null } {
  const idx = markdown.indexOf(CLONE_MARKER);
  if (idx === -1) return { body: markdown, clone: null };
  return {
    body: markdown.slice(0, idx).trimEnd(),
    clone: markdown.slice(idx + CLONE_MARKER.length).trim() || null,
  };
}

export function encodeCloneBlock(body: string, clone: string | null | undefined): string {
  const stripped = splitCloneBlock(body).body;
  if (!clone?.trim()) return stripped;
  return `${stripped}\n\n${CLONE_MARKER}\n${clone.trim()}`;
}

export function applyCaseFieldEncoding(cs: CaseStudy): CaseStudy {
  const { categories, website_url, highlights, difficulty, pitch_deck_url, clone_prompt, ...rest } = cs;
  const cleanStack = rest.tech_stack.filter(
    (t) => !CASE_ENCODED_PREFIXES.some((prefix) => t.startsWith(prefix)),
  );
  const cats = categories?.length ? categories : [cs.category];
  const allowed = cats.includes("workflow_agent") ? "ai_agent" : "vibe_coding";
  const encodedHighlights = (highlights ?? []).map((h) => `hl:${h.zh}|${h.en}|${h.value}`);
  const extras = [
    `${DIFF_PREFIX}${clampDifficulty(difficulty ?? 3)}`,
    ...(pitch_deck_url ? [`${DECK_PREFIX}${pitch_deck_url}`] : []),
  ];
  return {
    ...rest,
    category: allowed as unknown as CaseStudy["category"],
    breakdown_md: encodeCloneBlock(rest.breakdown_md, clone_prompt),
    tech_stack: [
      ...cats.map((c) => `cat:${c}`),
      ...(website_url ? [`site:${website_url}`] : []),
      ...encodedHighlights,
      ...extras,
      ...cleanStack,
    ],
  };
}

export function extractCaseFields(cs: CaseStudy): Pick<CaseStudy, "difficulty" | "pitch_deck_url" | "clone_prompt" | "breakdown_md"> {
  const stack = Array.isArray(cs.tech_stack) ? cs.tech_stack : [];
  const fromStack = Number(stack.find((t) => t.startsWith(DIFF_PREFIX))?.slice(DIFF_PREFIX.length));
  const deck = stack.find((t) => t.startsWith(DECK_PREFIX))?.slice(DECK_PREFIX.length) ?? cs.pitch_deck_url ?? null;
  const split = splitCloneBlock(cs.breakdown_md ?? "");
  return {
    difficulty: clampDifficulty(Number.isFinite(fromStack) ? fromStack : cs.difficulty),
    pitch_deck_url: deck || null,
    clone_prompt: split.clone ?? cs.clone_prompt ?? null,
    breakdown_md: split.body,
  };
}

export function localizedClonePrompt(raw: string | null | undefined, locale: string): string {
  if (!raw) return "";
  const parts = raw.split(CASE_LOCALE_SPLIT);
  const zh = (parts[0] ?? raw).trim();
  const en = (parts[1] ?? zh).trim();
  return locale === "en" ? en : zh;
}

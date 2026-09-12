import type { AiSuggestion, SuggestionCategory, TestRun } from "@/types";

export function parseHttpStatus(testRun?: TestRun | null): number | null {
  if (!testRun) return null;
  if (typeof testRun.http_status === "number") return testRun.http_status;
  const match = testRun.result_summary?.match(/HTTP\s+(\d{3})/i);
  return match ? Number(match[1]) : null;
}

export function isHealthyStatus(status: number | null) {
  return status !== null && status >= 200 && status < 400;
}

export function pendingSuggestionCount(suggestions: AiSuggestion[] = []) {
  return suggestions.filter((item) => item.status === "pending").length;
}

export function isActionableSuggestion(item: AiSuggestion) {
  return item.status === "pending" && item.approved;
}

export const CATEGORY_LABEL: Record<SuggestionCategory, { zh: string; en: string }> = {
  bug: { zh: "錯誤", en: "Bug" },
  ui_ux: { zh: "介面體驗", en: "UI / UX" },
  performance: { zh: "效能", en: "Performance" },
  feature: { zh: "功能", en: "Feature" },
};

export const SEVERITY_CLASS: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-700",
};

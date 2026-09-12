import type { AiSuggestion, AuditDimension, SuggestionCategory, TestRun } from "@/types";

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
  bug: { zh: "⚡ 效能與錯誤", en: "⚡ Performance & errors" },
  ui_ux: { zh: "🎨 UI/UX", en: "🎨 UI/UX" },
  performance: { zh: "⚡ 效能與錯誤", en: "⚡ Performance & errors" },
  feature: { zh: "🧩 功能與邏輯", en: "🧩 Feature & logic" },
  copywriting: { zh: "✍️ 文案與引導", en: "✍️ Copy & guidance" },
};

export const CATEGORY_BADGE_CLASS: Record<SuggestionCategory, string> = {
  bug: "bg-emerald-100 text-emerald-800",
  performance: "bg-emerald-100 text-emerald-800",
  ui_ux: "bg-blue-100 text-blue-800",
  feature: "bg-violet-100 text-violet-800",
  copywriting: "bg-amber-100 text-amber-800",
};

export const AUDIT_DIMENSIONS: AuditDimension[] = ["ui_ux", "feature", "copywriting", "performance"];

export function suggestionDimension(category: SuggestionCategory): AuditDimension {
  return category === "bug" ? "performance" : (category as AuditDimension);
}

export const SEVERITY_CLASS: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-700",
};

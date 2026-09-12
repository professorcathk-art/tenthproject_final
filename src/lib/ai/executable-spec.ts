import type { AiSuggestion, UATItem } from "@/types";

export const SPRINT_PROMPT_SYSTEM = `
You are a Technical Lead creating a Cursor Master Prompt for a Vibe Coder.
STRICT RULE: NEVER output vague descriptions like "improve UI", "optimize UX", or "conduct UAT".

Every suggestion and task MUST follow this strict technical template:
1. Target Component / File Route (e.g., \`components/stock-chart.tsx\` or \`app/analysis/page.tsx\`)
2. Concrete Action (e.g., "Add Skeleton Loader", "Implement Tailwind responsive grid \`grid-cols-1 md:grid-cols-3\`", "Add error boundary for 500 API responses")
3. Expected Code Outcome & Acceptance Criteria.

If the user input or audit data is vague, expand it into specific React/Next.js/Tailwind code tasks automatically.
`.trim();

const FILE_RE = /`?((?:src\/|app\/|components\/)[\w./[\]-]+\.(?:tsx|ts|jsx|js))`?/i;
const ROUTE_RE = /(\/(?:app\/)?[\w./[\]]+)/;

export function inferTargetFile(text: string, fallback = "src/app/page.tsx"): string {
  const file = text.match(FILE_RE)?.[1];
  if (file) return file.startsWith("src/") || file.startsWith("app/") ? file : file;
  const route = text.match(ROUTE_RE)?.[1];
  if (route?.startsWith("/app/")) return `src${route}`;
  if (route && route !== "/") {
    const clean = route.replace(/^\/+/, "").replace(/\[|\]/g, "");
    return `src/app/${clean}/page.tsx`;
  }
  return fallback;
}

export function specBlock(opts: {
  file: string;
  action: string;
  acceptance: string;
}): string {
  return [
    `- **Target file:** \`${opts.file}\``,
    `  - **Action:** ${opts.action}`,
    `  - **Acceptance:** ${opts.acceptance}`,
  ].join("\n");
}

export function buildRetestPrompt(item: Pick<UATItem, "title" | "expected_result" | "remark" | "test_path">): string {
  const target = item.test_path?.trim() || inferTargetFile(`${item.title}\n${item.expected_result ?? ""}`);
  const issue = [item.expected_result, item.remark].filter(Boolean).join(" — ") || item.title;
  return [
    `Cursor, UAT Failed on Component \`${target}\`.`,
    `Issue: ${issue}`,
    `Feature: ${item.title}.`,
    `Write a minimal micro-fix in that file (or the exact child it imports).`,
    `If the failure is layout, use Tailwind \`w-full max-w-xl mx-auto\` (or the matching grid) and re-test at 375px and desktop.`,
    `If the failure is data/API, add a typed error boundary / empty / loading state and do not leave a raw 500.`,
    `Do not rewrite unrelated files.`,
    `Verify with \`npm run build\`, then report pass/fail against the original step.`,
  ].join(" ");
}

export function extractSpecFromSuggestion(item: AiSuggestion): {
  file: string;
  action: string;
  acceptance: string;
} {
  const blob = `${item.title}\n${item.description}`;
  return {
    file: inferTargetFile(blob),
    action: item.title,
    acceptance: item.description,
  };
}

export function metricToPerformanceTask(durationMs: number): { title: string; description: string } {
  const file = "src/app/page.tsx";
  return {
    title: `[Performance] Dynamic-import heavy widgets (${durationMs}ms)`,
    description: [
      `Target: \`${file}\` (and any chart/map/editor imported from the first paint).`,
      `Action: wrap heavy client libraries in \`next/dynamic(() => import(...), { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> })\`. Split Recharts / Mapbox / Monaco out of the root bundle. Preload only above-the-fold copy.`,
      `Acceptance: first contentful route no longer waits on the heavy chunk; live check should drop well below ${durationMs}ms; \`npm run build\` passes; 375px has a skeleton, not a blank 8s hang.`,
    ].join("\n"),
  };
}

export function httpErrorToTask(status: number, durationMs: number): { title: string; description: string } {
  const file = status >= 500 ? "src/app/error.tsx" : "src/app/not-found.tsx";
  return {
    title: `[Bug] Handle HTTP ${status} on the live route`,
    description: [
      `Target: \`src/app/page.tsx\` plus \`${file}\`.`,
      `Action: add an App Router error/not-found boundary and a typed fetch wrapper that surfaces ${status} instead of an uncaught crash. Check env vars and the failing API route under \`src/app/api/\`.`,
      `Acceptance: the URL returns a designed state (retry CTA or 404 copy) within ${Math.max(durationMs, 1)}ms of navigation; no raw Next.js overlay for this status; \`npm run build\` passes.`,
    ].join("\n"),
  };
}

export function a11yWarningToTask(warning: string): { title: string; description: string } {
  const file = /viewport|horizontal scroll|overflow/i.test(warning)
    ? "src/app/globals.css"
    : "src/app/page.tsx";
  const action = /viewport|horizontal scroll|overflow/i.test(warning)
    ? "Fix overflow: set the main shell to `w-full max-w-xl mx-auto px-4` on mobile and `md:max-w-5xl`; replace fixed widths with `w-full min-w-0`."
    : `Repair the a11y issue in the live page: ${warning}`;
  return {
    title: `[UI] ${warning.slice(0, 64)}`,
    description: [
      `Target: \`${file}\` and the component that rendered the failing node.`,
      `Action: ${action}`,
      `Acceptance: warning gone at 375px and desktop; buttons ≥44px; \`npm run build\` passes.`,
    ].join("\n"),
  };
}

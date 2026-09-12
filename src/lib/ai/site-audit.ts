import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { AiSuggestion, AuditDimension, ProjectWithRelations, SuggestionCategory } from "@/types";
import type { WebsiteCheckResult } from "@/lib/playwright/check-http";
import { a11yWarningToTask, httpErrorToTask, metricToPerformanceTask } from "@/lib/ai/executable-spec";
import { AUDIT_DIMENSIONS, suggestionDimension } from "@/lib/project/audit";

export const AUDIT_SYSTEM_PROMPT = `
You are an Elite AI Product Architect and UX Specialist inspecting a live web application.
Your goal is to provide 3 to 4 actionable, highly specific product enhancement suggestions across distinct categories.

STRICT BALANCING RULE:
You MUST output suggestions spanning at least 3 of the following 4 dimensions. Do NOT only report backend or performance issues.

1. [UI_UX] (視覺與介面體驗):
   - Inspect layout spacing, typography hierarchy, mobile alignment, button contrast, and visual polish.
   - Example: "The stock search input box lacks visual focus state and hover micro-animations."

2. [FEATURE] (功能與商業邏輯):
   - Analyze feature completeness for the target audience (investors/users).
   - Example: "Missing quick-preset buttons (e.g., AAPL, TSLA, NVDA) below the analysis prompt input."

3. [COPYWRITING] (文案與用戶引導):
   - Check micro-copy clarity, onboarding tooltips, empty states, and error messaging.
   - Example: "Empty analysis result area lacks a helpful getting-started guide for first-time investors."

4. [PERFORMANCE] (效能與錯誤處理):
   - Page load timing, API latency, console errors, and missing loading skeletons.

STRICT RULE: NEVER write vague cards like "improve UI", "optimize UX", or "conduct UAT".
Each description MUST name:
1. Target Component / File route (e.g. src/components/stock-search.tsx or src/app/page.tsx)
2. Concrete React/Next.js/Tailwind action
3. Expected outcome and acceptance criteria including npm run build

Prefer Traditional Chinese when the project copy is Chinese.
Mark must-fix items approved=true; optional polish approved=false.

Return ONLY JSON:
{"suggestions":[{"category":"ui_ux|feature|copywriting|performance","title":"string","description":"string","severity":"low|medium|high","target_file":"src/components/stock-search.tsx","approved":true}]}
`.trim();

const CATEGORIES: SuggestionCategory[] = ["bug", "ui_ux", "performance", "feature", "copywriting"];
const SEVERITIES = ["low", "medium", "high", "critical"] as const;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AIML_API_KEY;
  const baseURL = process.env.AIML_API_KEY
    ? process.env.AIML_BASE_URL || "https://api.aimlapi.com/v1"
    : undefined;
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL });
}

function clip(text: string, max = 140) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function makeSuggestion(
  projectId: string,
  testRunId: string | null,
  draft: {
    category: SuggestionCategory;
    title: string;
    description: string;
    severity: AiSuggestion["severity"];
    approved?: boolean;
  },
): AiSuggestion {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    project_id: projectId,
    test_run_id: testRunId,
    category: draft.category,
    title: clip(draft.title, 80),
    description: draft.description.trim(),
    severity: draft.severity,
    approved: draft.approved ?? true,
    status: "pending",
    created_at: now,
    updated_at: now,
  };
}

export function heuristicSiteSuggestions(
  project: ProjectWithRelations,
  result: WebsiteCheckResult,
  testRunId: string | null,
): AiSuggestion[] {
  const items: AiSuggestion[] = [];
  const status = result.httpStatus;

  if (status !== null && status >= 400) {
    const task = httpErrorToTask(status, result.durationMs);
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "bug",
        title: task.title,
        description: task.description,
        severity: status >= 500 ? "critical" : "high",
      }),
    );
  } else if (status === null && result.consoleErrors.length) {
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "bug",
        title: "[Bug] Live check never completed",
        description: `Target: \`src/app/page.tsx\` and the deploy/env for ${project.website_url ?? "the live URL"}. Action: fix the failing request (${result.consoleErrors[0] || result.resultSummary}) and add src/app/error.tsx. Acceptance: health check returns 2xx; npm run build passes.`,
        severity: "critical",
      }),
    );
  }

  if (result.durationMs >= 3000) {
    const task = metricToPerformanceTask(result.durationMs);
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "performance",
        title: task.title,
        description: task.description,
        severity: result.durationMs >= 8000 ? "high" : "medium",
      }),
    );
  }

  for (const error of result.consoleErrors.slice(0, 3)) {
    if (/HTTP\s+[45]\d\d/.test(error)) continue;
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "bug",
        title: clip(`[Bug] ${error}`, 72),
        description: `Target: \`src/app/page.tsx\` (or the client component that threw). Action: catch this console error — ${error} — with an error boundary / typed fetch. Acceptance: console clean on reload; npm run build passes.`,
        severity: /failed|uncaught|timeout/i.test(error) ? "high" : "medium",
      }),
    );
  }

  for (const warning of result.accessibilityWarnings.slice(0, 3)) {
    const task = a11yWarningToTask(warning);
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "ui_ux",
        title: clip(task.title, 72),
        description: task.description,
        severity: /viewport|horizontal scroll/i.test(warning) ? "high" : "medium",
      }),
    );
  }

  for (const missing of result.missingElements.slice(0, 2)) {
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: /button|interactive/i.test(missing) ? "feature" : "ui_ux",
        title: clip(`[Feature] ${missing}`, 72),
        description: `Target: \`src/app/page.tsx\`. Action: add the missing control (${missing}) as a shadcn Button/Link with a clear href or onClick. Acceptance: element is in the a11y tree; matches goal「${project.goal ?? project.description ?? project.name}」; npm run build passes.`,
        severity: "medium",
      }),
    );
  }

  return balanceAuditDimensions(dedupeSuggestions(items), project, result, testRunId).slice(0, 8);
}

function dimensionFillers(
  project: ProjectWithRelations,
  result: WebsiteCheckResult,
  testRunId: string | null,
): Record<AuditDimension, AiSuggestion> {
  const audience = project.target_audience || project.goal || project.name;
  return {
    ui_ux: makeSuggestion(project.id, testRunId, {
      category: "ui_ux",
      title: "[UI/UX] 主搜尋框缺 focus／hover 狀態",
      description: "Target: `src/app/page.tsx`（或主搜尋／分析輸入框元件）。Action: 加上 `focus-visible:ring-2 focus-visible:ring-slate-900`、hover 微動畫，以及 375px 時 `w-full max-w-xl mx-auto`。Acceptance: 鍵盤 focus 看得到環；手機無橫向捲動；npm run build 通過。",
      severity: "medium",
    }),
    feature: makeSuggestion(project.id, testRunId, {
      category: "feature",
      title: "[Feature] 主輸入框下方加快速預設按鈕",
      description: `Target: \`src/app/page.tsx\`。Action: 在分析／搜尋輸入框下加 shadcn Button 預設（依受眾「${audience}」放 3 個常見例子，如 AAPL / TSLA / NVDA）。Acceptance: 點擊即填入並可送出；npm run build 通過。${result.pageTitle ? ` 目前頁標題：${result.pageTitle}` : ""}`,
      severity: "medium",
    }),
    copywriting: makeSuggestion(project.id, testRunId, {
      category: "copywriting",
      title: "[Copy] 空結果區缺第一次使用引導",
      description: "Target: `src/app/page.tsx`。Action: 空狀態改成短文案＋一步 CTA（例如「輸入代號，3 秒內看到分析」），錯誤改成人話而不是 raw 500。Acceptance: 首次進入看得到下一步；npm run build 通過。",
      severity: "medium",
    }),
    performance: makeSuggestion(project.id, testRunId, {
      category: "performance",
      title: metricToPerformanceTask(result.durationMs || 0).title,
      description: metricToPerformanceTask(result.durationMs || 0).description,
      severity: result.durationMs >= 8000 ? "high" : "medium",
    }),
  };
}

function balanceAuditDimensions(
  items: AiSuggestion[],
  project: ProjectWithRelations,
  result: WebsiteCheckResult,
  testRunId: string | null,
): AiSuggestion[] {
  const next = [...items];
  const have = new Set(next.map((item) => suggestionDimension(item.category)));
  const fillers = dimensionFillers(project, result, testRunId);
  for (const dim of AUDIT_DIMENSIONS) {
    if (have.size >= 3) break;
    if (have.has(dim)) continue;
    next.push(fillers[dim]);
    have.add(dim);
  }
  return dedupeSuggestions(next);
}

function normalizeCategory(value: string): SuggestionCategory {
  return CATEGORIES.includes(value as SuggestionCategory) ? (value as SuggestionCategory) : "feature";
}

function normalizeSeverity(value: string): AiSuggestion["severity"] {
  return SEVERITIES.includes(value as AiSuggestion["severity"])
    ? (value as AiSuggestion["severity"])
    : "medium";
}

function dedupeSuggestions(items: AiSuggestion[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function analyzeLiveSite(
  project: ProjectWithRelations,
  result: WebsiteCheckResult,
  testRunId: string | null,
): Promise<AiSuggestion[]> {
  const fallback = heuristicSiteSuggestions(project, result, testRunId);
  const client = getClient();
  if (!client) return fallback;

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: AUDIT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify({
            project: {
              name: project.name,
              description: project.description,
              goal: project.goal,
              product_type: project.product_type,
              stage: project.stage,
              website_url: project.website_url,
            },
            inspection: {
              httpStatus: result.httpStatus,
              durationMs: result.durationMs,
              pageTitle: result.pageTitle,
              resultSummary: result.resultSummary,
              consoleErrors: result.consoleErrors.slice(0, 8),
              accessibilityWarnings: result.accessibilityWarnings.slice(0, 8),
              missingElements: result.missingElements.slice(0, 8),
            },
            existing: {
              tasks: (project.tasks ?? []).map((item) => item.title),
              bugs: (project.bugs ?? []).map((item) => item.title),
              uat: (project.uat_items ?? []).map((item) => `${item.title}:${item.status}`),
            },
          }),
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return fallback;
    const parsed = JSON.parse(content) as {
      suggestions?: Array<{
        category?: string;
        title?: string;
        description?: string;
        severity?: string;
        target_file?: string;
        approved?: boolean;
      }>;
    };
    const fromModel = (parsed.suggestions ?? [])
      .filter((item) => item.title && item.description)
      .map((item) => {
        const file = item.target_file?.trim();
        const description = file && !item.description!.includes(file)
          ? `Target: \`${file}\`\n${item.description}`
          : item.description!;
        return makeSuggestion(project.id, testRunId, {
          category: normalizeCategory(item.category ?? "feature"),
          title: item.title!,
          description,
          severity: normalizeSeverity(item.severity ?? "medium"),
          approved: item.approved ?? true,
        });
      });

    return balanceAuditDimensions(dedupeSuggestions(fromModel.length ? fromModel : fallback), project, result, testRunId).slice(0, 8);
  } catch (error) {
    console.error("analyzeLiveSite failed:", error);
    return fallback;
  }
}

export function mergeAuditSuggestions(existing: AiSuggestion[], incoming: AiSuggestion[]) {
  const blocked = new Set(
    existing
      .filter((item) => item.status === "dismissed" || item.status === "applied")
      .map((item) => item.title.toLowerCase()),
  );
  const kept = existing.filter((item) => item.status === "pending");
  const keptTitles = new Set(kept.map((item) => item.title.toLowerCase()));
  const fresh = incoming.filter((item) => {
    const key = item.title.toLowerCase();
    if (blocked.has(key) || keptTitles.has(key)) return false;
    keptTitles.add(key);
    return true;
  });
  return [...kept, ...fresh];
}

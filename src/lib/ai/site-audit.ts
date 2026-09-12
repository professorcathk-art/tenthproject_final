import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { AiSuggestion, ProjectWithRelations, SuggestionCategory } from "@/types";
import type { WebsiteCheckResult } from "@/lib/playwright/check-http";
import { a11yWarningToTask, httpErrorToTask, metricToPerformanceTask } from "@/lib/ai/executable-spec";

const CATEGORIES: SuggestionCategory[] = ["bug", "ui_ux", "performance", "feature"];
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

  if (items.length === 0) {
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "feature",
        title: "[Feature] Empty / error / loading triad on src/app/page.tsx",
        description: `Target: \`src/app/page.tsx\`. Action: add Skeleton, empty Alert, and error Alert around the primary data fetch${result.pageTitle ? ` (page: ${result.pageTitle})` : ""}. Acceptance: new users see a next step in all three states; npm run build passes.`,
        severity: "medium",
        approved: true,
      }),
    );
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "ui_ux",
        title: "[UI] 375px pass on the primary form",
        description: "Target: `src/app/page.tsx`. Action: `w-full max-w-xl mx-auto px-4` + `grid-cols-1 md:grid-cols-3`. Acceptance: no horizontal scroll at 375px; tap targets ≥44px; npm run build passes.",
        severity: "low",
        approved: false,
      }),
    );
  }

  return dedupeSuggestions(items).slice(0, 8);
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
          content: `You are a Technical Lead. Convert a live website inspection into 3-8 Cursor-executable sprint cards.
Return ONLY JSON: {"suggestions":[{"category":"bug|ui_ux|performance|feature","title":"string","description":"string","severity":"low|medium|high|critical","approved":true}]}
STRICT RULE: NEVER write "improve UI", "optimize UX", or "conduct UAT".
Each description MUST name:
1. Target file (src/app/page.tsx, src/app/error.tsx, src/components/...)
2. Concrete React/Next.js/Tailwind action (next/dynamic, Skeleton, grid-cols-1 md:grid-cols-3, error boundary)
3. Acceptance criteria including npm run build
If durationMs >= 3000, emit a [Performance] card that dynamic-imports heavy charts — do not say "make it faster".
If httpStatus >= 400, target error.tsx / the failing API route.
Ground every card in the inspection evidence. Do not invent stack traces.
Prefer Traditional Chinese when the project copy is Chinese.
Mark must-fix items approved=true; optional polish approved=false.`,
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
        approved?: boolean;
      }>;
    };
    const fromModel = (parsed.suggestions ?? [])
      .filter((item) => item.title && item.description)
      .map((item) =>
        makeSuggestion(project.id, testRunId, {
          category: normalizeCategory(item.category ?? "feature"),
          title: item.title!,
          description: item.description!,
          severity: normalizeSeverity(item.severity ?? "medium"),
          approved: item.approved ?? true,
        }),
      );

    return dedupeSuggestions(fromModel.length ? fromModel : fallback).slice(0, 8);
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

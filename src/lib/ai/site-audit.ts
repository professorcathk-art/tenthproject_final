import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { AiSuggestion, ProjectWithRelations, SuggestionCategory } from "@/types";
import type { WebsiteCheckResult } from "@/lib/playwright/check-http";

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
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "bug",
        title: `網站回傳 HTTP ${status}`,
        description: `即時檢查 ${result.durationMs}ms 內收到 ${status}。請先確認路由、部署與環境變數，再測一次首頁。`,
        severity: status >= 500 ? "critical" : "high",
      }),
    );
  } else if (status === null && result.consoleErrors.length) {
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "bug",
        title: "網站無法完成健康檢查",
        description: result.consoleErrors[0] || result.resultSummary,
        severity: "critical",
      }),
    );
  }

  if (result.durationMs >= 3000) {
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "performance",
        title: "首屏回應偏慢",
        description: `檢查耗時 ${result.durationMs}ms。建議壓縮圖片、減少阻塞腳本，並確認伺服器冷啟動。`,
        severity: result.durationMs >= 8000 ? "high" : "medium",
      }),
    );
  }

  for (const error of result.consoleErrors.slice(0, 3)) {
    if (/HTTP\s+[45]\d\d/.test(error)) continue;
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "bug",
        title: clip(error, 72),
        description: `主控台／檢查器回報：${error}`,
        severity: /failed|uncaught|timeout/i.test(error) ? "high" : "medium",
      }),
    );
  }

  for (const warning of result.accessibilityWarnings.slice(0, 3)) {
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "ui_ux",
        title: clip(warning, 72),
        description: `${warning}。這會影響手機可用性與無障礙，建議本輪一併修正。`,
        severity: /viewport|horizontal scroll/i.test(warning) ? "high" : "medium",
      }),
    );
  }

  for (const missing of result.missingElements.slice(0, 2)) {
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: /button|interactive/i.test(missing) ? "feature" : "ui_ux",
        title: clip(missing, 72),
        description: `${missing}。請對照產品目標「${project.goal ?? project.description ?? project.name}」補上清楚的下一步。`,
        severity: "medium",
      }),
    );
  }

  if (items.length === 0) {
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "feature",
        title: "補強空狀態與下一步引導",
        description: `網站目前可連上${result.pageTitle ? `（${result.pageTitle}）` : ""}。建議檢查新使用者是否看得出主行動，並補 loading / empty / error 三態。`,
        severity: "medium",
        approved: true,
      }),
    );
    items.push(
      makeSuggestion(project.id, testRunId, {
        category: "ui_ux",
        title: "用手機寬度走一次主流程",
        description: "即使桌面正常，375px 下按鈕、表單與橫向溢出仍常出問題。請把主流程當成本輪驗收。",
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
          content: `You are a product QA architect. Turn a live website inspection into 3-8 actionable sprint cards for a non-technical founder.
Return ONLY JSON: {"suggestions":[{"category":"bug|ui_ux|performance|feature","title":"string","description":"string","severity":"low|medium|high|critical","approved":true}]}
Rules:
- Ground every card in the inspection evidence. Do not invent stack traces.
- Titles under 40 Chinese characters or 12 English words.
- Descriptions must say what to change and why it matters.
- Prefer Traditional Chinese if the project name/description is Chinese; otherwise match the project language.
- Mark must-fix items approved=true; optional polish approved=false.`,
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

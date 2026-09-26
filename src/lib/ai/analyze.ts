import OpenAI from "openai";
import type { AIAnalysis, AITool, Project, ProjectArtifact } from "@/types";
import {
  generateMasterPrompts,
  buildMasterPromptsFromTemplate,
  type PromptType,
} from "@/lib/ai/master-prompt";
import {
  MASTER_PROMPT_CODING_CONSTRAINTS,
  keepCodingItems,
  looksLikeNonCodingWork,
} from "@/lib/ai/coding-constraints";
import { applyConfirmedBrief, formatBriefForPrompt, type ProductBrief } from "@/lib/ai/product-brief";
import { ensureFeatureTasks, fallbackFeatureTasks } from "@/lib/ai/feature-tasks";

const SYSTEM_PROMPT = `You are a Technical Lead writing executable specs for Cursor (Next.js App Router, TypeScript, Tailwind, shadcn/ui).
STRICT RULE: NEVER output vague cards like "improve UI", "optimize UX", or "conduct UAT".

${MASTER_PROMPT_CODING_CONSTRAINTS}

CRITICAL TASK GENERATION RULES:
1. USER-CENTRIC TITLES: Task titles MUST be easily understood by non-technical founders. Group technical setups into high-level features (e.g., "基礎建設與外觀系統", "用戶登入與會員系統", "核心業務：行程表單介面").
2. DO NOT output overly granular technical steps as top-level tasks (e.g., NEVER output "Install Tailwind" or "Create PostgreSQL connection" as individual cards).
3. NESTED TECHNICAL CHECKLIST: For every top-level user-centric task, provide a technical_checklist array containing the specific coding steps meant for Cursor (e.g., "Initialize Next.js App Router", "Configure shadcn/ui", "Set up Supabase Auth").
4. EMOJI PREFIX: Prefix every task title with a relevant emoji (e.g., 🚀, 🔐, 🎨, 💳).
5. Return 3 to 5 tasks. Never more than 5. Put file paths, schemas, and commands inside technical_checklist, not in the title.
6. Titles follow the language of the project. If the project is written in Traditional Chinese, titles and descriptions are Traditional Chinese. Do not translate those titles into English.
7. A title says what a person can do. It must not be a technology name. Forbidden in titles: 路由, API, 資料庫, 前端, 組件, 基礎設置, Tailwind, Schema, PostgreSQL, Next.js, Supabase, Install, Setup. Those words go only in technical_checklist.
   Good: "🚀 排出今天的行程", "🔐 註冊登入，資料只給本人看", "🎨 手機打開也不會擠在一起".
   Bad: "🔗 路由與 API", "🗄️ 資料庫設計", "🎨 前端組件", "Install Tailwind".

Enhancement titles follow the same founder-facing rule as tasks. Never title one "Skeleton for async panels" or "Error boundary for fetch 500". Put the file path and the code action in the description. A Traditional Chinese project gets Traditional Chinese enhancement titles, for example "資料載入時先看到等待的樣子" and "出錯時顯示說明，並可以再試一次".
UAT items still need a target file or route, a concrete code action, and a testable result (375px + desktop, npm run build).
Phases and tasks must be engineering work only. Never market research, interviews, or reports.

Return ONLY valid JSON matching this schema:
{
  "projectSummary": "string",
  "productGoal": "string",
  "currentStageAssessment": "string",
  "completedItems": ["string"],
  "missingItems": ["string"],
  "risks": ["string"],
  "blockers": ["string"],
  "bugs": [{"title": "string", "description": "string", "severity": "low|medium|high|critical"}],
  "uatItems": [{"title": "string", "testPath": "src/app/page.tsx or /route", "expectedResult": "step -> expected DOM/API outcome", "severity": "low|medium|high", "phase": "string"}],
  "enhancements": [{"title": "string", "description": "string", "priority": "low|medium|high"}],
  "phases": [{"name": "string", "description": "string", "tasks": ["string"]}],
  "tasks": [{"title": "string", "description": "string", "technical_checklist": ["string"], "priority": "low|medium|high", "phase": "string"}],
  "nextAction": "string",
  "acceptanceCriteria": ["string"],
  "prompts": {
    "cursor": "placeholder — will be replaced by master prompt generator",
    "lovable": "placeholder",
    "gemini": "placeholder",
    "claude": "placeholder",
    "general": "placeholder"
  }
}

If live inspection shows a slow TTFB/load time, emit a performance task that uses next/dynamic for heavy client widgets — never "make it faster".
If inspection shows HTTP 4xx/5xx, target src/app/error.tsx or the failing src/app/api/* route.
Prefer Traditional Chinese when the project copy is Chinese.`;

function buildContext(
  project: Partial<Project>,
  artifacts: ProjectArtifact[] = [],
  existingState?: Record<string, unknown>,
  brief?: ProductBrief | null,
) {
  const artifactSummary = artifacts
    .map((a) => `- [${a.type}] ${a.title}${a.content_url ? `: ${a.content_url}` : ""}${a.summary ? ` — ${a.summary}` : ""}`)
    .join("\n");

  return `
Project Name: ${project.name}
Description: ${project.description}
Product Type: ${project.product_type}
Current Stage: ${project.stage}
AI Tool: ${project.selected_tool}
Target Audience: ${project.target_audience}
Goal: ${project.goal}
Website URL: ${project.website_url ?? "none"}
GitHub URL: ${project.github_url ?? "none"}

Artifacts:
${artifactSummary || "None uploaded yet"}

${existingState ? `Current Progress:\n${JSON.stringify(existingState, null, 2)}` : ""}
${brief ? `\n${formatBriefForPrompt(brief)}` : ""}
`.trim();
}

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AIML_API_KEY;
  const baseURL = process.env.AIML_API_KEY
    ? process.env.AIML_BASE_URL || "https://api.aimlapi.com/v1"
    : undefined;

  if (!apiKey) return null;

  return new OpenAI({ apiKey, baseURL });
}

function generateFallbackAnalysis(
  project: Partial<Project>,
  promptType: "initial" | "next-step" | "bug-fix" | "re-test" | "enhancement" = "initial"
): AIAnalysis {
  const name = project.name ?? "your project";
  const goal = project.goal ?? project.description ?? "build your product";

  const partialAnalysis = {
    projectSummary: `${name} is a ${project.product_type ?? "webapp"} aimed at ${project.target_audience ?? "users who need this solution"}. ${project.description ?? ""}`,
    productGoal: goal,
    currentStageAssessment: `You're in the ${project.stage ?? "developing"} stage. Focus on core functionality first, then polish.`,
    completedItems: ["Project setup and planning"],
    missingItems: [
      "src/app/page.tsx primary CTA + loading/empty/error triad",
      "src/app/error.tsx for API 500",
      "375px layout: w-full max-w-xl mx-auto, no overflow-x",
    ],
    risks: ["Vague tickets that Cursor cannot execute", "Heavy client charts on first paint"],
    blockers: [],
    bugs: [],
    uatItems: [
      {
        title: "首頁可在 3 秒內渲染主 CTA",
        testPath: "src/app/page.tsx",
        expectedResult: "開啟 / → 3 秒內看到主 CTA；無 HTTP 500；375px 無橫向溢出",
        severity: "high",
        phase: "Foundation",
      },
      {
        title: "主流程表單可提交並顯示結果",
        testPath: "src/app/page.tsx",
        expectedResult: "填入有效輸入並送出 → 結果區塊以 Markdown/圖表渲染；失敗時 error.tsx 或 inline Alert，不是白屏",
        severity: "high",
        phase: "Core Features",
      },
      {
        title: "手機寬度可點擊主按鈕",
        testPath: "src/app/page.tsx",
        expectedResult: "375px 下主按鈕 ≥44px、grid-cols-1 md:grid-cols-3，無 overflow-x",
        severity: "medium",
        phase: "Polish",
      },
    ],
    enhancements: /[\u4e00-\u9fff]/.test(`${project.name ?? ""} ${project.description ?? ""} ${project.goal ?? ""}`)
      ? [
          {
            title: "⏳ 資料載入時，先看到等待的樣子",
            description: "Target: src/app/page.tsx. Action: add a Skeleton while data loads. Acceptance: no blank flash; npm run build passes.",
            priority: "medium",
          },
          {
            title: "⚠️ 出錯時顯示說明，並可以再試一次",
            description: "Target: src/app/error.tsx. Action: show an explanation and a retry when the API returns 500. Acceptance: the page is not blank.",
            priority: "high",
          },
        ]
      : [
          {
            title: "Show a waiting state while data loads",
            description: "Target: src/app/page.tsx. Action: add a Skeleton while data loads. Acceptance: no blank flash; npm run build passes.",
            priority: "medium",
          },
          {
            title: "Show an explanation and a retry when something fails",
            description: "Target: src/app/error.tsx. Action: show an explanation and a retry when the API returns 500. Acceptance: the page is not blank.",
            priority: "high",
          },
        ],
    phases: /[\u4e00-\u9fff]/.test(`${project.name ?? ""} ${project.description ?? ""} ${project.goal ?? ""}`)
      ? [
          { name: "第一版", description: "網站骨架、主畫面、資料", tasks: ["版面", "主流程", "儲存"] },
          { name: "上線前", description: "手機與錯誤畫面", tasks: ["375px", "error.tsx"] },
        ]
      : [
          { name: "Foundation", description: "App shell, main screen, and saved data", tasks: ["layout", "primary flow", "storage"] },
          { name: "Polish", description: "Phone layout and error screen", tasks: ["375px", "error.tsx"] },
        ],
    tasks: fallbackFeatureTasks(/[\u4e00-\u9fff]/.test(`${project.name ?? ""} ${project.description ?? ""} ${project.goal ?? ""}`)),
    nextAction: promptType === "next-step"
      ? "Open the highest-priority target file, apply the listed Tailwind/React change, then re-run the failed UAT step and npm run build"
      : "Create src/app/page.tsx + src/app/error.tsx with a working primary CTA, then npm run build",
    acceptanceCriteria: [
      "Primary user flow works without errors",
      "Mobile-friendly layout",
      "Clear feedback for user actions",
    ],
  };

  return {
    ...partialAnalysis,
    prompts: buildMasterPromptsFromTemplate({
      project,
      analysis: partialAnalysis as unknown as AIAnalysis,
      promptType,
    }),
  };
}

function shapeAnalysis(analysis: AIAnalysis, brief?: ProductBrief | null) {
  return brief ? applyConfirmedBrief(analysis, brief) : analysis;
}

export async function analyzeProject(
  project: Partial<Project>,
  artifacts: ProjectArtifact[] = [],
  existingState?: Record<string, unknown>,
  promptType: "initial" | "next-step" | "bug-fix" | "re-test" | "enhancement" = "initial",
  brief?: ProductBrief | null,
): Promise<AIAnalysis> {
  const client = getClient();
  const context = buildContext(project, artifacts, existingState, brief);

  if (!client) {
    const draft = shapeAnalysis(generateFallbackAnalysis(project, promptType), brief);
    if (brief) {
      draft.prompts = buildMasterPromptsFromTemplate({ project, analysis: draft, promptType });
    }
    return draft;
  }

  try {
    const typeInstruction =
      promptType === "next-step"
        ? "Generate the NEXT SPRINT plan based on current progress. Focus on incomplete coding work."
        : promptType === "bug-fix"
          ? "Focus on bug fixes and re-testing failed UAT items."
          : promptType === "re-test"
            ? "Focus on re-testing items marked as fixed. Update UAT statuses accordingly."
            : promptType === "enhancement"
              ? "Focus on code enhancement suggestions for post-launch improvement."
              : `Generate the initial project plan and first development sprint. Tasks must be 100% coding implementations (routes, schemas, APIs, components) — never market research, interviews, reports, or mockups.${brief ? " The confirmed product brief is the spec. The first sprint must build only what that brief asks for." : ""}`;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `${typeInstruction}\n\n${context}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      const draft = shapeAnalysis(generateFallbackAnalysis(project, promptType), brief);
      if (brief) draft.prompts = buildMasterPromptsFromTemplate({ project, analysis: draft, promptType });
      return draft;
    }

    const parsed = JSON.parse(content) as AIAnalysis;
    const fallback = generateFallbackAnalysis(project, promptType);
    parsed.tasks = ensureFeatureTasks(
      keepCodingItems(parsed.tasks, (t) => `${t.title} ${t.description ?? ""} ${(t.technical_checklist ?? []).join(" ")}`),
    );
    parsed.missingItems = keepCodingItems(parsed.missingItems, (s) => s);
    parsed.enhancements = keepCodingItems(parsed.enhancements, (e) => `${e.title} ${e.description ?? ""}`);
    parsed.phases = (parsed.phases ?? [])
      .map((phase) => ({
        ...phase,
        tasks: keepCodingItems(phase.tasks, (task) => task),
      }))
      .filter((phase) => !looksLikeNonCodingWork(`${phase.name} ${phase.description}`));
    if (!parsed.prompts) parsed.prompts = fallback.prompts;
    if (!parsed.uatItems?.length) parsed.uatItems = fallback.uatItems;
    if (!parsed.tasks?.length) parsed.tasks = fallback.tasks;
    if (!parsed.phases?.length) parsed.phases = fallback.phases;
    if (!parsed.enhancements?.length) parsed.enhancements = fallback.enhancements;

    const shaped = shapeAnalysis(parsed, brief);
    shaped.prompts = await generateMasterPrompts({
      project,
      analysis: shaped,
      promptType,
      artifacts,
      existingState,
    });

    return shaped;
  } catch (error) {
    console.error("AI analysis failed:", error);
    const draft = shapeAnalysis(generateFallbackAnalysis(project, promptType), brief);
    if (brief) draft.prompts = buildMasterPromptsFromTemplate({ project, analysis: draft, promptType });
    return draft;
  }
}

export function getPromptForTool(analysis: AIAnalysis, tool: AITool): string {
  const prompts = analysis.prompts;
  switch (tool) {
    case "cursor":
      return prompts.cursor;
    case "lovable":
      return prompts.lovable;
    case "gemini":
      return prompts.gemini;
    case "claude":
      return prompts.claude;
    case "chatgpt":
      return prompts.general;
    default:
      return prompts.general;
  }
}

/** Regenerate a single tool's master prompt with full enrichment */
export async function regenerateMasterPrompt(
  project: Partial<Project>,
  analysis: AIAnalysis,
  tool: AITool,
  promptType: PromptType = "next-step",
  existingState?: Record<string, unknown>,
  artifacts?: ProjectArtifact[]
): Promise<string> {
  const masterPrompts = await generateMasterPrompts({
    project,
    analysis,
    promptType,
    artifacts,
    existingState,
  });
  return getPromptForTool({ ...analysis, prompts: masterPrompts }, tool);
}

export function formatBugFixPrompt(bugTitle: string, bugDescription: string, tool: AITool, projectName: string): string {
  const base = `Fix bug in "${projectName}": ${bugTitle}\n\nDescription: ${bugDescription}\n\nRequirements:\n- Fix the root cause, not just symptoms\n- Test the fix on mobile and desktop\n- Update any related UAT items\n- Do not introduce regressions`;

  switch (tool) {
    case "cursor":
      return `# Bug Fix: ${bugTitle}\n\nTarget file: infer from the stack, usually \`src/app/page.tsx\` or the API route that threw.\n\n${base}\n\n## Steps\n1. Open the failing file\n2. Apply a minimal typed fix (error boundary / Tailwind overflow / fetch guard)\n3. Re-test the original UAT step at 375px and desktop\n4. Run \`npm run build\``;
    case "lovable":
      return `# Fix: ${bugTitle}\n\n${base}\n\nEnsure UI fix works on all screen sizes.`;
    default:
      return base;
  }
}

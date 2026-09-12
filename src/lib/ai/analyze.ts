import OpenAI from "openai";
import type { AIAnalysis, AITool, Project, ProjectArtifact } from "@/types";
import {
  generateMasterPrompts,
  buildMasterPromptsFromTemplate,
  type PromptType,
} from "@/lib/ai/master-prompt";

const SYSTEM_PROMPT = `You are a Technical Lead writing executable specs for Cursor (Next.js App Router, TypeScript, Tailwind, shadcn/ui).
STRICT RULE: NEVER output vague cards like "improve UI", "optimize UX", or "conduct UAT".

Every task, bug, enhancement, and UAT item MUST include:
1. Target file or route (e.g. src/app/page.tsx, src/components/stock-chart.tsx)
2. Concrete code action (Skeleton, next/dynamic, grid-cols-1 md:grid-cols-3, error.tsx for HTTP 500)
3. Testable acceptance criteria (375px + desktop, npm run build)

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
  "tasks": [{"title": "string", "description": "string", "priority": "low|medium|high", "phase": "string"}],
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

function buildContext(project: Partial<Project>, artifacts: ProjectArtifact[] = [], existingState?: Record<string, unknown>) {
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
    enhancements: [
      {
        title: "Skeleton for async panels",
        description: "Target: src/app/page.tsx. Action: add <Skeleton className=\"h-64 w-full\" /> while data loads. Acceptance: no blank flash; npm run build passes.",
        priority: "medium",
      },
      {
        title: "Error boundary for fetch 500",
        description: "Target: src/app/error.tsx + the failing src/app/api/* route. Action: typed error UI with retry. Acceptance: 500 shows CTA, not overlay.",
        priority: "high",
      },
    ],
    phases: [
      { name: "Foundation", description: "App Router shell, layout.tsx, globals.css", tasks: ["src/app/layout.tsx", "src/app/page.tsx hero + CTA", "src/app/error.tsx"] },
      { name: "Core Features", description: "Primary route + API", tasks: ["Form + server action", "Result renderer", "Typed fetch errors"] },
      { name: "Polish & Launch", description: "375px + build", tasks: ["Tailwind responsive grid", "Skeleton/empty", "npm run build"] },
    ],
    tasks: [
      {
        title: "Wire primary flow in src/app/page.tsx",
        description: "Target: src/app/page.tsx. Action: form → server action/API → result panel. Acceptance: happy path + empty + error; npm run build.",
        priority: "high",
        phase: "Core Features",
      },
      {
        title: "Responsive grid on first paint",
        description: "Target: src/app/page.tsx. Action: grid grid-cols-1 md:grid-cols-3 gap-4; w-full min-w-0. Acceptance: 375px no overflow.",
        priority: "high",
        phase: "Polish & Launch",
      },
      {
        title: "Dynamic-import heavy widgets",
        description: "Target: src/app/page.tsx. Action: next/dynamic for charts/maps with Skeleton. Acceptance: first paint not blocked; npm run build.",
        priority: "medium",
        phase: "Polish & Launch",
      },
    ],
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

export async function analyzeProject(
  project: Partial<Project>,
  artifacts: ProjectArtifact[] = [],
  existingState?: Record<string, unknown>,
  promptType: "initial" | "next-step" | "bug-fix" | "re-test" | "enhancement" = "initial"
): Promise<AIAnalysis> {
  const client = getClient();
  const context = buildContext(project, artifacts, existingState);

  if (!client) {
    return generateFallbackAnalysis(project, promptType);
  }

  try {
    const typeInstruction =
      promptType === "next-step"
        ? "Generate the NEXT SPRINT plan based on current progress. Focus on what's still incomplete."
        : promptType === "bug-fix"
          ? "Focus on bug fixes and re-testing failed UAT items."
          : promptType === "re-test"
            ? "Focus on re-testing items marked as fixed. Update UAT statuses accordingly."
            : promptType === "enhancement"
              ? "Focus on enhancement suggestions for post-launch improvement."
              : "Generate the initial project plan and first development sprint.";

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `${typeInstruction}\n\n${context}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return generateFallbackAnalysis(project, promptType);

    const parsed = JSON.parse(content) as AIAnalysis;
    const fallback = generateFallbackAnalysis(project, promptType);
    if (!parsed.prompts) parsed.prompts = fallback.prompts;
    if (!parsed.uatItems?.length) parsed.uatItems = fallback.uatItems;
    if (!parsed.tasks?.length) parsed.tasks = fallback.tasks;
    if (!parsed.phases?.length) parsed.phases = fallback.phases;
    if (!parsed.enhancements?.length) parsed.enhancements = fallback.enhancements;

    // Generate comprehensive master prompts (dedicated pass + template fallback)
    parsed.prompts = await generateMasterPrompts({
      project,
      analysis: parsed,
      promptType,
      artifacts,
      existingState,
    });

    return parsed;
  } catch (error) {
    console.error("AI analysis failed:", error);
    return generateFallbackAnalysis(project, promptType);
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

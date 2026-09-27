import OpenAI from "openai";
import type { AIAnalysis, AITool, Project, ProjectArtifact } from "@/types";
import {
  MASTER_PROMPT_CODING_CONSTRAINTS,
  keepCodingItems,
  looksLikeNonCodingWork,
} from "@/lib/ai/coding-constraints";
import { deliveryGuard, detectDeliveryShape, extensionFiles, promptMatchesShape, type DeliveryShape } from "@/lib/ai/delivery-shape";
import { briefSourceFromProject } from "@/lib/ai/product-brief";
import { findIntakeArtifact, parseIntake } from "@/lib/project/intake";

export type PromptType = "initial" | "next-step" | "bug-fix" | "re-test" | "enhancement";

interface MasterPromptContext {
  project: Partial<Project>;
  analysis: Partial<AIAnalysis>;
  promptType: PromptType;
  artifacts?: ProjectArtifact[];
  existingState?: Record<string, unknown>;
}

const MIN_MASTER_PROMPT_LENGTH = 800;

const MASTER_PROMPT_SYSTEM = `You are a Technical Lead writing a Cursor-ready master prompt.
STRICT RULE: NEVER say "improve UI", "optimize UX", or "conduct UAT".
Every task must name a concrete file and a concrete code action. Obey the delivery shape in the user message. If that shape is a browser extension, write a Manifest V3 extension and do not output a Next.js website. Acceptance criteria must match that shape.

${MASTER_PROMPT_CODING_CONSTRAINTS}

You are also an expert vibe-coding prompt architect. Transform a user's rough product idea into a COMPREHENSIVE MASTER PROMPT they can paste directly into AI coding tools (Cursor, Lovable, Gemini, Claude, ChatGPT).

The master prompt must be LONG, DETAILED, and STRUCTURED — not a one-liner or short paragraph.

Each tool-specific prompt MUST include ALL of these sections (use markdown headers):

1. **Product Vision** — what code we are shipping and the technical outcome
2. **Target Users & Problem** — who the product is for (context only; do not assign research tasks)
3. **Tech Stack & Architecture** — Next.js / TypeScript / database / auth / payments as code work
4. **Suggested File/Folder Structure** — concrete directory tree
5. **This Sprint Scope** — ONLY code implementations to build NOW (routes, schemas, APIs, components)
6. **Implementation Tickets** — 3-5 tickets named as files + coding actions, never interviews or reports
7. **Feature Requirements** — translate needs into technical features (PostgreSQL, Stripe, Tailwind layouts)
8. **Pages & Routes** — App Router paths to implement
9. **Data Model** — tables/collections and fields to code
10. **UI Implementation Notes** — Tailwind/shadcn components to build, not mockup exploration
11. **Acceptance Criteria** — testable checklist with routes + expected DOM
12. **Exact Target Files** — concrete paths only
13. **Step-by-Step Code Modifications** — file → action → acceptance
14. **Build & Verification Command** — always include \`npm run build\`
15. **Out of Scope** — explicitly exclude market research, user interviews, reports, and mockup-only work
16. **Quality Bar** — loading/error/empty states, 375px, accessibility

Tool-specific formatting:
- **cursor**: Include file paths, "read codebase first", incremental build steps, TypeScript/Tailwind conventions, "do not over-engineer"
- **lovable**: Emphasize UI components to code, design system files, page-by-page build order
- **gemini**: Numbered step-by-step coding execution plan
- **claude**: Structured sections with coding constraints
- **general**: Tool-agnostic but equally comprehensive and code-only

Minimum length: each prompt must be at least 600 words. Be specific to the user's project — never generic boilerplate.

Return ONLY valid JSON:
{
  "cursor": "full markdown master prompt",
  "lovable": "full markdown master prompt",
  "gemini": "full markdown master prompt",
  "claude": "full markdown master prompt",
  "general": "full markdown master prompt"
}`;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AIML_API_KEY;
  const baseURL = process.env.AIML_API_KEY
    ? process.env.AIML_BASE_URL || "https://api.aimlapi.com/v1"
    : undefined;
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL });
}

function sourceFromContext(ctx: MasterPromptContext) {
  const intake = parseIntake(findIntakeArtifact(ctx.artifacts));
  return briefSourceFromProject(ctx.project, intake?.notes, intake?.fileNames);
}

function recommendStack(shape: DeliveryShape) {
  if (shape === "browser_extension") {
    const files = extensionFiles();
    return { stack: files.stack, structure: files.structure };
  }
  if (shape === "unspecified") {
    return {
      stack: "Only the form the founder filled in. Do not assume Next.js, login, or a database.",
      structure: "Create only the files that product needs. Do not scaffold a website.",
    };
  }
  const productType = shape === "web_app" ? "webapp" : shape;
  const type = productType ?? "webapp";
  if (type === "landing_page") {
    return {
      stack: "Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Vercel",
      structure: `src/
  app/
    page.tsx          # Landing page
    layout.tsx
    globals.css
  components/
    hero.tsx
    features.tsx
    cta.tsx
    footer.tsx
  lib/
    utils.ts`,
    };
  }
  if (type === "dashboard") {
    return {
      stack: "Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Recharts",
      structure: `src/
  app/
    dashboard/
      page.tsx
      layout.tsx
    api/
  components/
    ui/
    charts/
    sidebar.tsx
  lib/
    supabase/
    utils.ts`,
    };
  }
  if (type === "automation") {
    return {
      stack: "Node.js/Next.js API routes, TypeScript, cron/queue, Supabase for logs",
      structure: `src/
  app/
    api/
      jobs/
      webhooks/
  lib/
    automation/
    scheduler.ts
  scripts/`,
    };
  }
  return {
    stack: "Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase (Auth + Postgres + Storage), Vercel",
    structure: `src/
  app/
    page.tsx
    layout.tsx
    (auth)/
      login/
      signup/
    dashboard/
    api/
  components/
    ui/
    layout/
  lib/
    supabase/
    utils.ts
  types/
    index.ts`,
  };
}

function buildUserContext(ctx: MasterPromptContext): string {
  const { project, analysis, promptType, artifacts, existingState } = ctx;
  const intake = parseIntake(findIntakeArtifact(artifacts));
  const source = briefSourceFromProject(project, intake?.notes, intake?.fileNames);
  const zh = /[\u4e00-\u9fff]/.test(`${project.name ?? ""} ${project.description ?? ""} ${intake?.notes ?? ""}`);
  const artifactSummary = (artifacts ?? [])
    .filter((item) => item.title !== "建立專案時填的表")
    .map((a) => `- [${a.type}] ${a.title}${a.content_url ? `: ${a.content_url}` : ""}`)
    .join("\n");

  return `
PROMPT TYPE: ${promptType}

=== PROJECT ===
Name: ${project.name}
Description: ${project.description}
Product Type: ${project.product_type}
Stage: ${project.stage}
Target Audience: ${project.target_audience}
Goal: ${project.goal}
Original form notes: ${intake?.notes || "none"}
Uploaded files: ${(intake?.fileNames ?? []).join(", ") || "none"}
Website URL: ${project.website_url ?? "none"}
GitHub URL: ${project.github_url ?? "none"}

${deliveryGuard(detectDeliveryShape(source), zh)}

=== AI ANALYSIS ===
Summary: ${analysis.projectSummary ?? ""}
Product Goal: ${analysis.productGoal ?? ""}
Stage Assessment: ${analysis.currentStageAssessment ?? ""}
Next Action: ${analysis.nextAction ?? ""}
Completed: ${(analysis.completedItems ?? []).join("; ")}
Missing: ${(analysis.missingItems ?? []).join("; ")}
Risks: ${(analysis.risks ?? []).join("; ")}

=== PHASES ===
${(analysis.phases ?? []).map((p) => `- ${p.name}: ${p.description} → ${p.tasks?.join(", ")}`).join("\n")}

=== TASKS (this sprint) ===
${(analysis.tasks ?? []).map((t) => {
  const steps = (t.technical_checklist ?? []).map((step) => `    - ${step}`).join("\n");
  const line = `- [${t.priority}] ${t.title}: ${t.description}`;
  return steps ? `${line}\n  Cursor checklist:\n${steps}` : line;
}).join("\n")}

=== UAT CHECKLIST ===
${(analysis.uatItems ?? []).map((u) => `- ${u.title} → Expected: ${u.expectedResult}`).join("\n")}

=== ACCEPTANCE CRITERIA ===
${(analysis.acceptanceCriteria ?? []).join("\n- ")}

=== ARTIFACTS ===
${artifactSummary || "None"}

=== CURRENT PROGRESS ===
${existingState ? JSON.stringify(existingState, null, 2) : "Starting fresh"}
`.trim();
}

function buildShapeBoundPrompt(tool: AITool, ctx: MasterPromptContext, shape: DeliveryShape): string {
  const { project, analysis } = ctx;
  const intake = parseIntake(findIntakeArtifact(ctx.artifacts));
  const name = project.name ?? "Project";
  const zh = /[\u4e00-\u9fff]/.test(`${name} ${project.description ?? ""} ${project.goal ?? ""} ${intake?.notes ?? ""}`);
  const files = shape === "browser_extension" ? extensionFiles() : null;
  const tasks = (analysis.tasks ?? []).slice(0, 5);
  const taskLines = tasks.length
    ? tasks.map((task, index) => `${index + 1}. **${task.title}** — ${task.description ?? ""}\n${(task.technical_checklist ?? []).map((step) => `   - ${step}`).join("\n")}`).join("\n")
    : zh
      ? "1. 只做使用者表格裡寫的那一件。"
      : "1. Build only what the form asks for.";
  const acceptance = (analysis.acceptanceCriteria ?? []).map((item) => `- [ ] ${item}`).join("\n");
  return `# Master Build Prompt: ${name}

> Tool: ${tool}
> ${deliveryGuard(shape, zh)}

## 1. What the founder filled in
- Name: ${name}
- What to build: ${project.description ?? ""}
- End goal: ${project.goal ?? ""}
- Audience: ${project.target_audience ?? ""}
- Product type: ${project.product_type ?? ""}
- Stage: ${project.stage ?? ""}
- AI tool: ${project.selected_tool ?? tool}
- Notes: ${intake?.notes || (zh ? "沒有另外填寫" : "none")}
- Files: ${(intake?.fileNames ?? []).join(", ") || (zh ? "沒有" : "none")}
- Website: ${project.website_url ?? (zh ? "沒有" : "none")}
- GitHub: ${project.github_url ?? (zh ? "沒有" : "none")}

## 2. Tech stack
${files ? files.stack : "Follow the form. Do not introduce Next.js, Supabase, login, or a dashboard."}

## 3. Files
\`\`\`
${files ? files.structure : "Only the files this product needs."}
\`\`\`

## 4. This sprint
${taskLines}

## 5. Acceptance
${acceptance || (files ? files.pages.map((page) => `- [ ] ${page.route}: ${page.purpose}`).join("\n") : "- [ ] The result matches the form, and it is not a website unless the form asked for one.")}

## 6. How to check
${shape === "browser_extension"
  ? "Load the unpacked extension in chrome://extensions. Open a job application page. Save details in the popup, click fill, and see those details in the form. The page must still be the job site."
  : "Run the product the way the form describes. Do not add a website check."}

Do not invent market research, interviews, or a different product.
`;
}

function buildTemplateMasterPrompt(tool: AITool, ctx: MasterPromptContext): string {
  const shape = detectDeliveryShape(sourceFromContext(ctx));
  if (shape === "browser_extension" || shape === "unspecified") {
    return buildShapeBoundPrompt(tool, ctx, shape);
  }
  const { project, analysis, promptType } = ctx;
  const name = project.name ?? "Project";
  const goal = project.goal ?? project.description ?? "";
  const audience = project.target_audience ?? "target users";
  const stage = project.stage ?? "idea";
  const { stack, structure } = recommendStack(shape);

  const phases = (analysis.phases ?? [])
    .map((phase) => ({
      ...phase,
      tasks: keepCodingItems(phase.tasks, (task) => task),
    }))
    .filter((phase) => !looksLikeNonCodingWork(`${phase.name} ${phase.description}`));
  const tasks = keepCodingItems(analysis.tasks, (t) => `${t.title} ${t.description ?? ""} ${(t.technical_checklist ?? []).join(" ")}`);
  const uatItems = analysis.uatItems ?? [];
  const acceptance = analysis.acceptanceCriteria ?? [];
  const sprintPhase = phases[0]?.name ?? "Foundation";
  const sprintTasks = tasks.slice(0, 5);

  const sprintLabel =
    promptType === "initial"
      ? "Sprint 1 — Foundation & Core Setup"
      : promptType === "next-step"
        ? "Next Sprint — Continue Build"
        : promptType === "bug-fix"
          ? "Bug Fix Sprint"
          : "Development Sprint";

  const toolInstructions: Record<AITool, string> = {
    cursor: `## Implementation Instructions (Cursor)

You are building inside Cursor IDE. Follow these rules:
1. **Read the existing codebase first** — scan file structure before writing code
2. **Build incrementally** — one feature at a time, verify each step works
3. **Match existing conventions** — naming, imports, component patterns
4. **Use TypeScript strictly** — no \`any\`, proper types for all props and API responses
5. **Use Tailwind + shadcn/ui** for UI — professional light-mode design
6. **Add loading, error, and empty states** for every async operation
7. **Mobile responsive** — test at 375px viewport
8. **Run \`npm run build\`** after changes to catch type errors
9. **Do not over-engineer** — minimal scope, no premature abstractions
10. **Do not skip steps** — complete acceptance criteria before moving on
11. **Do not invent research or interview tasks** — only write and wire code`,
    lovable: `## Implementation Instructions (Lovable)

Build this visually in Lovable:
1. Start with layout shell and navigation
2. Build page-by-page, mobile-first
3. Use clean light-mode design (Linear/Notion aesthetic)
4. Every page needs clear CTA and empty states
5. Connect to Supabase for data persistence
6. Polish spacing, typography, and hover states before adding features`,
    gemini: `## Step-by-Step Execution Plan (Gemini)

Execute in this exact order:
1. Inspect existing files and confirm the coding scope
2. Set up project structure and dependencies
3. Build layout and navigation in App Router files
4. Implement core user flow in components and API routes
5. Add data layer and persistence
6. Add feedback states (loading, error, success, empty)
7. Test mobile responsiveness
8. Verify all acceptance criteria with \`npm run build\``,
    claude: `## Implementation Instructions (Claude)

Approach this systematically:
1. Restate the goal and confirm understanding
2. Propose file structure before coding
3. Implement in small, testable increments
4. Explain key decisions in plain language
5. Flag any scope risks or blockers
6. Provide acceptance criteria checklist at the end`,
    chatgpt: `## Implementation Instructions

Build this step by step:
1. Confirm understanding of the product goal
2. Set up project structure
3. Build core features incrementally
4. Test each feature before moving on
5. Ensure mobile-friendly UI
6. Complete all acceptance criteria`,
    other: `## Implementation Instructions

Build incrementally with clear acceptance criteria. Test on mobile.`,
  };

  const instructions = toolInstructions[tool] ?? toolInstructions.other;

  const pages = inferPages(shape === "web_app" ? "webapp" : shape, name, goal);

  return `# Master Build Prompt: ${name}

> ${sprintLabel} | Stage: ${stage} | Tool-optimized master prompt

---

## 1. Product Vision

Build **${name}** — ${project.description ?? goal}

**End goal:** ${goal}

**Why this matters:** Help ${audience} solve a real problem with a product that is simple to use, reliable, and polished.

---

## 2. Target Users & Problem

**Primary audience:** ${audience}

**Core problem:** Users currently struggle with ${goal.toLowerCase().includes("track") ? "tracking and managing their workflow without a dedicated tool" : "achieving this goal without a purpose-built solution"}.

**User expectations:**
- Simple, jargon-free interface
- Works on phone and desktop
- Clear feedback for every action
- Fast loading, no confusing dead ends

---

## 3. Tech Stack & Architecture

**Recommended stack:** ${stack}

**Architecture principles:**
- Server components where possible, client components for interactivity
- API routes / server actions for backend logic
- Environment variables for secrets (never hardcode keys)
- Row-level security if using Supabase

---

## 4. File & Folder Structure

\`\`\`
${structure}
\`\`\`

---

## 5. Exact Target Files & This Sprint Scope

**Phase focus:** ${sprintPhase}

**Touch only these files unless a missing import requires a sibling:**
${sprintTasks.map((t) => {
  const blob = `${t.description ?? ""} ${(t.technical_checklist ?? []).join(" ")} ${t.title}`;
  const file = blob.match(/(?:src\/|app\/|components\/)[\w./[\]-]+\.(?:tsx|ts)/)?.[0] ?? "src/app/page.tsx";
  return `- \`${file}\` — ${t.title}`;
}).join("\n")}

**Build NOW (this sprint):**
${sprintTasks.map((t, i) => {
  const steps = (t.technical_checklist ?? []).map((step) => `   - ${step}`).join("\n");
  return `${i + 1}. **${t.title}** — ${t.description ?? ""}${steps ? `\n${steps}` : ""}`;
}).join("\n")}

**Do NOT build yet:**
- Payment/billing (unless core to MVP)
- Advanced admin panels
- Multi-tenant enterprise features
- Complex agent orchestration
- Market research, user interviews, written reports, or mockup-only exploration

---

## 6. Implementation Tickets

${sprintTasks.slice(0, 4).map((t, i) => `${i + 1}. Implement **${t.title}** in code so ${audience} can use the working feature.`).join("\n")}

---

## 7. Feature Requirements

### Must Have (MVP)
${sprintTasks.filter((t) => t.priority === "high").map((t) => `- ${t.title}`).join("\n") || `- Next.js App Router shell for ${name}\n- Tailwind layout for the primary flow\n- Persistence schema (Postgres / Mongo) if data is required`}

### Should Have
${sprintTasks.filter((t) => t.priority === "medium").map((t) => `- ${t.title}`).join("\n") || "- Loading and error states\n- Empty state guidance"}

### Nice to Have (later)
- Advanced analytics
- Email notifications
- Social sharing

---

## 8. Pages & Routes

${pages.map((p) => `- **${p.route}** — ${p.purpose}`).join("\n")}

---

## 9. Data Model (key entities)

| Entity | Key Fields | Notes |
|--------|-----------|-------|
| User | id, email, name, created_at | Auth via Supabase |
| ${name.replace(/\s+/g, "")} | id, user_id, title, status, created_at | Core domain object |
| ActivityLog | id, entity_id, event_type, message | Audit trail |

Extend based on specific features needed for: ${goal}

---

## 10. UI Implementation Notes

- Implement light-mode layouts with Tailwind + shadcn/ui (Linear / Notion / Slack aesthetic)
- Typography and spacing live in component classNames, not in a separate mockup
- Mobile: fully responsive, tappable buttons (min 44px) in the real components
- States: every view needs loading, empty, error, and success states in code
- Copy: plain language in the shipped UI — no IT jargon for end users
- Navigation: clear next-action controls on every page you implement

---

## 11. Acceptance Criteria

${acceptance.length > 0 ? acceptance.map((a) => `- [ ] ${a}`).join("\n") : uatItems.slice(0, 5).map((u) => `- [ ] ${u.title}: ${u.expectedResult}`).join("\n") || `- [ ] Core user flow works end-to-end\n- [ ] Mobile layout is usable\n- [ ] No console errors\n- [ ] Empty states guide the user`}

---

${instructions}

---

## 13. Build & verification command

\`\`\`bash
npm run build
\`\`\`

## 14. Quality Bar

Before marking this sprint complete:
- [ ] \`npm run build\` passes with no errors
- [ ] All Must Have features work on desktop AND mobile
- [ ] No broken links or dead-end pages
- [ ] User can complete primary action without confusion
- [ ] Loading spinners/skeletons shown during async operations

---

## 14. Context Summary

${analysis.projectSummary ?? `${name} is a ${project.product_type} for ${audience}.`}

**Current assessment:** ${analysis.currentStageAssessment ?? `At ${stage} stage — focus on core value first.`}

**Next action after this sprint:** ${analysis.nextAction ?? "Run UAT checklist and fix any failed items."}
`;
}

function inferPages(productType?: string, name?: string, goal?: string) {
  const base = [
    { route: "/", purpose: "Landing page with value proposition and sign-up CTA" },
    { route: "/login", purpose: "User authentication" },
    { route: "/dashboard", purpose: "Main workspace — overview and next actions" },
  ];
  if (productType === "landing_page") {
    return [
      { route: "/", purpose: `Hero section explaining ${name} — ${goal}` },
      { route: "/#features", purpose: "Feature highlights" },
      { route: "/#cta", purpose: "Conversion / sign-up CTA" },
    ];
  }
  if (productType === "dashboard") {
    return [
      ...base,
      { route: "/dashboard/analytics", purpose: "Charts and key metrics" },
      { route: "/dashboard/settings", purpose: "User preferences" },
    ];
  }
  return [
    ...base,
    { route: "/projects/new", purpose: "Create new item / start workflow" },
    { route: "/settings", purpose: "Profile and preferences" },
  ];
}

export function isPromptTooSimple(prompt: string): boolean {
  if (!prompt || prompt.length < MIN_MASTER_PROMPT_LENGTH) return true;
  if (looksLikeNonCodingWork(prompt)) return true;
  const requiredSections = ["##", "Acceptance", "Tech Stack", "Scope"];
  const matchCount = requiredSections.filter((s) =>
    prompt.toLowerCase().includes(s.toLowerCase())
  ).length;
  return matchCount < 2;
}

export function buildMasterPromptsFromTemplate(ctx: MasterPromptContext): AIAnalysis["prompts"] {
  return {
    cursor: buildTemplateMasterPrompt("cursor", ctx),
    lovable: buildTemplateMasterPrompt("lovable", ctx),
    gemini: buildTemplateMasterPrompt("gemini", ctx),
    claude: buildTemplateMasterPrompt("claude", ctx),
    general: buildTemplateMasterPrompt("chatgpt", ctx),
  };
}

export async function generateMasterPrompts(ctx: MasterPromptContext): Promise<AIAnalysis["prompts"]> {
  const templates = buildMasterPromptsFromTemplate(ctx);
  const client = getClient();

  if (!client) return templates;

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: MASTER_PROMPT_SYSTEM },
        {
          role: "user",
          content: `Generate comprehensive master prompts for ALL tools based on this project context.\n\n${buildUserContext(ctx)}\n\nUse the project-specific details above. Each prompt must be 600+ words with all required sections. This Sprint Scope and Feature Requirements must be 100% coding/implementation work — never market research, interviews, or reports.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return templates;

    const parsed = JSON.parse(content) as AIAnalysis["prompts"];
    const shape = detectDeliveryShape(sourceFromContext(ctx));
    const keep = (prompt: string | undefined, fallback: string) =>
      prompt && !isPromptTooSimple(prompt) && promptMatchesShape(prompt, shape) ? prompt : fallback;

    return {
      cursor: keep(parsed.cursor, templates.cursor),
      lovable: keep(parsed.lovable, templates.lovable),
      gemini: keep(parsed.gemini, templates.gemini),
      claude: keep(parsed.claude, templates.claude),
      general: keep(parsed.general, templates.general),
    };
  } catch (error) {
    console.error("Master prompt generation failed, using templates:", error);
    return templates;
  }
}

export function enrichAnalysisPrompts(
  project: Partial<Project>,
  analysis: AIAnalysis,
  promptType: PromptType,
  artifacts?: ProjectArtifact[],
  existingState?: Record<string, unknown>
): AIAnalysis["prompts"] {
  const ctx: MasterPromptContext = { project, analysis, promptType, artifacts, existingState };
  const templates = buildMasterPromptsFromTemplate(ctx);

  if (!analysis.prompts) return templates;

  return {
    cursor: isPromptTooSimple(analysis.prompts.cursor) ? templates.cursor : analysis.prompts.cursor,
    lovable: isPromptTooSimple(analysis.prompts.lovable) ? templates.lovable : analysis.prompts.lovable,
    gemini: isPromptTooSimple(analysis.prompts.gemini) ? templates.gemini : analysis.prompts.gemini,
    claude: isPromptTooSimple(analysis.prompts.claude) ? templates.claude : analysis.prompts.claude,
    general: isPromptTooSimple(analysis.prompts.general) ? templates.general : analysis.prompts.general,
  };
}

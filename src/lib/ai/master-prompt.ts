import OpenAI from "openai";
import type { AIAnalysis, AITool, Project, ProjectArtifact } from "@/types";

export type PromptType = "initial" | "next-step" | "bug-fix" | "re-test" | "enhancement";

interface MasterPromptContext {
  project: Partial<Project>;
  analysis: Partial<AIAnalysis>;
  promptType: PromptType;
  artifacts?: ProjectArtifact[];
  existingState?: Record<string, unknown>;
}

const MIN_MASTER_PROMPT_LENGTH = 800;

const MASTER_PROMPT_SYSTEM = `You are an expert vibe-coding prompt architect. Your job is to transform a user's rough product idea into a COMPREHENSIVE MASTER PROMPT they can paste directly into AI coding tools (Cursor, Lovable, Gemini, Claude, ChatGPT).

The master prompt must be LONG, DETAILED, and STRUCTURED — not a one-liner or short paragraph.

Each tool-specific prompt MUST include ALL of these sections (use markdown headers):

1. **Product Vision** — what we're building and why
2. **Target Users & Problem** — who it's for, pain points solved
3. **Tech Stack & Architecture** — recommend appropriate stack based on product type
4. **Suggested File/Folder Structure** — concrete directory tree
5. **This Sprint Scope** — exactly what to build NOW (not everything)
6. **User Stories** — 3-5 "As a [user], I want [action], so that [benefit]"
7. **Feature Requirements** — Must Have / Should Have / Nice to Have
8. **Pages & Routes** — list every page/screen with purpose
9. **Data Model** — key entities and fields
10. **UI/UX Guidelines** — design direction, responsive, states
11. **Acceptance Criteria** — testable checklist
12. **Implementation Instructions** — step-by-step for the AI tool
13. **Out of Scope** — what NOT to build yet
14. **Quality Bar** — loading/error/empty states, mobile, accessibility

Tool-specific formatting:
- **cursor**: Include file paths, "read codebase first", incremental build steps, TypeScript/Tailwind conventions, "do not over-engineer"
- **lovable**: Emphasize UI components, design system, visual polish, page-by-page build order
- **gemini**: Numbered step-by-step execution plan
- **claude**: Structured sections with constraints and reasoning
- **general**: Tool-agnostic but equally comprehensive

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

function recommendStack(productType?: string) {
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
  const artifactSummary = (artifacts ?? [])
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
Website URL: ${project.website_url ?? "none"}
GitHub URL: ${project.github_url ?? "none"}

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
${(analysis.tasks ?? []).map((t) => `- [${t.priority}] ${t.title}: ${t.description}`).join("\n")}

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

function buildTemplateMasterPrompt(tool: AITool, ctx: MasterPromptContext): string {
  const { project, analysis, promptType } = ctx;
  const name = project.name ?? "Project";
  const goal = project.goal ?? project.description ?? "";
  const audience = project.target_audience ?? "target users";
  const stage = project.stage ?? "idea";
  const { stack, structure } = recommendStack(project.product_type);

  const phases = analysis.phases ?? [];
  const tasks = analysis.tasks ?? [];
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
10. **Do not skip steps** — complete acceptance criteria before moving on`,
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
1. Analyze requirements and confirm scope
2. Set up project structure and dependencies
3. Build layout and navigation
4. Implement core user flow
5. Add data layer and persistence
6. Add feedback states (loading, error, success, empty)
7. Test mobile responsiveness
8. Verify all acceptance criteria`,
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

  const pages = inferPages(project.product_type, name, goal);

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

## 5. This Sprint Scope

**Phase focus:** ${sprintPhase}

**Build NOW (this sprint):**
${sprintTasks.map((t, i) => `${i + 1}. **${t.title}** — ${t.description ?? ""}`).join("\n")}

**Do NOT build yet:**
- Payment/billing (unless core to MVP)
- Advanced admin panels
- Multi-tenant enterprise features
- Complex agent orchestration

---

## 6. User Stories

${sprintTasks.slice(0, 4).map((t, i) => `${i + 1}. As **${audience}**, I want to **${t.title.toLowerCase()}**, so that **I can progress toward my goal**.`).join("\n")}

---

## 7. Feature Requirements

### Must Have (MVP)
${sprintTasks.filter((t) => t.priority === "high").map((t) => `- ${t.title}`).join("\n") || `- Core user flow for ${name}\n- Responsive layout\n- Basic data persistence`}

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

## 10. UI/UX Guidelines

- **Mode:** Light mode, professional (Linear / Notion / Slack aesthetic)
- **Typography:** Clean sans-serif, clear hierarchy
- **Spacing:** Generous whitespace, not cramped
- **Mobile:** Fully responsive, tappable buttons (min 44px)
- **States:** Every view needs loading, empty, error, and success states
- **Copy:** Plain language — no IT jargon for end users
- **Navigation:** Clear "next action" on every page

---

## 11. Acceptance Criteria

${acceptance.length > 0 ? acceptance.map((a) => `- [ ] ${a}`).join("\n") : uatItems.slice(0, 5).map((u) => `- [ ] ${u.title}: ${u.expectedResult}`).join("\n") || `- [ ] Core user flow works end-to-end\n- [ ] Mobile layout is usable\n- [ ] No console errors\n- [ ] Empty states guide the user`}

---

${instructions}

---

## 13. Quality Bar

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
          content: `Generate comprehensive master prompts for ALL tools based on this project context.\n\n${buildUserContext(ctx)}\n\nUse the project-specific details above. Each prompt must be 600+ words with all required sections.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 8000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return templates;

    const parsed = JSON.parse(content) as AIAnalysis["prompts"];

    return {
      cursor: isPromptTooSimple(parsed.cursor) ? templates.cursor : parsed.cursor,
      lovable: isPromptTooSimple(parsed.lovable) ? templates.lovable : parsed.lovable,
      gemini: isPromptTooSimple(parsed.gemini) ? templates.gemini : parsed.gemini,
      claude: isPromptTooSimple(parsed.claude) ? templates.claude : parsed.claude,
      general: isPromptTooSimple(parsed.general) ? templates.general : parsed.general,
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

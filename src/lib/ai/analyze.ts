import OpenAI from "openai";
import type { AIAnalysis, AITool, Project, ProjectArtifact } from "@/types";

const SYSTEM_PROMPT = `You are an AI product development coach for non-technical founders using vibe coding tools like Cursor, Lovable, Gemini, Claude, and ChatGPT.

Analyze the project context and return ONLY valid JSON matching this schema:
{
  "projectSummary": "string",
  "productGoal": "string",
  "currentStageAssessment": "string",
  "completedItems": ["string"],
  "missingItems": ["string"],
  "risks": ["string"],
  "blockers": ["string"],
  "bugs": [{"title": "string", "description": "string", "severity": "low|medium|high|critical"}],
  "uatItems": [{"title": "string", "expectedResult": "string", "severity": "low|medium|high", "phase": "string"}],
  "enhancements": [{"title": "string", "description": "string", "priority": "low|medium|high"}],
  "phases": [{"name": "string", "description": "string", "tasks": ["string"]}],
  "tasks": [{"title": "string", "description": "string", "priority": "low|medium|high", "phase": "string"}],
  "nextAction": "string",
  "acceptanceCriteria": ["string"],
  "prompts": {
    "cursor": "string - detailed prompt for Cursor IDE with file paths, tech stack, acceptance criteria",
    "lovable": "string - prompt optimized for Lovable with UI/UX focus",
    "gemini": "string - prompt for Gemini with clear steps",
    "claude": "string - prompt for Claude with structured sections",
    "general": "string - tool-agnostic prompt"
  }
}

Keep language simple for non-technical users. Prompts must be actionable and copy-paste ready.`;

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

  const basePrompt = `I'm building "${name}" — ${goal}.

Current stage: ${project.stage ?? "developing"}
Product type: ${project.product_type ?? "webapp"}
Target audience: ${project.target_audience ?? "general users"}

Please help me with the next development step. Focus on practical, incremental progress.

Acceptance criteria:
- Feature works on desktop and mobile
- Clear user feedback for all actions
- No console errors
- Matches the product goal`;

  return {
    projectSummary: `${name} is a ${project.product_type ?? "webapp"} aimed at ${project.target_audience ?? "users who need this solution"}. ${project.description ?? ""}`,
    productGoal: goal,
    currentStageAssessment: `You're in the ${project.stage ?? "developing"} stage. Focus on core functionality first, then polish.`,
    completedItems: ["Project setup and planning"],
    missingItems: [
      "Core feature implementation",
      "User testing checklist",
      "Mobile responsiveness check",
      "Error handling and empty states",
    ],
    risks: ["Scope creep", "Missing mobile testing"],
    blockers: [],
    bugs: [],
    uatItems: [
      { title: "Landing page loads correctly", expectedResult: "Page loads in under 3 seconds with no errors", severity: "high", phase: "Foundation" },
      { title: "Main user flow works end-to-end", expectedResult: "User can complete primary action without confusion", severity: "high", phase: "Core Features" },
      { title: "Mobile layout is usable", expectedResult: "All buttons tappable, text readable on phone", severity: "medium", phase: "Polish" },
      { title: "Forms validate input", expectedResult: "Clear error messages for invalid input", severity: "medium", phase: "Core Features" },
      { title: "Empty states are helpful", expectedResult: "User knows what to do when no data exists", severity: "low", phase: "Polish" },
    ],
    enhancements: [
      { title: "Add loading states", description: "Show spinners or skeletons while data loads", priority: "medium" },
      { title: "Improve onboarding", description: "Guide new users through first steps", priority: "high" },
    ],
    phases: [
      { name: "Foundation", description: "Set up core structure and navigation", tasks: ["Project setup", "Basic layout", "Routing"] },
      { name: "Core Features", description: "Build the main functionality", tasks: ["Primary user flow", "Data persistence", "Key interactions"] },
      { name: "Polish & Launch", description: "Test, fix, and prepare for users", tasks: ["UAT testing", "Bug fixes", "Performance check"] },
    ],
    tasks: [
      { title: "Implement core user flow", description: "Build the main feature users will use", priority: "high", phase: "Core Features" },
      { title: "Add responsive mobile layout", description: "Ensure app works well on phones", priority: "high", phase: "Polish & Launch" },
      { title: "Create empty and error states", description: "Handle edge cases gracefully", priority: "medium", phase: "Polish & Launch" },
      { title: "Run UAT checklist", description: "Test all critical paths manually", priority: "high", phase: "Polish & Launch" },
    ],
    nextAction: promptType === "next-step"
      ? "Complete the highest priority task, then re-run UAT on failed items"
      : "Start with the Foundation phase — set up core structure and main navigation",
    acceptanceCriteria: [
      "Primary user flow works without errors",
      "Mobile-friendly layout",
      "Clear feedback for user actions",
    ],
    prompts: {
      cursor: `# ${name} — Development Task\n\n${basePrompt}\n\n## Tech Stack\n- Next.js App Router\n- TypeScript\n- Tailwind CSS\n\n## Instructions for Cursor\n1. Read existing codebase structure first\n2. Implement incrementally with minimal scope\n3. Add loading/error/empty states\n4. Test on mobile viewport`,
      lovable: `# Build: ${name}\n\n${basePrompt}\n\n## Design Requirements\n- Clean, modern light-mode UI\n- Professional like Linear or Notion\n- Mobile responsive\n- Clear CTAs and empty states`,
      gemini: `Project: ${name}\nGoal: ${goal}\n\nStep-by-step task:\n1. Review current state\n2. Implement next priority feature\n3. Add user feedback (loading, success, error)\n4. Test on mobile\n\n${basePrompt}`,
      claude: `## Context\nBuilding "${name}" for ${project.target_audience ?? "target users"}.\n\n## Goal\n${goal}\n\n## Task\n${basePrompt}\n\n## Constraints\n- Keep changes focused\n- Non-technical user will copy this prompt\n- Include acceptance criteria`,
      general: basePrompt,
    },
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

export function formatBugFixPrompt(bugTitle: string, bugDescription: string, tool: AITool, projectName: string): string {
  const base = `Fix bug in "${projectName}": ${bugTitle}\n\nDescription: ${bugDescription}\n\nRequirements:\n- Fix the root cause, not just symptoms\n- Test the fix on mobile and desktop\n- Update any related UAT items\n- Do not introduce regressions`;

  switch (tool) {
    case "cursor":
      return `# Bug Fix: ${bugTitle}\n\n${base}\n\n## Steps\n1. Locate the relevant code\n2. Identify root cause\n3. Apply minimal fix\n4. Verify no regressions`;
    case "lovable":
      return `# Fix: ${bugTitle}\n\n${base}\n\nEnsure UI fix works on all screen sizes.`;
    default:
      return base;
  }
}

import { v4 as uuidv4 } from "uuid";
import type { CaseStudy, Course, Lesson } from "@/types/platform";

const COURSE_VIBE_ID = "11111111-1111-1111-1111-111111111101";
const COURSE_AGENT_ID = "11111111-1111-1111-1111-111111111102";

export const SEED_COURSES: Course[] = [
  {
    id: COURSE_VIBE_ID,
    title: "Vibe Coding: Zero to Hero",
    slug: "vibe-coding-zero-to-hero",
    description: "Learn to build full web apps using Cursor, Lovable, and AI tools — from idea to launch without traditional coding experience.",
    cover_image: null,
    level: "beginner",
    duration_hours: 12,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: COURSE_AGENT_ID,
    title: "AI Agent Development: Zero to Hero",
    slug: "ai-agent-zero-to-hero",
    description: "Build autonomous AI agents with tool calling, MCP integrations, and production deployment patterns.",
    cover_image: null,
    level: "intermediate",
    duration_hours: 16,
    published: true,
    created_at: new Date().toISOString(),
  },
];

const vibeLessons: Omit<Lesson, "id" | "course_id" | "created_at">[] = [
  { title: "Welcome: What is Vibe Coding?", order_index: 0, video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", content_md: "# Welcome\n\nVibe coding is building software by describing what you want in natural language and iterating with AI tools like **Cursor** and **Lovable**.\n\n## Key mindset\n- Start with a clear one-sentence goal\n- Build in small sprints\n- Test after every change\n- Use UAT checklists", quiz_data: [{ id: "q1", question: "What is vibe coding?", options: ["Writing code manually", "Building with AI tools using natural language", "Only using no-code tools", "Copy-pasting from Stack Overflow"], correctIndex: 1 }] },
  { title: "Setting Up Cursor & Your First Project", order_index: 1, video_url: null, content_md: "# Setting Up Cursor\n\n```bash\nnpx create-next-app@latest my-app --typescript --tailwind\n```\n\n1. Install Cursor IDE\n2. Open your project folder\n3. Use Cmd+K for inline edits\n4. Use Chat for planning", quiz_data: [{ id: "q1", question: "Which command creates a Next.js app?", options: ["npm start", "npx create-next-app", "git init", "cursor new"], correctIndex: 1 }] },
  { title: "Writing Effective Master Prompts", order_index: 2, video_url: null, content_md: "# Master Prompts\n\nA good master prompt includes:\n- Product vision\n- Tech stack\n- File structure\n- Sprint scope\n- Acceptance criteria\n\nUse **Tenth Project** to generate these automatically.", quiz_data: [{ id: "q1", question: "What should a master prompt include?", options: ["Only the app name", "Vision, stack, scope, and acceptance criteria", "Just CSS colors", "Your resume"], correctIndex: 1 }] },
  { title: "Building Your First Web App", order_index: 3, video_url: null, content_md: "# First Web App\n\nBuild a landing page with:\n- Hero section\n- Features grid\n- CTA button\n- Mobile responsive layout", quiz_data: [] },
  { title: "UAT Testing & Iteration", order_index: 4, video_url: null, content_md: "# UAT Testing\n\nAfter each sprint:\n1. Run through UAT checklist\n2. Mark items passed/failed\n3. Add remarks\n4. Generate next sprint prompt", quiz_data: [{ id: "q1", question: "When should you run UAT?", options: ["Never", "After each development sprint", "Only at launch", "Before writing any code"], correctIndex: 1 }] },
  { title: "Deploying to Vercel", order_index: 5, video_url: null, content_md: "# Deploy\n\n```bash\ngit push origin main\n```\n\nConnect GitHub repo to Vercel, add env vars, deploy.", quiz_data: [] },
  { title: "Final Project & Certification", order_index: 6, video_url: null, content_md: "# Final Project\n\nBuild a complete MVP using everything you've learned. Pass all module quizzes to earn your certificate.", quiz_data: [{ id: "q1", question: "Ready to ship?", options: ["Not yet", "Yes — I've completed all modules!"], correctIndex: 1 }] },
];

const agentLessons: Omit<Lesson, "id" | "course_id" | "created_at">[] = [
  { title: "Introduction to AI Agents", order_index: 0, video_url: null, content_md: "# AI Agents\n\nAn AI agent autonomously uses tools to accomplish goals.\n\n## Components\n- LLM brain\n- Tool definitions\n- Memory/context\n- Action loop", quiz_data: [{ id: "q1", question: "What makes an AI agent different from a chatbot?", options: ["It uses tools autonomously", "It has a nicer UI", "It only runs on mobile", "It doesn't use AI"], correctIndex: 0 }] },
  { title: "Tool Calling & Function Schemas", order_index: 1, video_url: null, content_md: "# Tool Calling\n\n```typescript\nconst tools = [{ name: 'search', description: 'Search the web', parameters: {...} }];\n```", quiz_data: [] },
  { title: "Model Context Protocol (MCP)", order_index: 2, video_url: null, content_md: "# MCP\n\nMCP lets AI tools connect to external services.\n\nTenth Project provides MCP tools for:\n- `get_active_roadmap`\n- `fetch_uat_status`\n- `update_uat_item`\n- `log_bug`", quiz_data: [{ id: "q1", question: "What does MCP stand for?", options: ["Model Context Protocol", "Multi Code Platform", "Master Coding Prompt", "Mobile Cloud Provider"], correctIndex: 0 }] },
  { title: "Building a Customer Support Agent", order_index: 3, video_url: null, content_md: "# Support Agent\n\nBuild an agent that:\n1. Reads support tickets\n2. Searches knowledge base\n3. Drafts responses\n4. Escalates when needed", quiz_data: [] },
  { title: "Agent Memory & State", order_index: 4, video_url: null, content_md: "# Memory\n\n- Short-term: conversation context\n- Long-term: vector DB / Supabase\n- Episodic: activity logs", quiz_data: [] },
  { title: "Production Deployment & Monitoring", order_index: 5, video_url: null, content_md: "# Production\n\nDeploy agents with:\n- Rate limiting\n- Error handling\n- Logging\n- Cost tracking", quiz_data: [] },
  { title: "Capstone: Deploy Your Agent", order_index: 6, video_url: null, content_md: "# Capstone\n\nDeploy a working AI agent with at least 2 tools and MCP integration.", quiz_data: [{ id: "q1", question: "Capstone complete?", options: ["Working on it", "Agent deployed!"], correctIndex: 1 }] },
];

export function getSeedLessons(): Lesson[] {
  const now = new Date().toISOString();
  return [
    ...vibeLessons.map((l, i) => ({ ...l, id: `22222222-2222-2222-2222-${String(i + 1).padStart(12, "0")}`, course_id: COURSE_VIBE_ID, created_at: now })),
    ...agentLessons.map((l, i) => ({ ...l, id: `33333333-3333-3333-3333-${String(i + 1).padStart(12, "0")}`, course_id: COURSE_AGENT_ID, created_at: now })),
  ];
}

const VIBE_TITLES = [
  "Solo Founder Built a SaaS in 48 Hours", "Fitness Tracker from a WhatsApp Idea", "Recipe App for Busy Parents",
  "Invoice Generator for Freelancers", "Habit Tracker with AI Coaching", "Pet Care Scheduler MVP",
  "Local Events Discovery App", "Language Learning Flashcards", "Budget Planner for Students",
  "Wedding Planning Checklist Tool", "Plant Care Reminder App", "Book Club Organizer",
  "Meal Prep Planner", "Study Group Coordinator", "Freelance Time Tracker",
  "Community Forum in a Weekend", "Portfolio Site for Designers", "Booking System for Tutors",
  "Inventory Tracker for Small Shops", "Meditation Timer with Streaks", "Job Application Tracker",
  "Gift Idea Generator", "Home Maintenance Log", "Travel Itinerary Builder",
  "Volunteer Shift Scheduler",
];

const AGENT_TITLES = [
  "Customer Support Agent for E-commerce", "Sales Lead Qualification Bot", "HR Onboarding Assistant",
  "Code Review Agent for Startups", "Research Agent for Analysts", "Email Triage Agent",
  "Meeting Notes Summarizer", "Inventory Reorder Agent", "Social Media Content Agent",
  "Legal Document Review Assistant", "Medical Triage Chatbot (Demo)", "Real Estate Lead Agent",
  "Recruitment Screening Agent", "Financial Report Analyzer", "IT Helpdesk Agent",
  "Content Moderation Agent", "Competitive Intelligence Agent", "Project Status Reporter",
  "Data Pipeline Monitor Agent", "Compliance Check Agent", "Translation QA Agent",
  "Supply Chain Alert Agent", "Customer Feedback Analyzer", "API Documentation Agent", "DevOps Incident Agent",
];

const STACKS = [
  ["Next.js", "Supabase", "OpenAI", "Vercel"],
  ["Cursor", "Tailwind", "TypeScript", "Stripe"],
  ["Lovable", "React", "Firebase", "Vercel"],
  ["Claude", "Python", "FastAPI", "Railway"],
  ["Gemini", "Next.js", "Prisma", "Neon"],
  ["ChatGPT", "Node.js", "MongoDB", "Render"],
];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildBreakdown(title: string, category: string, stack: string[]) {
  return `# ${title}

## Problem
Users needed a solution that traditional software couldn't provide quickly or affordably.

## Solution
${category === "ai_agent" ? "An autonomous AI agent" : "A vibe-coded web application"} built in ${category === "ai_agent" ? "2 weeks" : "48 hours"} using ${stack.join(", ")}.

## Architecture
\`\`\`
User → ${category === "ai_agent" ? "Agent Interface" : "Web App"} → ${stack[1] ?? "Backend"} → ${stack[0] ?? "Frontend"}
\`\`\`

## Key Learnings
1. Start with the smallest useful version
2. Use AI tools for 80% of the code
3. UAT after every sprint
4. Ship early, iterate based on feedback

## Results
- MVP launched in record time
- ${category === "ai_agent" ? "60% reduction in manual tasks" : "First 100 users within 2 weeks"}
- Total build cost under $500
`;
}

export function getSeedCaseStudies(): CaseStudy[] {
  const now = new Date().toISOString();
  const studies: CaseStudy[] = [];

  VIBE_TITLES.forEach((title, i) => {
    const stack = STACKS[i % STACKS.length];
    studies.push({
      id: uuidv4(),
      title,
      slug: slugify(title),
      category: "vibe_coding",
      summary: `How a non-technical founder built "${title}" using ${stack[0]} and ${stack[1]} in under a week.`,
      breakdown_md: buildBreakdown(title, "vibe_coding", stack),
      tech_stack: stack,
      cover_image: null,
      author_id: null,
      is_published: true,
      created_at: now,
    });
  });

  AGENT_TITLES.forEach((title, i) => {
    const stack = STACKS[i % STACKS.length];
    studies.push({
      id: uuidv4(),
      title,
      slug: slugify(title),
      category: "ai_agent",
      summary: `Production AI agent case study: ${title} using ${stack.join(", ")}.`,
      breakdown_md: buildBreakdown(title, "ai_agent", stack),
      tech_stack: stack,
      cover_image: null,
      author_id: null,
      is_published: true,
      created_at: now,
    });
  });

  return studies;
}

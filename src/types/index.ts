export type ProductType =
  | "webapp"
  | "small_tool"
  | "software"
  | "automation"
  | "landing_page"
  | "dashboard"
  | "other";

export type ProjectStage =
  | "idea"
  | "developing"
  | "launch_ready"
  | "post_launch";

export type AITool =
  | "cursor"
  | "lovable"
  | "gemini"
  | "claude"
  | "chatgpt"
  | "other";

export type UATStatus =
  | "not_started"
  | "in_progress"
  | "passed"
  | "failed"
  | "blocked"
  | "needs_review"
  | "fixed"
  | "verified"
  | "reopened";

export type PromptType =
  | "initial"
  | "next-step"
  | "bug-fix"
  | "re-test"
  | "enhancement";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  default_ai_model: string;
  default_tool: AITool;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  product_type: ProductType;
  stage: ProjectStage;
  selected_tool: AITool;
  target_audience: string | null;
  goal: string | null;
  website_url: string | null;
  github_url: string | null;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface ProjectArtifact {
  id: string;
  project_id: string;
  type: "screenshot" | "url" | "doc" | "note" | "repo" | "figma" | "reference";
  title: string;
  file_url: string | null;
  content_url: string | null;
  extracted_text: string | null;
  summary: string | null;
  created_at: string;
}

export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  order: number;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  phase_id: string | null;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done" | "blocked";
  priority: "low" | "medium" | "high";
  source: "ai" | "manual" | "imported";
  created_at: string;
  updated_at: string;
}

export interface UATItem {
  id: string;
  project_id: string;
  task_id: string | null;
  phase_id: string | null;
  title: string;
  expected_result: string | null;
  actual_result: string | null;
  status: UATStatus;
  severity: "low" | "medium" | "high" | "critical";
  remark: string | null;
  evidence_url: string | null;
  owner: string | null;
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export interface UATRemark {
  id: string;
  uat_item_id: string;
  remark: string;
  status_before: string | null;
  status_after: string | null;
  evidence_url: string | null;
  updated_by: string | null;
  created_at: string;
}

export interface Bug {
  id: string;
  project_id: string;
  linked_uat_item_id: string | null;
  title: string;
  description: string | null;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "fixed" | "verified" | "closed";
  fix_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enhancement {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  status: "suggested" | "planned" | "done";
  created_at: string;
}

export interface PromptRun {
  id: string;
  project_id: string;
  tool: AITool;
  prompt_text: string;
  prompt_type: PromptType;
  generated_from_context_version: string | null;
  created_at: string;
}

export interface ContextVersion {
  id: string;
  project_id: string;
  summary_text: string | null;
  analysis_json: AIAnalysis | null;
  created_at: string;
}

export interface TestRun {
  id: string;
  project_id: string;
  url: string;
  browser: string;
  screenshot_url: string | null;
  console_errors: string[];
  accessibility_warnings: string[];
  result_summary: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  project_id: string;
  event_type: string;
  message: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AIAnalysis {
  projectSummary: string;
  productGoal: string;
  currentStageAssessment: string;
  completedItems: string[];
  missingItems: string[];
  risks: string[];
  blockers: string[];
  bugs: Array<{ title: string; description: string; severity: string }>;
  uatItems: Array<{
    title: string;
    expectedResult: string;
    severity: string;
    phase?: string;
  }>;
  enhancements: Array<{ title: string; description: string; priority: string }>;
  phases: Array<{ name: string; description: string; tasks: string[] }>;
  tasks: Array<{
    title: string;
    description: string;
    priority: string;
    phase?: string;
  }>;
  nextAction: string;
  acceptanceCriteria: string[];
  prompts: {
    cursor: string;
    lovable: string;
    gemini: string;
    claude: string;
    general: string;
  };
}

export interface ProjectWithRelations extends Project {
  phases?: ProjectPhase[];
  tasks?: Task[];
  uat_items?: UATItem[];
  bugs?: Bug[];
  enhancements?: Enhancement[];
  artifacts?: ProjectArtifact[];
  prompt_runs?: PromptRun[];
  context_versions?: ContextVersion[];
  test_runs?: TestRun[];
  activity_logs?: ActivityLog[];
}

export const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: "webapp", label: "Web App" },
  { value: "small_tool", label: "Small Tool" },
  { value: "software", label: "Software" },
  { value: "automation", label: "Automation" },
  { value: "landing_page", label: "Landing Page" },
  { value: "dashboard", label: "Dashboard" },
  { value: "other", label: "Other" },
];

export const PROJECT_STAGES: { value: ProjectStage; label: string; description: string }[] = [
  { value: "idea", label: "Idea", description: "Just starting out with a concept" },
  { value: "developing", label: "Developing", description: "Actively building features" },
  { value: "launch_ready", label: "Launch-ready Polishing", description: "Fine-tuning before launch" },
  { value: "post_launch", label: "Post-launch Enhancement", description: "Improving after launch" },
];

export const AI_TOOLS: { value: AITool; label: string }[] = [
  { value: "cursor", label: "Cursor" },
  { value: "lovable", label: "Lovable" },
  { value: "gemini", label: "Gemini" },
  { value: "claude", label: "Claude" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "other", label: "Other" },
];

export const UAT_STATUSES: { value: UATStatus; label: string; color: string }[] = [
  { value: "not_started", label: "Not Started", color: "bg-slate-100 text-slate-700" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
  { value: "passed", label: "Passed", color: "bg-green-100 text-green-700" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-700" },
  { value: "blocked", label: "Blocked", color: "bg-orange-100 text-orange-700" },
  { value: "needs_review", label: "Needs Review", color: "bg-yellow-100 text-yellow-700" },
  { value: "fixed", label: "Fixed", color: "bg-teal-100 text-teal-700" },
  { value: "verified", label: "Verified", color: "bg-emerald-100 text-emerald-700" },
  { value: "reopened", label: "Reopened", color: "bg-purple-100 text-purple-700" },
];

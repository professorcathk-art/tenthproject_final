export type CaseStudyCategory = "tooling" | "platform" | "content" | "saas" | "workflow_agent";

export const CASE_CATEGORIES: { value: CaseStudyCategory }[] = [
  { value: "tooling" },
  { value: "platform" },
  { value: "content" },
  { value: "saas" },
  { value: "workflow_agent" },
];

export type MemberPlan = "free" | "academy" | "enterprise";
export type VideoType = "youtube" | "mp4";

export interface LessonLink {
  title: string;
  url: string;
}

export interface LessonMaterial {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  file_name: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  level: string;
  duration_hours: number;
  published: boolean;
  created_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  video_url: string | null;
  video_type?: VideoType;
  content_md: string | null;
  html_content?: string | null;
  links?: LessonLink[];
  materials?: LessonMaterial[];
  quiz_data: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  quiz_score: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  issued_at: string;
  certificate_code: string;
  course?: Course;
}

export interface CaseHighlight {
  zh: string;
  en: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  category: CaseStudyCategory;
  categories?: CaseStudyCategory[];
  summary: string;
  breakdown_md: string;
  tech_stack: string[];
  website_url?: string | null;
  highlights?: CaseHighlight[];
  difficulty?: number;
  pitch_deck_url?: string | null;
  clone_prompt?: string | null;
  cover_image: string | null;
  author_id: string | null;
  is_published: boolean;
  created_at: string;
}

export function caseCategories(study: Pick<CaseStudy, "category" | "categories">): CaseStudyCategory[] {
  return study.categories?.length ? study.categories : [study.category];
}

export interface EnterpriseEnquiry {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  service_type: string;
  company_size: string | null;
  budget_range: string | null;
  project_description: string;
  status: "pending" | "contacted" | "closed";
  created_at: string;
}

export interface McpApiKey {
  id: string;
  user_id: string;
  project_id: string;
  key_prefix: string;
  key_hash: string;
  label: string;
  last_used_at: string | null;
  created_at: string;
}

export const SERVICE_TYPES = [
  { value: "custom_agent", zh: "客製 AI Agent 開發", en: "Custom AI Agent development" },
  { value: "workflow_automation", zh: "RPA 工作流自動化", en: "RPA workflow automation" },
  { value: "digital_transformation", zh: "數位轉型顧問", en: "Digital transformation advisory" },
  { value: "vibe_coding_training", zh: "團隊 AI 培訓", en: "Team AI enablement" },
  { value: "other", zh: "其他", en: "Other" },
];

export const BUDGET_RANGES = [
  { value: "30k_100k", zh: "HK$30,000 - HK$100,000", en: "HK$30,000 - HK$100,000" },
  { value: "100k_300k", zh: "HK$100,000 - HK$300,000", en: "HK$100,000 - HK$300,000" },
  { value: "300k_plus", zh: "HK$300,000+", en: "HK$300,000+" },
];

export interface Member {
  id: string;
  email: string;
  name: string;
  plan: MemberPlan;
  status: "active" | "paused";
  notes: string | null;
  created_at: string;
}

export function isPaidPlan(plan: string | null | undefined) {
  return plan === "academy" || plan === "enterprise";
}

export const COMPANY_SIZES = [
  { value: "1-10", zh: "1–10 人", en: "1–10 employees" },
  { value: "11-50", zh: "11–50 人", en: "11–50 employees" },
  { value: "51-200", zh: "51–200 人", en: "51–200 employees" },
  { value: "201-1000", zh: "201–1,000 人", en: "201–1,000 employees" },
  { value: "1000+", zh: "1,000 人以上", en: "1,000+ employees" },
];

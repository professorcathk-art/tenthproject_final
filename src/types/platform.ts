export type CaseStudyCategory = "tooling" | "platform" | "content" | "saas" | "workflow_agent";

export const CASE_CATEGORIES: { value: CaseStudyCategory }[] = [
  { value: "tooling" },
  { value: "platform" },
  { value: "content" },
  { value: "saas" },
  { value: "workflow_agent" },
];

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
  content_md: string | null;
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

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  category: CaseStudyCategory;
  categories?: CaseStudyCategory[];
  summary: string;
  breakdown_md: string;
  tech_stack: string[];
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
  { value: "custom_agent", zh: "客製 AI Agent", en: "Custom AI Agent" },
  { value: "workflow_automation", zh: "RPA 與流程自動化", en: "RPA & workflow automation" },
  { value: "digital_transformation", zh: "數碼轉型顧問", en: "Digital transformation advisory" },
  { value: "vibe_coding_training", zh: "團隊 Vibe Coding 培訓", en: "Team vibe coding workshops" },
  { value: "uat_qa_system", zh: "UAT 與品質系統", en: "UAT & QA system setup" },
];

export const BUDGET_RANGES = [
  { value: "under_100k", zh: "港幣 10 萬以下", en: "Under HK$100,000" },
  { value: "100k_500k", zh: "港幣 10–50 萬", en: "HK$100,000 – 500,000" },
  { value: "500k_1m", zh: "港幣 50–100 萬", en: "HK$500,000 – 1,000,000" },
  { value: "1m_plus", zh: "港幣 100 萬以上", en: "HK$1,000,000+" },
];

export interface Member {
  id: string;
  email: string;
  name: string;
  plan: "free" | "academy" | "enterprise";
  status: "active" | "paused";
  notes: string | null;
  created_at: string;
}

export const COMPANY_SIZES = [
  { value: "1-10", zh: "1–10 人", en: "1–10 employees" },
  { value: "11-50", zh: "11–50 人", en: "11–50 employees" },
  { value: "51-200", zh: "51–200 人", en: "51–200 employees" },
  { value: "201-1000", zh: "201–1,000 人", en: "201–1,000 employees" },
  { value: "1000+", zh: "1,000 人以上", en: "1,000+ employees" },
];

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
  category: "ai_agent" | "vibe_coding";
  summary: string;
  breakdown_md: string;
  tech_stack: string[];
  cover_image: string | null;
  author_id: string | null;
  is_published: boolean;
  created_at: string;
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
  { value: "workflow_automation", label: "Workflow Automation" },
  { value: "custom_agent", label: "Custom AI Agent" },
  { value: "digital_transformation", label: "Digital Transformation" },
  { value: "vibe_coding_training", label: "Vibe Coding Team Training" },
  { value: "uat_qa_system", label: "UAT & QA System Setup" },
];

export const BUDGET_RANGES = [
  { value: "under_10k", label: "Under $10,000" },
  { value: "10k_50k", label: "$10,000 – $50,000" },
  { value: "50k_100k", label: "$50,000 – $100,000" },
  { value: "100k_plus", label: "$100,000+" },
];

export const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

-- Tenth Project Platform Extension
-- Academy, Inspiration Vault, Enterprise, MCP

-- Course & LMS
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  level TEXT DEFAULT 'beginner',
  duration_hours INT DEFAULT 10,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  video_url TEXT,
  content_md TEXT,
  quiz_data JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  quiz_score INT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_code TEXT UNIQUE NOT NULL
);

-- Case Studies & Inspiration Vault
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ai_agent', 'vibe_coding')),
  summary TEXT NOT NULL,
  breakdown_md TEXT NOT NULL,
  tech_stack JSONB DEFAULT '[]',
  cover_image TEXT,
  author_id UUID,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enterprise Consulting
CREATE TABLE IF NOT EXISTS enterprise_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,
  company_size TEXT,
  budget_range TEXT,
  project_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MCP API Keys
CREATE TABLE IF NOT EXISTS mcp_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  label TEXT DEFAULT 'Cursor MCP',
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin role on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_mcp_api_keys_hash ON mcp_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);

-- RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_api_keys ENABLE ROW LEVEL SECURITY;

-- Public read for published courses and case studies
CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (published = true);
CREATE POLICY "Anyone can view lessons of published courses" ON lessons FOR SELECT
  USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND courses.published = true));
CREATE POLICY "Anyone can view published case studies" ON case_studies FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can verify certificates" ON certificates FOR SELECT USING (true);

-- Service role bypasses RLS; user policies for progress
CREATE POLICY "Users manage own progress" ON lesson_progress FOR ALL USING (true);
CREATE POLICY "Users view own certificates" ON certificates FOR SELECT USING (true);

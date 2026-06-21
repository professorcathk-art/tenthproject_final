-- Tenth Project MVP Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (demo MVP — no auth.users FK required for demo auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  default_ai_model TEXT DEFAULT 'openai',
  default_tool TEXT DEFAULT 'cursor',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  product_type TEXT NOT NULL DEFAULT 'webapp',
  stage TEXT NOT NULL DEFAULT 'idea',
  selected_tool TEXT NOT NULL DEFAULT 'cursor',
  target_audience TEXT,
  goal TEXT,
  website_url TEXT,
  github_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Artifacts
CREATE TABLE IF NOT EXISTS project_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('screenshot', 'url', 'doc', 'note', 'repo', 'figma', 'reference')),
  title TEXT NOT NULL,
  file_url TEXT,
  content_url TEXT,
  extracted_text TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Phases
CREATE TABLE IF NOT EXISTS project_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES project_phases(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  source TEXT DEFAULT 'ai',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UAT Items
CREATE TABLE IF NOT EXISTS uat_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  phase_id UUID REFERENCES project_phases(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  expected_result TEXT,
  actual_result TEXT,
  status TEXT NOT NULL DEFAULT 'not_started',
  severity TEXT DEFAULT 'medium',
  remark TEXT,
  evidence_url TEXT,
  owner TEXT,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UAT Remark History
CREATE TABLE IF NOT EXISTS uat_remarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uat_item_id UUID NOT NULL REFERENCES uat_items(id) ON DELETE CASCADE,
  remark TEXT NOT NULL,
  status_before TEXT,
  status_after TEXT,
  evidence_url TEXT,
  updated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bugs
CREATE TABLE IF NOT EXISTS bugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  linked_uat_item_id UUID REFERENCES uat_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  fix_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhancements
CREATE TABLE IF NOT EXISTS enhancements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'suggested',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompt Runs
CREATE TABLE IF NOT EXISTS prompt_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tool TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  prompt_type TEXT NOT NULL DEFAULT 'initial',
  generated_from_context_version UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Context Versions
CREATE TABLE IF NOT EXISTS context_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  summary_text TEXT,
  analysis_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Runs
CREATE TABLE IF NOT EXISTS test_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  browser TEXT DEFAULT 'chromium',
  screenshot_url TEXT,
  console_errors JSONB DEFAULT '[]',
  accessibility_warnings JSONB DEFAULT '[]',
  result_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_uat_items_project_id ON uat_items(project_id);
CREATE INDEX IF NOT EXISTS idx_bugs_project_id ON bugs(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_id ON activity_logs(project_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER uat_items_updated_at BEFORE UPDATE ON uat_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bugs_updated_at BEFORE UPDATE ON bugs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE uat_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE uat_remarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhancements ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (owner-only access)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage project artifacts" ON project_artifacts FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_artifacts.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage project phases" ON project_phases FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_phases.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage tasks" ON tasks FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage uat items" ON uat_items FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = uat_items.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage uat remarks" ON uat_remarks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM uat_items JOIN projects ON projects.id = uat_items.project_id
    WHERE uat_items.id = uat_remarks.uat_item_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage bugs" ON bugs FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = bugs.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage enhancements" ON enhancements FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = enhancements.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage prompt runs" ON prompt_runs FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = prompt_runs.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage context versions" ON context_versions FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = context_versions.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage test runs" ON test_runs FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = test_runs.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage activity logs" ON activity_logs FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = activity_logs.project_id AND projects.user_id = auth.uid()));

-- Storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload project files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own project files" ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own project files" ON storage.objects FOR DELETE
  USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed demo profile for MVP demo auth
INSERT INTO profiles (id, email, name, default_ai_model, default_tool)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@tenthproject.app',
  'Demo User',
  'openai',
  'cursor'
)
ON CONFLICT (id) DO NOTHING;

-- AI site-audit suggestions + richer test-run telemetry

ALTER TABLE test_runs
  ADD COLUMN IF NOT EXISTS http_status INTEGER,
  ADD COLUMN IF NOT EXISTS duration_ms INTEGER;

CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  test_run_id UUID REFERENCES test_runs(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('bug', 'ui_ux', 'performance', 'feature')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  approved BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed', 'applied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_suggestions_project_idx ON ai_suggestions (project_id, status, created_at DESC);

ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage ai suggestions" ON ai_suggestions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = ai_suggestions.project_id AND projects.user_id = auth.uid()
  ));

CREATE TRIGGER ai_suggestions_updated_at BEFORE UPDATE ON ai_suggestions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

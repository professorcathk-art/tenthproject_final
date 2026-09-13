CREATE TABLE IF NOT EXISTS case_study_marks (
  user_id UUID NOT NULL,
  case_slug TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('saved', 'passed')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, case_slug)
);

CREATE INDEX IF NOT EXISTS case_study_marks_user_status_idx
  ON case_study_marks (user_id, status);

ALTER TABLE case_study_marks ENABLE ROW LEVEL SECURITY;

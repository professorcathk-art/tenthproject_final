ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS technical_checklist JSONB NOT NULL DEFAULT '[]'::jsonb;

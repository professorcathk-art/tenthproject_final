CREATE TABLE IF NOT EXISTS webinar_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE webinar_signups ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_webinar_signups_created_at ON webinar_signups (created_at DESC);

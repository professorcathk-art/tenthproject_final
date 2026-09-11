-- Keep case-study taxonomy open (tooling, platform, content, saas, workflow_agent)
ALTER TABLE case_studies DROP CONSTRAINT IF EXISTS case_studies_category_check;

-- Optional slot note; the app also writes the slot into project_description
ALTER TABLE enterprise_enquiries ADD COLUMN IF NOT EXISTS preferred_slot TEXT;

-- Allow professional case-study taxonomy (tooling, platform, content, saas, workflow_agent)
ALTER TABLE case_studies DROP CONSTRAINT IF EXISTS case_studies_category_check;

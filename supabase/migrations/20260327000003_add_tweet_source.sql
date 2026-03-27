-- Add source tracking columns to wait_reports
ALTER TABLE wait_reports ADD COLUMN source_type TEXT NOT NULL DEFAULT 'user';
ALTER TABLE wait_reports ADD COLUMN source_text TEXT;
ALTER TABLE wait_reports ADD COLUMN source_url TEXT;

-- Index for filtering by source
CREATE INDEX idx_reports_source ON wait_reports(source_type);

-- Backfill existing twitter-ingested rows
UPDATE wait_reports
SET source_type = 'twitter',
    source_text = SUBSTRING(user_agent FROM 'twitter:[^:]+:(.+)'),
    source_url = 'https://x.com/i/status/' || SUBSTRING(ip_hash FROM 'tweet:(.+)')
WHERE ip_hash LIKE 'tweet:%';

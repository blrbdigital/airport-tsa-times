-- Airport TSA Times - Initial Schema

-- Airports table
CREATE TABLE airports (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkpoints table
CREATE TABLE checkpoints (
  id TEXT PRIMARY KEY,
  airport_id TEXT REFERENCES airports(id) ON DELETE CASCADE,
  airport_code TEXT NOT NULL,
  name TEXT NOT NULL,
  terminal TEXT NOT NULL,
  is_precheck BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkpoints_airport ON checkpoints(airport_id);
CREATE INDEX idx_checkpoints_code ON checkpoints(airport_code);

-- Wait time reports
CREATE TABLE wait_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airport_code TEXT NOT NULL,
  checkpoint_id TEXT REFERENCES checkpoints(id) ON DELETE CASCADE,
  wait_minutes INTEGER NOT NULL CHECK (wait_minutes >= 0 AND wait_minutes <= 300),
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX idx_reports_airport ON wait_reports(airport_code);
CREATE INDEX idx_reports_checkpoint ON wait_reports(checkpoint_id);
CREATE INDEX idx_reports_time ON wait_reports(reported_at DESC);
CREATE INDEX idx_reports_recent ON wait_reports(airport_code, reported_at DESC);

-- View: current wait times (reports within last 4 hours)
CREATE OR REPLACE VIEW current_wait_times AS
SELECT
  a.code,
  a.name,
  a.city,
  a.state,
  COALESCE(AVG(wr.wait_minutes)::INTEGER, 0) AS avg_wait,
  COALESCE(MIN(wr.wait_minutes), 0) AS min_wait,
  COALESCE(MAX(wr.wait_minutes), 0) AS max_wait,
  COUNT(wr.id)::INTEGER AS report_count,
  MAX(wr.reported_at) AS last_report
FROM airports a
LEFT JOIN wait_reports wr
  ON wr.airport_code = a.code
  AND wr.reported_at > NOW() - INTERVAL '4 hours'
GROUP BY a.id, a.code, a.name, a.city, a.state;

-- View: checkpoint wait times (reports within last 4 hours)
CREATE OR REPLACE VIEW checkpoint_wait_times AS
SELECT
  c.id,
  c.airport_code,
  c.name,
  c.terminal,
  c.is_precheck,
  COALESCE(AVG(wr.wait_minutes)::INTEGER, 0) AS avg_wait,
  COUNT(wr.id)::INTEGER AS report_count,
  MAX(wr.reported_at) AS last_report
FROM checkpoints c
LEFT JOIN wait_reports wr
  ON wr.checkpoint_id = c.id
  AND wr.reported_at > NOW() - INTERVAL '4 hours'
GROUP BY c.id, c.airport_code, c.name, c.terminal, c.is_precheck;

-- RLS Policies
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE wait_reports ENABLE ROW LEVEL SECURITY;

-- Everyone can read airports and checkpoints
CREATE POLICY "airports_read" ON airports FOR SELECT USING (true);
CREATE POLICY "checkpoints_read" ON checkpoints FOR SELECT USING (true);

-- Everyone can read reports
CREATE POLICY "reports_read" ON wait_reports FOR SELECT USING (true);

-- Anyone can insert reports (anonymous submissions)
CREATE POLICY "reports_insert" ON wait_reports FOR INSERT WITH CHECK (true);

-- Rate limiting function (max 5 reports per IP per hour)
CREATE OR REPLACE FUNCTION check_report_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM wait_reports
    WHERE ip_hash = NEW.ip_hash
    AND reported_at > NOW() - INTERVAL '1 hour'
  ) >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded: max 5 reports per hour';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_rate_limit
  BEFORE INSERT ON wait_reports
  FOR EACH ROW
  EXECUTE FUNCTION check_report_rate_limit();

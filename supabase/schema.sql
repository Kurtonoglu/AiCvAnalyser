-- ============================================================
-- CV Analyser — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- Table: rate_limits
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rate_limits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address  TEXT        NOT NULL,
  endpoint    TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON rate_limits (ip_address, endpoint, created_at);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert rate_limits"
  ON rate_limits FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon can select rate_limits"
  ON rate_limits FOR SELECT TO anon USING (true);

CREATE POLICY "anon can delete rate_limits"
  ON rate_limits FOR DELETE TO anon USING (true);


-- ------------------------------------------------------------
-- Table: analysis_cache
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analysis_cache (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  content_hash  TEXT        UNIQUE NOT NULL,
  result        JSONB       NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_cache_hash
  ON analysis_cache (content_hash);

ALTER TABLE analysis_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert analysis_cache"
  ON analysis_cache FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon can select analysis_cache"
  ON analysis_cache FOR SELECT TO anon USING (true);

CREATE POLICY "anon can update analysis_cache"
  ON analysis_cache FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon can delete analysis_cache"
  ON analysis_cache FOR DELETE TO anon USING (true);


-- ------------------------------------------------------------
-- Table: analytics
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT        NOT NULL,
  file_type     TEXT,
  overall_score INTEGER,
  job_title     TEXT,
  match_score   INTEGER,
  cache_hit     BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert analytics"
  ON analytics FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon can select analytics"
  ON analytics FOR SELECT TO anon USING (true);

-- PostgreSQL Performance Indexing & Growth Tasks Migration
-- 1. Create GrowthTask table
CREATE TABLE IF NOT EXISTS growth_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  recommendation_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'To Do', -- 'To Do', 'In Progress', 'Implemented', 'Dismissed'
  impact TEXT NOT NULL DEFAULT 'High',  -- 'High', 'Medium', 'Quick Win'
  category TEXT NOT NULL DEFAULT 'Content Structure',
  target_engine TEXT NOT NULL DEFAULT 'All Engines',
  estimated_lift TEXT NOT NULL DEFAULT '+5-10 pts',
  implemented_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes on growth_tasks
CREATE INDEX IF NOT EXISTS idx_growth_tasks_brand_id ON growth_tasks(brand_id);
CREATE INDEX IF NOT EXISTS idx_growth_tasks_status ON growth_tasks(status);

-- Enable RLS on growth_tasks
ALTER TABLE growth_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view growth tasks for their brands"
  ON growth_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = growth_tasks.brand_id
      AND (brands.user_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can insert growth tasks for their brands"
  ON growth_tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = growth_tasks.brand_id
      AND (brands.user_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can update growth tasks for their brands"
  ON growth_tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = growth_tasks.brand_id
      AND (brands.user_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can delete growth tasks for their brands"
  ON growth_tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = growth_tasks.brand_id
      AND (brands.user_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

-- 2. Add brand_id column to prompt_results if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_results' AND column_name = 'brand_id'
  ) THEN
    ALTER TABLE prompt_results ADD COLUMN brand_id UUID REFERENCES brands(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Populate brand_id from prompts relation if unpopulated
UPDATE prompt_results pr
SET brand_id = p.brand_id
FROM prompts p
WHERE pr.prompt_id = p.id AND pr.brand_id IS NULL;

-- 3. Standard Compound B-tree Index on PromptResult (brand_id, execution_timestamp DESC)
-- Speeds up time-series chart filters and window queries
CREATE INDEX IF NOT EXISTS idx_prompt_results_brand_timestamp_desc
  ON prompt_results (brand_id, execution_timestamp DESC);

-- 4. GIN Index on JSONB Columns for exact equality & containment queries (@>)
CREATE INDEX IF NOT EXISTS idx_prompt_results_response_payload_gin
  ON prompt_results USING GIN (response_payload jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_prompt_results_citations_gin
  ON prompt_results USING GIN (citations jsonb_path_ops);

-- 5. B-tree Expression Indexes for known, highly-queried search patterns in JSONB:
-- Fast lookup by model version identifier in response payload
CREATE INDEX IF NOT EXISTS idx_prompt_results_payload_model_expr
  ON prompt_results (((response_payload->>'model')));

-- Fast lookup / sort by token usage inside response payload
CREATE INDEX IF NOT EXISTS idx_prompt_results_payload_tokens_expr
  ON prompt_results ((((response_payload->'usage'->>'total_tokens')::integer)));

-- Fast lookup for finish reason (e.g. 'stop', 'length')
CREATE INDEX IF NOT EXISTS idx_prompt_results_payload_finish_reason
  ON prompt_results (((response_payload->'choices'->0->>'finish_reason')));

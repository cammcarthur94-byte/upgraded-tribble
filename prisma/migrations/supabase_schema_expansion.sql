-- Supabase Schema Expansion Migration
-- Adds 'aliases' and 'exact_urls' to 'brands' table
-- Creates 'competitors' table for advanced relational competitor tracking

-- 1. Expand brands table
ALTER TABLE IF EXISTS brands
ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS exact_urls TEXT[] DEFAULT '{}';

-- 2. Create competitors table
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  competitor_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create index for fast foreign key lookups
CREATE INDEX IF NOT EXISTS idx_competitors_brand_id ON competitors(brand_id);

-- 4. Enable Row Level Security (RLS) if enabled on brands
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

-- Allow users to manage competitors for their own brands
CREATE POLICY "Users can view competitors for their brands"
  ON competitors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = competitors.brand_id
      AND (brands.user_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can insert competitors for their brands"
  ON competitors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = competitors.brand_id
      AND (brands.user_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can update competitors for their brands"
  ON competitors FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = competitors.brand_id
      AND (brands.user_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can delete competitors for their brands"
  ON competitors FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = competitors.brand_id
      AND (brands.user_id = auth.uid()::text OR auth.role() = 'service_role')
    )
  );

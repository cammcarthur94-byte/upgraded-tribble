-- Migration: Create prompt_opportunities table
CREATE TABLE IF NOT EXISTS prompt_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    suggested_prompt TEXT NOT NULL,
    intent_category VARCHAR(50) NOT NULL CHECK (intent_category IN ('Discovery', 'Consideration', 'Commercial')),
    topic_cluster TEXT NOT NULL,
    estimated_relevance INTEGER NOT NULL CHECK (estimated_relevance >= 0 AND estimated_relevance <= 100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Performance Indexes for aggregation and filtering
CREATE INDEX IF NOT EXISTS idx_prompt_opportunities_brand_id ON prompt_opportunities(brand_id);
CREATE INDEX IF NOT EXISTS idx_prompt_opportunities_status ON prompt_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_prompt_opportunities_topic_cluster ON prompt_opportunities(topic_cluster);
CREATE INDEX IF NOT EXISTS idx_prompt_opportunities_created_at ON prompt_opportunities(created_at DESC);

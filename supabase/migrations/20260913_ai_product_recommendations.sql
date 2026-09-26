-- Migration: Create ai_product_recommendations table
CREATE TABLE IF NOT EXISTS ai_product_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    prompt_result_id UUID REFERENCES prompt_results(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    engine VARCHAR(50) NOT NULL, -- 'chatgpt', 'perplexity', 'gemini', 'claude'
    product_name TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    sku_or_identifier TEXT,
    rank_position INTEGER NOT NULL,
    price_mentioned TEXT,
    sentiment VARCHAR(20) DEFAULT 'neutral', -- 'positive', 'neutral', 'negative'
    raw_context TEXT NOT NULL,
    extracted_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Performance Indexes for aggregation and filtering
CREATE INDEX IF NOT EXISTS idx_ai_product_recommendations_prompt_id ON ai_product_recommendations(prompt_id);
CREATE INDEX IF NOT EXISTS idx_ai_product_recommendations_brand_id ON ai_product_recommendations(brand_id);
CREATE INDEX IF NOT EXISTS idx_ai_product_recommendations_product_name ON ai_product_recommendations(product_name);
CREATE INDEX IF NOT EXISTS idx_ai_product_recommendations_engine ON ai_product_recommendations(engine);
CREATE INDEX IF NOT EXISTS idx_ai_product_recommendations_extracted_at ON ai_product_recommendations(extracted_at DESC);

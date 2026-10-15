export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
}

export interface BrandData {
  id: string;
  userId: string;
  brandName: string;
  domain: string;
  aliases?: string[];
  exactUrls?: string[];
  competitors?: string[];
  competitorRecords?: CompetitorItem[];
}

export interface CompetitorItem {
  id: string;
  brandId: string;
  competitorName: string;
  domain: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type SupportedEngine =
  | "chatgpt"
  | "claude"
  | "gemini"
  | "perplexity";

export type PromptResultStatus =
  | "queued"
  | "running"
  | "completed"
  | "partial_success"
  | "failed";

export interface ErrorLogItem {
  message: string;
  statusCode?: number;
  retryCount?: number;
  timestamp: string;
  engine?: SupportedEngine | string;
}

export type PromptType =
  | "Recommendation"
  | "Direct Query"
  | "Comparison"
  | "Buying Guide"
  | "Troubleshooting"
  | "General";

export type BrandStatus = "Branded" | "Unbranded";

export type SearchIntent =
  | "Commercial"
  | "Transactional"
  | "Informational"
  | "Navigational";

export type PromptCategory =
  | "Product Comparison"
  | "Top of Funnel Discovery"
  | "Buying Guide"
  | "Feature Reviews"
  | "Competitor Alternatives";

export interface PromptItem {
  id: string;
  brandId: string;
  queryText: string;
  frequency: "daily" | "weekly";
  targetEngines: SupportedEngine[];
  promptType?: PromptType;
  brandedType?: BrandStatus;
  searchIntent?: SearchIntent;
  promptCategory?: PromptCategory;
  lastExecutedAt?: string | null;
  latestStatus?: PromptResultStatus;
  latestErrorLog?: ErrorLogItem[];
  failedEngines?: SupportedEngine[];
  geoMarket?: string;
  performanceRank?: {
    label: string;
    variant: "green" | "blue" | "gray";
  };
  createdAt: string;
  updatedAt: string;
}

export interface CitationItem {
  url: string;
  domain: string;
  title?: string;
  position?: number;
}

export interface PromptResultItem {
  id: string;
  promptId: string;
  engineName: SupportedEngine | string;
  rawResponseText: string;
  responsePayload?: Record<string, unknown>;
  citations?: CitationItem[];
  status?: PromptResultStatus;
  errorLog?: ErrorLogItem | Record<string, unknown>;
  retryCount?: number;
  executionTimestamp: string;
}

export type MentionPositionContext =
  | "top_recommendation"
  | "bullet_list"
  | "passing_mention"
  | "conclusion";

export type SentimentType = "positive" | "neutral" | "negative";

export interface BrandMentionData {
  id?: string;
  promptResultId?: string;
  brandId?: string;
  isCompetitor: boolean;
  isNewCompetitor?: boolean;
  entityName: string;
  mentionCount: number;
  positionRank: number;
  positionContext: MentionPositionContext;
  sentiment?: SentimentType;
  sentimentReasoning?: string;
}

export interface CitationDomainData {
  id?: string;
  promptResultId?: string;
  url: string;
  domain: string;
  isBrandOwned: boolean;
}

export interface DiscoveredCompetitorData {
  name: string;
  domain: string;
  mentionCount: number;
}

export interface ParsedResponseData {
  mentions: BrandMentionData[];
  citations: CitationDomainData[];
  discoveredCompetitors?: DiscoveredCompetitorData[];
}

export interface VisibilityScoreBreakdown {
  visibilityScore: number; // 0.0 - 100.0
  presenceScore: number;   // 0.0 - 40.0
  prominenceScore: number; // 0.0 - 25.0
  citationsScore: number;  // 0.0 - 20.0
  sentimentScore: number;  // 0.0 - 15.0
  shareOfVoice: number;    // 0.0 - 100.0%
  positiveMentions: number;
  neutralMentions: number;
  negativeMentions: number;
  totalCitations: number;
  bestPerformingEngine: string;
}

export interface BrandDailyScoreData {
  id?: string;
  brandId: string;
  date: string;
  visibilityScore: number;
  shareOfVoice: number;
  positiveMentions: number;
  neutralMentions: number;
  negativeMentions: number;
  totalCitations: number;
  bestPerformingEngine: string;
}

// Chart Visualization Types
export interface SovTrajectoryPoint {
  date: string;
  sov: number;
  brandMentions: number;
  competitorMentions: number;
  competitor1Name?: string;
  competitor1Sov?: number;
  competitor2Name?: string;
  competitor2Sov?: number;
}

export type DomainCategory =
  | "Community / UGC"
  | "Editorial Press"
  | "Affiliate Review"
  | "Owned"
  | "Industry Authority";

export interface DomainCitationItem {
  domain: string;
  count: number;
  isBrandOwned: boolean;
  percentage: number;
  category?: DomainCategory;
}

export interface EnginePerformanceMetric {
  engine: string;
  displayName: string;
  visibilityScore: number; // 0 - 100
  appearanceRate: number;  // % of prompts brand was cited/mentioned
  sentimentScore: number;  // % positive
  topPickWinRate?: number; // % of times brand was top pick (#1)
}

export interface SentimentDistributionData {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
}

export interface EngineSentimentItem {
  engine: string;
  displayName: string;
  positive: number;
  neutral: number;
  negative: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
}

export interface SentimentSnippetItem {
  id: string;
  promptQuery: string;
  engineName: SupportedEngine | string;
  sentiment: "positive" | "neutral" | "negative";
  snippet: string;
  reasoning?: string;
  date: string;
}

export interface CompetitorBenchmarkItem {
  id: string;
  name: string;
  domain: string;
  mentionCount: number;
  shareOfVoice: number; // 0 - 100%
  sentiment: "positive" | "neutral" | "negative";
  isAiDiscovered?: boolean;
  firstDetectedAt?: string;
}

export interface QueryIntentFunnelStage {
  stageId: "discovery" | "consideration" | "commercial";
  stageName: string;
  description: string;
  promptCount: number;
  promptPercentage: number;
  visibilityScore: number; // 0 - 100
  winRate: number; // 0 - 100%
  topCompetitor: {
    name: string;
    visibilityScore: number;
  };
  sampleQueries: string[];
}

export interface DomainTypeBreakdown {
  ugcForumsCount: number;
  ugcForumsPercentage: number;
  editorialPressCount: number;
  editorialPressPercentage: number;
  ownedCount: number;
  ownedPercentage: number;
  affiliateReviewCount: number;
  affiliateReviewPercentage: number;
  totalCategorized: number;
}

export interface CompetitorEngineMatrixRow {
  brandName: string;
  domain: string;
  isCurrentBrand: boolean;
  overallSoV: number;
  chatgptScore: number;
  perplexityScore: number;
  geminiScore: number;
  claudeScore: number;
  leadingEngines: string[];
}

export interface DashboardAnalyticsData {
  breakdown: VisibilityScoreBreakdown;
  dailyScore?: BrandDailyScoreData;
  trajectory: SovTrajectoryPoint[];
  topDomains: DomainCitationItem[];
  engineMetrics: EnginePerformanceMetric[];
  sentimentDist: SentimentDistributionData;
  competitorBenchmarks?: CompetitorBenchmarkItem[];
  activeCompetitorNames?: string[];
  executionSummary?: {
    promptCount: number;
    engineCount: number;
    totalRuns: number;
  };
  periodDeltaSoV?: number;
  netSentiment?: number;
  ownedCitationsCount?: number;
  totalCitationsCount?: number;
  ownedCitationsPercentage?: number;
  growthOpportunity?: {
    tag: string;
    copy: string;
    taskId?: string;
  };
  sentimentSnippets?: SentimentSnippetItem[];
  engineSentiments?: EngineSentimentItem[];
  funnelAnalysis?: QueryIntentFunnelStage[];
  domainTypeBreakdown?: DomainTypeBreakdown;
  competitorEngineMatrix?: CompetitorEngineMatrixRow[];
}

// Growth Opportunities Types
export type OpportunityImpact = "High" | "Medium" | "Quick Win";
export type OpportunityCategory =
  | "Content Structure"
  | "Citations & PR"
  | "Sentiment & Perception"
  | "Schema & Technical";

export interface GrowthOpportunity {
  id: string;
  brandId: string;
  title: string;
  description: string;
  impact: OpportunityImpact;
  targetEngine: SupportedEngine | "All Engines";
  category: OpportunityCategory;
  estimatedScoreImpact: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
}

// Prompt Analysis Types
export interface EngineRunResult {
  id: string;
  engineName: SupportedEngine;
  rawResponseText: string;
  latencyMs: number;
  sentiment: SentimentType;
  mentions: BrandMentionData[];
  citations: CitationDomainData[];
}

export interface PromptRunInspection {
  promptId: string;
  promptQuery: string;
  runId: string;
  executionTimestamp: string;
  results: EngineRunResult[];
}

// Competitor Prompt Analysis Types
export interface PromptRankingItem {
  rank: number;
  name: string;
  domain?: string;
  isCompetitor: boolean;
  visibility: string;
  visibilityPct: number;
  sov: string;
  sovPct: number;
  sentimentScore: number;
  avgPosition: string;
}

export interface PromptHeatmapRow {
  name: string;
  domain?: string;
  isCompetitor: boolean;
  scores: Record<string, { pctString: string; pct: number }>;
}

export interface PromptMentionSourceItem {
  rank: number;
  name: string;
  domain?: string;
  isCompetitor: boolean;
  mentions: number;
  sov: string;
  sovPct: number;
}

export type PromptCitationType =
  | "Social"
  | "Forum"
  | "Competitor"
  | "Owned"
  | "Editorial"
  | "Other";

export interface PromptCitationSourceItem {
  rank: number;
  domain: string;
  count: number;
  percentage: string;
  percentageVal: number;
  isBrandOwned: boolean;
  type: PromptCitationType;
}

export interface PromptResponseHistoryItem {
  id: string;
  engineName: SupportedEngine;
  responseText: string;
  isMentioned: boolean;
  positionRank?: number | null;
  lastRan: string;
  mentions: {
    name: string;
    isCompetitor: boolean;
  }[];
}

export interface PromptAnalysisData {
  prompts: PromptItem[];
  activePrompt: PromptItem | null;
  inspection: PromptRunInspection | null;
  rankings: PromptRankingItem[];
  heatmap: PromptHeatmapRow[];
  mentionSources: PromptMentionSourceItem[];
  citationSources: PromptCitationSourceItem[];
  responseHistory: PromptResponseHistoryItem[];
  engines: SupportedEngine[];
}

// Citations Explorer Types
export interface CitationInstance {
  url: string;
  promptQuery: string;
  promptId: string;
  engineName: SupportedEngine;
  contextSnippet: string;
  timestamp: string;
  sentiment?: SentimentType;
}

export interface DomainIntelligenceItem {
  domain: string;
  isBrandOwned: boolean;
  citationCount: number;
  referencingEngines: SupportedEngine[];
  firstSeen: string;
  lastSeen: string;
  instances: CitationInstance[];
  sentiment?: SentimentType;
  sentimentScore?: number; // % positive (e.g., 78)
  trendChange?: number; // weekly momentum % (e.g., +15)
  competitorCitations?: Record<string, number>;
  urlSnapshotCount?: number;
}

export interface QueryIntentCluster {
  id: string;
  clusterName: string;
  intentPhase: "Comparison & Durability" | "Sizing & Fit" | "Discovery & Recommendations" | "Product Reviews";
  queryCount: number;
  totalCitations: number;
  brandSoV: number;
  topDomains: { domain: string; count: number; percentage: number }[];
  sampleQueries: string[];
}

export interface MissedOpportunityDomain {
  domain: string;
  authorityScore: number;
  competitorsCited: string[];
  competitorCitationCount: number;
  recommendedAction: string;
}

export interface CompetitorCitationShare {
  brandName: string;
  citationCount: number;
  percentage: number;
  isCurrentBrand?: boolean;
}

export interface ContentGapRecommendation {
  title: string;
  description: string;
  actionText: string;
  suggestedActionType: string;
}

export interface MetricTrendPoint {
  date: string;
  value: number;
}

export interface MetricTrendSeries {
  total: number;
  delta: number;
  timeframe: string;
  data: MetricTrendPoint[];
  yAxisTicks?: number[];
}

export interface CitationsExplorerSummary {
  totalSourcesCited: number;
  uniqueReferringDomains: number;
  ownedSourceRatio: number;
  domains: DomainIntelligenceItem[];
  competitorShare?: CompetitorCitationShare[];
  missedOpportunities?: MissedOpportunityDomain[];
  intentClusters?: QueryIntentCluster[];
  contentGapRecommendation?: ContentGapRecommendation;
  mentionsTrend?: MetricTrendSeries;
  citationsTrend?: MetricTrendSeries;
}

// AI Shopping & Product Visibility Types
export interface AiProductRecommendation {
  id: string;
  prompt_id: string;
  prompt_result_id?: string;
  brand_id?: string;
  engine: string; // 'chatgpt' | 'perplexity' | 'gemini' | 'claude'
  product_name: string;
  brand_name: string;
  sku_or_identifier?: string | null;
  rank_position: number;
  price_mentioned?: string | null;
  sentiment?: "positive" | "neutral" | "negative" | string | null;
  raw_context: string;
  extracted_at: string;
}

export interface ProductContextQuote {
  engine: SupportedEngine;
  rankPosition: number;
  quote: string;
  price?: string;
  promptId?: string;
  promptText?: string;
}

export interface ShoppingProductPromptRef {
  promptId: string;
  promptText: string;
  engine: SupportedEngine;
  rankPosition: number;
}

export interface ProductShelfItem {
  id: string;
  productName: string;
  brandName: string;
  isCurrentBrand: boolean;
  skuOrIdentifier?: string;
  engines: SupportedEngine[];
  avgRankPosition: number;
  bestRankPosition: number;
  inclusionFrequencyPct: number;
  totalMentions: number;
  priceMentioned?: string;
  sentiment: SentimentType;
  rawContexts: ProductContextQuote[];
  prompts?: ShoppingProductPromptRef[];
  imageUrl?: string;
}

export interface BrandShelfShare {
  brandName: string;
  isCurrentBrand: boolean;
  productCount: number;
  sharePercentage: number;
  totalRecommendations: number;
}

export interface ShoppingCompetitorRow {
  rank: number;
  brandName: string;
  domain?: string;
  sharePercentage: number;
  productCount: number;
  isCurrentBrand: boolean;
}

export interface ShoppingVendorRow {
  rank: number;
  vendorName: string;
  domain?: string;
  sharePercentage: number;
}

export interface ShoppingVisibilityPoint {
  date: string;
  value: number;
}

export interface ShoppingProductCardItem {
  id: string;
  productName: string;
  brandName: string;
  category: string;
  engine: SupportedEngine;
  rating: number;
  price: string;
  merchant: string;
  occurrences: number;
  imageUrl?: string;
  isCurrentBrand: boolean;
  isCompetitor: boolean;
  citedUrl?: string;
  prompts?: ShoppingProductPromptRef[];
}

export interface ShoppingCategoryCluster {
  category: string;
  productCount: number;
  occurrences: number;
  rating: number;
}

export interface ShoppingPromptProduct {
  id: string;
  productName: string;
  brandName: string;
  isCurrentBrand: boolean;
  engine: SupportedEngine;
  engines?: SupportedEngine[];
  rankPosition: number;
  priceMentioned?: string;
  sentiment?: SentimentType;
  quote?: string;
  skuOrIdentifier?: string;
  imageUrl?: string;
}

export interface ShoppingPromptRow {
  id: string;
  promptText: string;
  engines: SupportedEngine[];
  productCount: number;
  topBrand: string;
  products?: ShoppingPromptProduct[];
}

export interface ShoppingAnalyticsSummary {
  totalProductsTracked: number;
  brandShareOfShelfPct: number;
  topRankedProduct: string;
  averagePriceMentioned: string;
  shelfShareBreakdown: BrandShelfShare[];
  products: ProductShelfItem[];
  availablePrompts: Array<{ id: string; queryText: string }>;
  selectedPromptId?: string;

  // 3-Tab Architecture Data
  brandsView: {
    productSharePct: number;
    productShareDelta: number;
    competitors: ShoppingCompetitorRow[];
    visibilityPct: number;
    visibilityDelta: number;
    visibilityTrend: ShoppingVisibilityPoint[];
    vendors: ShoppingVendorRow[];
  };
  productsView: {
    productCards: ShoppingProductCardItem[];
    categories: ShoppingCategoryCluster[];
  };
  promptsView: {
    prompts: ShoppingPromptRow[];
    totalCount: number;
  };
}

// Prompt Discovery Engine & Triage Types
export type OpportunityIntent = "Discovery" | "Consideration" | "Commercial";
export type OpportunityStatus = "pending" | "accepted" | "dismissed";

export interface PromptOpportunity {
  id: string;
  brandId: string;
  suggestedPrompt: string;
  intentCategory: OpportunityIntent;
  topicCluster: string;
  estimatedRelevance: number; // 0 - 100
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MinePromptOpportunitiesInput {
  brandId: string;
  brandName: string;
  competitorNames: string[];
  catalogContext: string | string[];
}


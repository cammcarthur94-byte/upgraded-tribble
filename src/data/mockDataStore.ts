/**
 * Single Source of Truth for Recomnd v1.0
 * Centralized data store consolidating user branding, 30-day global metrics,
 * AI engine metrics (50 runs), shopping catalog shares, and synchronized prompts.
 */

import { UserProfile, SupportedEngine, PromptItem } from "@/lib/types";

// ==========================================
// 1. UNIFIED USER & APP BRANDING
// ==========================================
export const UNIFIED_USER_PROFILE: UserProfile = {
  id: "user-1",
  email: "cam@recomnd.ai",
  fullName: "Cameron M.",
  role: "OWNER",
};

export const APP_METADATA = {
  version: "Recomnd v1.0",
  title: "Recomnd v1.0 — Enterprise AI Visibility Tracking (GEO/AEO)",
  description:
    "Comprehensive competitive benchmarking and generative perception for brands across AI models.",
};

// ==========================================
// 2. SYNCHRONIZED GLOBAL METRICS (30-DAY DEFAULT)
// ==========================================
export const GLOBAL_METRICS_30D = {
  aeoScore: 70,
  aeoTrend: "+3.2%",
  shareOfVoice: 42.5,
  sovTrend: "+4.2%",
  referringDomains: 51,
  referringDomainsTrend: "+14 this mo",
  totalSourcesCited: 342,
  totalSourcesTrend: "+18% this wk",
  totalMentions: 9518,
  totalMentionsTrend: "+514",
  totalCitations: 8396,
  totalCitationsTrend: "+487",
  ownedSourceRatio: 28,
  thirdPartySourceRatio: 72,
  sentimentBreakdown: {
    positive: 6092,
    neutral: 2570,
    negative: 856,
    total: 9518,
    positivePct: 64,
    neutralPct: 27,
    negativePct: 9,
    netSentiment: 55, // 64 - 9 = +55
  },
};

// ==========================================
// 3. AI ENGINE METRICS (50 RUNS STANDARDIZED)
// ==========================================
export interface StandardizedEngineMetric {
  engine: SupportedEngine;
  displayName: string;
  subtitle: string;
  status: "live" | "tracking";
  totalRuns: number;
  inclusionCount: number;
  brandInclusionRate: number; // percentage
  score: number;
  scoreTrend: string;
  winRateVsCompetitors: number;
  shareOfVoice: number;
  avgMentionPosition: number;
  sentimentScore: number;
  citationsPerAnswer: number;
  topCitedDomains: Array<{ domain: string; count: number }>;
}

export const ENGINE_METRICS_50_RUNS: Record<SupportedEngine, StandardizedEngineMetric> = {
  perplexity: {
    engine: "perplexity",
    displayName: "Perplexity AI",
    subtitle: "Sonar Pro • Live Web Search",
    status: "live",
    totalRuns: 50,
    inclusionCount: 44,
    brandInclusionRate: 88,
    score: 88,
    scoreTrend: "+3",
    winRateVsCompetitors: 78,
    shareOfVoice: 62,
    avgMentionPosition: 1.4,
    sentimentScore: 79,
    citationsPerAnswer: 5.4,
    topCitedDomains: [
      { domain: "reddit.com", count: 24 },
      { domain: "runnersworld.com", count: 18 },
    ],
  },
  chatgpt: {
    engine: "chatgpt",
    displayName: "OpenAI ChatGPT",
    subtitle: "GPT-4o Search • Hybrid",
    status: "live",
    totalRuns: 50,
    inclusionCount: 40,
    brandInclusionRate: 80,
    score: 82,
    scoreTrend: "+2",
    winRateVsCompetitors: 65,
    shareOfVoice: 54,
    avgMentionPosition: 1.8,
    sentimentScore: 65,
    citationsPerAnswer: 3.2,
    topCitedDomains: [
      { domain: "womenshealthmag.com", count: 16 },
      { domain: "menshealth.com", count: 12 },
    ],
  },
  gemini: {
    engine: "gemini",
    displayName: "Google Gemini",
    subtitle: "Gemini 2.5 + AI Overviews",
    status: "live",
    totalRuns: 50,
    inclusionCount: 32,
    brandInclusionRate: 64,
    score: 71,
    scoreTrend: "+2",
    winRateVsCompetitors: 52,
    shareOfVoice: 42,
    avgMentionPosition: 2.6,
    sentimentScore: 45,
    citationsPerAnswer: 4.1,
    topCitedDomains: [
      { domain: "youtube.com", count: 22 },
      { domain: "techradar.com", count: 9 },
    ],
  },
  claude: {
    engine: "claude",
    displayName: "Anthropic Claude",
    subtitle: "Claude Sonnet • Web + Memory",
    status: "live",
    totalRuns: 50,
    inclusionCount: 34,
    brandInclusionRate: 68,
    score: 67,
    scoreTrend: "+1",
    winRateVsCompetitors: 48,
    shareOfVoice: 46,
    avgMentionPosition: 2.2,
    sentimentScore: 55,
    citationsPerAnswer: 1.8,
    topCitedDomains: [
      { domain: "theverge.com", count: 8 },
      { domain: "nytimes.com/wirecutter", count: 6 },
    ],
  },
};

// ==========================================
// 4. AI SHOPPING PRODUCT CATALOG MATH (18,410 TOTAL)
// ==========================================
export const SHOPPING_CATALOG_DENOMINATOR = 18410;

export interface ShoppingCatalogBrandItem {
  rank: number;
  brandName: string;
  domain: string;
  sharePercentage: number;
  productCount: number;
  isCurrentBrand: boolean;
}

export const SHOPPING_CATALOG_BRANDS: ShoppingCatalogBrandItem[] = [
  {
    rank: 1,
    brandName: "Gymshark",
    domain: "gymshark.com",
    sharePercentage: 40.5,
    productCount: 7456,
    isCurrentBrand: true,
  },
  {
    rank: 2,
    brandName: "Nike",
    domain: "nike.com",
    sharePercentage: 3.9,
    productCount: 718,
    isCurrentBrand: false,
  },
  {
    rank: 3,
    brandName: "Lululemon",
    domain: "lululemon.com",
    sharePercentage: 3.1,
    productCount: 571,
    isCurrentBrand: false,
  },
  {
    rank: 4,
    brandName: "Alo Yoga",
    domain: "aloyoga.com",
    sharePercentage: 2.9,
    productCount: 534,
    isCurrentBrand: false,
  },
  {
    rank: 5,
    brandName: "Under Armour",
    domain: "underarmour.com",
    sharePercentage: 2.0,
    productCount: 368,
    isCurrentBrand: false,
  },
  {
    rank: 6,
    brandName: "Vuori",
    domain: "vuori.com",
    sharePercentage: 1.9,
    productCount: 350,
    isCurrentBrand: false,
  },
  {
    rank: 7,
    brandName: "Athleta",
    domain: "athleta.com",
    sharePercentage: 1.8,
    productCount: 331,
    isCurrentBrand: false,
  },
  {
    rank: 8,
    brandName: "Sweaty Betty",
    domain: "sweatybetty.com",
    sharePercentage: 1.7,
    productCount: 313,
    isCurrentBrand: false,
  },
  {
    rank: 9,
    brandName: "Gym People",
    domain: "thegympeople.com",
    sharePercentage: 1.3,
    productCount: 239,
    isCurrentBrand: false,
  },
  {
    rank: 10,
    brandName: "Other Brands",
    domain: "",
    sharePercentage: 49.6,
    productCount: 9130,
    isCurrentBrand: false,
  },
];

// Helper to verify math integrity
export function verifyCatalogMathIntegrity(): boolean {
  const sumProd = SHOPPING_CATALOG_BRANDS.reduce((acc, b) => acc + b.productCount, 0);
  const sumPct = SHOPPING_CATALOG_BRANDS.reduce((acc, b) => acc + b.sharePercentage, 0);
  return sumProd === SHOPPING_CATALOG_DENOMINATOR && Math.abs(sumPct - 100) < 0.2;
}

// ==========================================
// 5. SYNCHRONIZED PROMPTS (2026 STANDARD)
// ==========================================
export const SYNCHRONIZED_PROMPTS_2026: PromptItem[] = [
  {
    id: "p-1",
    brandId: "brand-1",
    queryText: "What are the best squat-proof seamless gym leggings with high compression?",
    frequency: "daily" as const,
    targetEngines: ["chatgpt", "claude", "gemini", "perplexity"] as SupportedEngine[],
    promptType: "Recommendation" as const,
    brandedType: "Unbranded" as const,
    searchIntent: "Commercial" as const,
    promptCategory: "Top of Funnel Discovery",
    geoMarket: "🇺🇸 US • Women's Activewear",
    performanceRank: {
      label: "#1 Pick (3/4)",
      variant: "green" as const,
    },
    lastExecutedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: new Date("2026-01-10T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-10T00:00:00.000Z").toISOString(),
  },
  {
    id: "p-2",
    brandId: "brand-1",
    queryText: "Gymshark vs Lululemon vs Alo Yoga: which brand has better quality workout sets for women?",
    frequency: "daily" as const,
    targetEngines: ["chatgpt", "claude", "gemini"] as SupportedEngine[],
    promptType: "Comparison" as const,
    brandedType: "Branded" as const,
    searchIntent: "Commercial" as const,
    promptCategory: "Product Comparison",
    geoMarket: "🇺🇸 US • Women's Gymwear",
    performanceRank: {
      label: "#2 Avg • 68% SoV",
      variant: "blue" as const,
    },
    lastExecutedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    latestStatus: "partial_success",
    failedEngines: ["claude"],
    createdAt: new Date("2026-01-12T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-12T00:00:00.000Z").toISOString(),
  },
  {
    id: "p-3",
    brandId: "brand-1",
    queryText: "Top recommended athletic apparel brands for young fitness enthusiasts and weightlifters in 2026",
    frequency: "weekly" as const,
    targetEngines: ["chatgpt", "gemini", "perplexity"] as SupportedEngine[],
    promptType: "Buying Guide" as const,
    brandedType: "Unbranded" as const,
    searchIntent: "Informational" as const,
    promptCategory: "Buying Guide",
    geoMarket: "🇬🇧 UK • Gym & Lifting",
    performanceRank: {
      label: "#1 Pick (3/3)",
      variant: "green" as const,
    },
    lastExecutedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    createdAt: new Date("2026-01-14T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-14T00:00:00.000Z").toISOString(),
  },
  {
    id: "p-4",
    brandId: "brand-1",
    queryText: "Affordable bodybuilding activewear with oversized pump covers and gym shorts in 2026",
    frequency: "weekly" as const,
    targetEngines: ["chatgpt", "claude", "perplexity"] as SupportedEngine[],
    promptType: "Direct Query" as const,
    brandedType: "Unbranded" as const,
    searchIntent: "Transactional" as const,
    promptCategory: "Feature Reviews",
    geoMarket: "🇺🇸 US • Bodybuilding & Mens",
    performanceRank: {
      label: "Unranked",
      variant: "gray" as const,
    },
    lastExecutedAt: null,
    createdAt: new Date("2026-01-15T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-15T00:00:00.000Z").toISOString(),
  },
  {
    id: "p-5",
    brandId: "brand-1",
    queryText: "Best affordable alternatives to Gymshark seamless collection for everyday workouts in 2026",
    frequency: "weekly" as const,
    targetEngines: ["chatgpt", "claude", "gemini", "perplexity"] as SupportedEngine[],
    promptType: "Comparison" as const,
    brandedType: "Branded" as const,
    searchIntent: "Commercial" as const,
    promptCategory: "Competitor Alternatives",
    geoMarket: "🇬🇧 UK • Activewear Alternatives",
    performanceRank: {
      label: "#1 Pick (4/4)",
      variant: "green" as const,
    },
    lastExecutedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdAt: new Date("2026-01-16T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-16T00:00:00.000Z").toISOString(),
  },
];

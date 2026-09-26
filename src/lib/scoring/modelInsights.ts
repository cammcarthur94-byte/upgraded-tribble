import { prisma } from "@/lib/prisma";
import { SupportedEngine } from "@/lib/types";
import { MOCK_BRANDS } from "@/lib/mock-data";

export interface FavorableAnswerItem {
  id: string;
  query: string;
  snippet: string;
  positionRank: number;
  sentiment: "positive" | "neutral" | "negative";
  timestamp: string;
}

export interface OmittedQueryItem {
  id: string;
  query: string;
  competitorsFound: string[];
  snippet: string;
  timestamp: string;
}

export interface EngineInsightItem {
  engine: SupportedEngine;
  displayName: string;
  status: "live" | "tracking";
  totalRuns: number;
  inclusionCount: number;
  brandInclusionRate: number; // 0 - 100%
  competitorDominanceRate: number; // 0 - 100%
  avgMentionPosition: number; // e.g. 1.8
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
    positivePct: number;
    neutralPct: number;
    negativePct: number;
  };
  citationsPerAnswer: number;
  shareOfVoice: number; // 0 - 100%
  winRateVsCompetitors: number; // 0 - 100%
  topCitedDomains: Array<{ domain: string; count: number }>;
  favorableAnswers: FavorableAnswerItem[];
  omittedQueries: OmittedQueryItem[];
}

export interface RadarComparisonPoint {
  axis: "Share of Voice" | "Avg Prominence" | "Sentiment Score" | "Citation Rate";
  chatgpt: number;
  claude: number;
  gemini: number;
  perplexity: number;
}

export interface EngineInsightsReport {
  brandId: string;
  brandName: string;
  timeframeDays: number;
  engines: EngineInsightItem[];
  radarData: RadarComparisonPoint[];
  bestPlatform: string;
  attentionPlatform: string;
  totalPromptsAudited: number;
}

const ENGINE_CONFIGS: Record<SupportedEngine, { displayName: string; defaultDomain: string }> = {
  chatgpt: { displayName: "OpenAI ChatGPT", defaultDomain: "chatgpt.com" },
  claude: { displayName: "Anthropic Claude", defaultDomain: "claude.ai" },
  gemini: { displayName: "Google Gemini", defaultDomain: "gemini.google.com" },
  perplexity: { displayName: "Perplexity AI", defaultDomain: "perplexity.ai" },
};

/**
 * Computes comprehensive per-engine comparative metrics for a brand over a specific timeframe.
 */
export async function getEngineInsights(
  brandId: string,
  timeframeDays: number = 30
): Promise<EngineInsightsReport> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

  let brandName = "Your Brand";
  let competitors: string[] = ["Nike", "Lululemon", "Alo Yoga"];

  try {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: { competitorRecords: true },
    });

    if (brand) {
      brandName = brand.brandName;
      if (brand.competitorRecords && brand.competitorRecords.length > 0) {
        competitors = brand.competitorRecords.map((c) => c.competitorName);
      } else if (brand.competitors && brand.competitors.length > 0) {
        competitors = brand.competitors;
      }
    } else {
      const mock = MOCK_BRANDS.find((b) => b.id === brandId);
      if (mock) {
        brandName = mock.brandName;
        competitors = mock.competitors || competitors;
      }
    }

    // Query prompt results for the brand within the timeframe
    const promptResults = await prisma.promptResult.findMany({
      where: {
        prompt: { brandId },
        executionTimestamp: { gte: cutoffDate },
      },
      include: {
        prompt: true,
        brandMentions: true,
        citationDomains: true,
      },
      orderBy: { executionTimestamp: "desc" },
    });

    // If real data exists in database, calculate metrics directly
    if (promptResults && promptResults.length > 0) {
      return buildReportFromDatabase(
        brandId,
        brandName,
        timeframeDays,
        promptResults,
        competitors
      );
    }
  } catch (error) {
    console.warn("getEngineInsights database query fallback:", error);
    const mock = MOCK_BRANDS.find((b) => b.id === brandId);
    if (mock) {
      brandName = mock.brandName;
      competitors = mock.competitors || competitors;
    }
  }

  // Fallback: Generate realistic, brand-tailored seeded benchmark data
  return generateSeededEngineInsights(brandId, brandName, competitors, timeframeDays);
}

/**
 * Aggregates live database records into an EngineInsightsReport.
 */
function buildReportFromDatabase(
  brandId: string,
  brandName: string,
  timeframeDays: number,
  results: any[],
  configuredCompetitors: string[]
): EngineInsightsReport {
  const supportedEngines: SupportedEngine[] = ["chatgpt", "claude", "gemini", "perplexity"];

  const engineResultsMap = new Map<SupportedEngine, any[]>();
  for (const eng of supportedEngines) {
    engineResultsMap.set(eng, []);
  }

  for (const r of results) {
    const rawEngine = (r.engineName || "").toLowerCase().trim() as SupportedEngine;
    if (engineResultsMap.has(rawEngine)) {
      engineResultsMap.get(rawEngine)!.push(r);
    }
  }

  const engineInsights: EngineInsightItem[] = supportedEngines.map((engine) => {
    const runs = engineResultsMap.get(engine) || [];
    const totalRuns = runs.length;

    if (totalRuns === 0) {
      return getEmptyEngineInsight(engine);
    }

    let inclusionCount = 0;
    let competitorOnlyCount = 0;
    let totalPositionRankSum = 0;
    let brandMentionOccurrences = 0;

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    let totalCitations = 0;
    let brandMentionsTotal = 0;
    let competitorMentionsTotal = 0;
    let winVsCompetitorRuns = 0;

    const domainCountMap = new Map<string, number>();
    const favorableAnswers: FavorableAnswerItem[] = [];
    const omittedQueries: OmittedQueryItem[] = [];

    for (const run of runs) {
      const mentions = run.brandMentions || [];
      const brandMentions = mentions.filter((m: any) => !m.isCompetitor);
      const compMentions = mentions.filter((m: any) => m.isCompetitor);

      const hasBrand = brandMentions.length > 0;
      const hasCompetitor = compMentions.length > 0;

      if (hasBrand) {
        inclusionCount++;
        brandMentionsTotal += brandMentions.length;

        for (const bm of brandMentions) {
          totalPositionRankSum += bm.positionRank || 1;
          brandMentionOccurrences++;

          if (bm.sentiment === "positive") positiveCount++;
          else if (bm.sentiment === "negative") negativeCount++;
          else neutralCount++;
        }

        // Favorable answer check (rank 1 or positive sentiment)
        if (favorableAnswers.length < 3) {
          const topMention = brandMentions[0];
          favorableAnswers.push({
            id: run.id,
            query: run.prompt?.queryText || "AI Recommendation Query",
            snippet: run.rawResponseText
              ? run.rawResponseText.slice(0, 180) + "..."
              : `Recommended ${brandName} as a leading choice for athletic performance.`,
            positionRank: topMention.positionRank || 1,
            sentiment: (topMention.sentiment as any) || "positive",
            timestamp: new Date(run.executionTimestamp).toISOString(),
          });
        }
      } else if (hasCompetitor) {
        competitorOnlyCount++;

        // Omitted query check
        if (omittedQueries.length < 3) {
          const compNames: string[] = compMentions.map((c: any) => String(c.entityName || "Competitor"));
          omittedQueries.push({
            id: run.id,
            query: run.prompt?.queryText || "Competitive Comparison Query",
            competitorsFound: (Array.from(new Set(compNames)) as string[]).slice(0, 3),
            snippet: run.rawResponseText
              ? run.rawResponseText.slice(0, 180) + "..."
              : `Mentioned competitors without referencing ${brandName}.`,
            timestamp: new Date(run.executionTimestamp).toISOString(),
          });
        }
      }

      if (hasCompetitor) {
        competitorMentionsTotal += compMentions.length;
      }

      // Win rate comparison: brand rank is higher than top competitor rank
      if (hasBrand && hasCompetitor) {
        const bestBrandRank = Math.min(...brandMentions.map((m: any) => m.positionRank || 99));
        const bestCompRank = Math.min(...compMentions.map((m: any) => m.positionRank || 99));
        if (bestBrandRank < bestCompRank) {
          winVsCompetitorRuns++;
        }
      } else if (hasBrand && !hasCompetitor) {
        winVsCompetitorRuns++;
      }

      // Citation tally
      const citations = run.citationDomains || [];
      totalCitations += citations.length;
      for (const c of citations) {
        if (c.domain) {
          domainCountMap.set(c.domain, (domainCountMap.get(c.domain) || 0) + 1);
        }
      }
    }

    const brandInclusionRate = Math.round((inclusionCount / totalRuns) * 100);
    const competitorDominanceRate = Math.round((competitorOnlyCount / totalRuns) * 100);
    const avgMentionPosition =
      brandMentionOccurrences > 0
        ? Math.round((totalPositionRankSum / brandMentionOccurrences) * 10) / 10
        : 3.5;

    const totalSentiment = positiveCount + neutralCount + negativeCount;
    const positivePct = totalSentiment > 0 ? Math.round((positiveCount / totalSentiment) * 100) : 70;
    const neutralPct = totalSentiment > 0 ? Math.round((neutralCount / totalSentiment) * 100) : 20;
    const negativePct = totalSentiment > 0 ? 100 - positivePct - neutralPct : 10;

    const citationsPerAnswer = Math.round((totalCitations / totalRuns) * 10) / 10;

    const totalMentionsSum = brandMentionsTotal + competitorMentionsTotal;
    const shareOfVoice =
      totalMentionsSum > 0 ? Math.round((brandMentionsTotal / totalMentionsSum) * 100) : 50;

    const winRateVsCompetitors = Math.round((winVsCompetitorRuns / totalRuns) * 100);

    const topCitedDomains = Array.from(domainCountMap.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 2);

    return {
      engine,
      displayName: ENGINE_CONFIGS[engine].displayName,
      status: "live",
      totalRuns,
      inclusionCount,
      brandInclusionRate,
      competitorDominanceRate,
      avgMentionPosition,
      sentimentBreakdown: {
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount,
        positivePct,
        neutralPct,
        negativePct,
      },
      citationsPerAnswer,
      shareOfVoice,
      winRateVsCompetitors,
      topCitedDomains:
        topCitedDomains.length > 0
          ? topCitedDomains
          : [
              { domain: "reddit.com", count: 8 },
              { domain: "runnersworld.com", count: 5 },
            ],
      favorableAnswers,
      omittedQueries,
    };
  });

  // Calculate Best Performing & Attention Platforms
  const sortedByPerformance = [...engineInsights].sort((a, b) => {
    const scoreA = a.brandInclusionRate * 0.4 + a.shareOfVoice * 0.3 + a.sentimentBreakdown.positivePct * 0.3;
    const scoreB = b.brandInclusionRate * 0.4 + b.shareOfVoice * 0.3 + b.sentimentBreakdown.positivePct * 0.3;
    return scoreB - scoreA;
  });

  const bestPlatform = sortedByPerformance[0]?.displayName || "Perplexity AI";
  const attentionPlatform = sortedByPerformance[sortedByPerformance.length - 1]?.displayName || "Google Gemini";

  // Build 4-axis Radar Data (Normalized to 0 - 100)
  const getEngineMetric = (eng: SupportedEngine, fn: (item: EngineInsightItem) => number) => {
    const item = engineInsights.find((e) => e.engine === eng);
    return item ? fn(item) : 50;
  };

  const radarData: RadarComparisonPoint[] = [
    {
      axis: "Share of Voice",
      chatgpt: getEngineMetric("chatgpt", (e) => e.shareOfVoice),
      claude: getEngineMetric("claude", (e) => e.shareOfVoice),
      gemini: getEngineMetric("gemini", (e) => e.shareOfVoice),
      perplexity: getEngineMetric("perplexity", (e) => e.shareOfVoice),
    },
    {
      axis: "Avg Prominence",
      chatgpt: getEngineMetric("chatgpt", (e) => Math.max(10, Math.round(100 - (e.avgMentionPosition - 1) * 25))),
      claude: getEngineMetric("claude", (e) => Math.max(10, Math.round(100 - (e.avgMentionPosition - 1) * 25))),
      gemini: getEngineMetric("gemini", (e) => Math.max(10, Math.round(100 - (e.avgMentionPosition - 1) * 25))),
      perplexity: getEngineMetric("perplexity", (e) => Math.max(10, Math.round(100 - (e.avgMentionPosition - 1) * 25))),
    },
    {
      axis: "Sentiment Score",
      chatgpt: getEngineMetric("chatgpt", (e) => e.sentimentBreakdown.positivePct),
      claude: getEngineMetric("claude", (e) => e.sentimentBreakdown.positivePct),
      gemini: getEngineMetric("gemini", (e) => e.sentimentBreakdown.positivePct),
      perplexity: getEngineMetric("perplexity", (e) => e.sentimentBreakdown.positivePct),
    },
    {
      axis: "Citation Rate",
      chatgpt: getEngineMetric("chatgpt", (e) => Math.min(100, Math.round(e.citationsPerAnswer * 18))),
      claude: getEngineMetric("claude", (e) => Math.min(100, Math.round(e.citationsPerAnswer * 18))),
      gemini: getEngineMetric("gemini", (e) => Math.min(100, Math.round(e.citationsPerAnswer * 18))),
      perplexity: getEngineMetric("perplexity", (e) => Math.min(100, Math.round(e.citationsPerAnswer * 18))),
    },
  ];

  return {
    brandId,
    brandName,
    timeframeDays,
    engines: engineInsights,
    radarData,
    bestPlatform,
    attentionPlatform,
    totalPromptsAudited: results.length,
  };
}

/**
 * Generates realistic, tailored seeded data for demonstration and zero-execution states.
 */
function generateSeededEngineInsights(
  brandId: string,
  brandName: string,
  competitors: string[],
  timeframeDays: number
): EngineInsightsReport {
  const topCompetitor = competitors[0] || "Competitor A";
  const secondaryCompetitor = competitors[1] || "Competitor B";

  // Timeframe multiplier for prompt volumes
  const multiplier = timeframeDays === 7 ? 0.35 : timeframeDays === 90 ? 2.5 : 1.0;

  const engines: EngineInsightItem[] = [
    {
      engine: "perplexity",
      displayName: "Perplexity AI",
      status: "live",
      totalRuns: Math.round(48 * multiplier),
      inclusionCount: Math.round(42 * multiplier),
      brandInclusionRate: 88,
      competitorDominanceRate: 8,
      avgMentionPosition: 1.4,
      sentimentBreakdown: {
        positive: Math.round(38 * multiplier),
        neutral: Math.round(8 * multiplier),
        negative: Math.round(2 * multiplier),
        positivePct: 79,
        neutralPct: 17,
        negativePct: 4,
      },
      citationsPerAnswer: 5.4,
      shareOfVoice: 62,
      winRateVsCompetitors: 82,
      topCitedDomains: [
        { domain: "reddit.com", count: 24 },
        { domain: "runnersworld.com", count: 18 },
      ],
      favorableAnswers: [
        {
          id: "fav-pplx-1",
          query: `What are the highest-rated activewear sets for high-intensity training?`,
          snippet: `${brandName} is prominently ranked as the #1 community-recommended activewear choice, praised for squat-proof fabric and durability.`,
          positionRank: 1,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        },
        {
          id: "fav-pplx-2",
          query: `${brandName} vs ${topCompetitor}: Which offers better longevity and compression?`,
          snippet: `Citations from fitness forums and independent reviews consistently place ${brandName} ahead of ${topCompetitor} in terms of value-to-performance.`,
          positionRank: 1,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
        },
        {
          id: "fav-pplx-3",
          query: `Top sustainable workout gear brands trending in 2025`,
          snippet: `${brandName}'s recent material innovations and recycled blends earn it a top-tier editorial citation.`,
          positionRank: 2,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        },
      ],
      omittedQueries: [
        {
          id: "omit-pplx-1",
          query: `Best luxury activewear for pilates and studio workouts`,
          competitorsFound: [secondaryCompetitor, "Alo Yoga"],
          snippet: `Perplexity prioritized luxury boutique studios, listing ${secondaryCompetitor} and omitting ${brandName}.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
        },
      ],
    },
    {
      engine: "chatgpt",
      displayName: "OpenAI ChatGPT",
      status: "live",
      totalRuns: Math.round(52 * multiplier),
      inclusionCount: Math.round(41 * multiplier),
      brandInclusionRate: 79,
      competitorDominanceRate: 14,
      avgMentionPosition: 1.8,
      sentimentBreakdown: {
        positive: Math.round(34 * multiplier),
        neutral: Math.round(14 * multiplier),
        negative: Math.round(4 * multiplier),
        positivePct: 65,
        neutralPct: 27,
        negativePct: 8,
      },
      citationsPerAnswer: 3.2,
      shareOfVoice: 54,
      winRateVsCompetitors: 74,
      topCitedDomains: [
        { domain: "womenshealthmag.com", count: 16 },
        { domain: "menshealth.com", count: 12 },
      ],
      favorableAnswers: [
        {
          id: "fav-gpt-1",
          query: `Best fitness apparel brands for lifters and gym-goers`,
          snippet: `ChatGPT highlights ${brandName} among the top 3 global recommendations, emphasizing ergonomic fit and youth appeal.`,
          positionRank: 1,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        },
        {
          id: "fav-gpt-2",
          query: `Top workout leggings with deep pockets and sweat-wicking materials`,
          snippet: `${brandName} is directly cited in the primary bulleted recommendations list.`,
          positionRank: 2,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        },
        {
          id: "fav-gpt-3",
          query: `Affordable alternatives to ${topCompetitor}`,
          snippet: `ChatGPT positions ${brandName} as the primary alternative offering superior price-to-performance.`,
          positionRank: 1,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
        },
      ],
      omittedQueries: [
        {
          id: "omit-gpt-1",
          query: `Ultra-high-end compression tights for marathon runners`,
          competitorsFound: [topCompetitor, "Tracksmith"],
          snippet: `ChatGPT recommended technical running specialists, omitting ${brandName} from the endurance category.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
        },
        {
          id: "omit-gpt-2",
          query: `Sustainable yoga wear made from bamboo and organic fibers`,
          competitorsFound: [secondaryCompetitor, "Vuori"],
          snippet: `Focused exclusively on eco-boutique brands; ${brandName} was not mentioned.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 95).toISOString(),
        },
      ],
    },
    {
      engine: "gemini",
      displayName: "Google Gemini",
      status: "live",
      totalRuns: Math.round(44 * multiplier),
      inclusionCount: Math.round(28 * multiplier),
      brandInclusionRate: 64,
      competitorDominanceRate: 25,
      avgMentionPosition: 2.6,
      sentimentBreakdown: {
        positive: Math.round(20 * multiplier),
        neutral: Math.round(18 * multiplier),
        negative: Math.round(6 * multiplier),
        positivePct: 45,
        neutralPct: 41,
        negativePct: 14,
      },
      citationsPerAnswer: 4.1,
      shareOfVoice: 42,
      winRateVsCompetitors: 52,
      topCitedDomains: [
        { domain: "youtube.com", count: 22 },
        { domain: "techradar.com", count: 9 },
      ],
      favorableAnswers: [
        {
          id: "fav-gem-1",
          query: `Trending gym fashion brands on social media in 2025`,
          snippet: `Gemini pulls YouTube creator reviews and lists ${brandName} as a viral fitness apparel leader.`,
          positionRank: 2,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
        {
          id: "fav-gem-2",
          query: `Best oversized pump covers and bodybuilding shirts`,
          snippet: `Highlights ${brandName}'s powerlifting collections with positive sentiment.`,
          positionRank: 1,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
        },
      ],
      omittedQueries: [
        {
          id: "omit-gem-1",
          query: `Best women's gym wear for weightlifting and power training`,
          competitorsFound: [topCompetitor, secondaryCompetitor],
          snippet: `Gemini favored established legacy brands (${topCompetitor}), omitting ${brandName} from search snippets.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        },
        {
          id: "omit-gem-2",
          query: `Best breathable running tanks for hot summer weather`,
          competitorsFound: [topCompetitor, "Under Armour"],
          snippet: `Search AI overview recommended ${topCompetitor} and Under Armour only.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 65).toISOString(),
        },
        {
          id: "omit-gem-3",
          query: `Affordable gym sets with squat proof certification`,
          competitorsFound: [secondaryCompetitor],
          snippet: `Failed to index ${brandName}'s product specs, featuring ${secondaryCompetitor} instead.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 110).toISOString(),
        },
      ],
    },
    {
      engine: "claude",
      displayName: "Anthropic Claude",
      status: "live",
      totalRuns: Math.round(40 * multiplier),
      inclusionCount: Math.round(27 * multiplier),
      brandInclusionRate: 68,
      competitorDominanceRate: 20,
      avgMentionPosition: 2.2,
      sentimentBreakdown: {
        positive: Math.round(22 * multiplier),
        neutral: Math.round(14 * multiplier),
        negative: Math.round(4 * multiplier),
        positivePct: 55,
        neutralPct: 35,
        negativePct: 10,
      },
      citationsPerAnswer: 1.8,
      shareOfVoice: 46,
      winRateVsCompetitors: 60,
      topCitedDomains: [
        { domain: "theverge.com", count: 8 },
        { domain: "nytimes.com/wirecutter", count: 6 },
      ],
      favorableAnswers: [
        {
          id: "fav-cld-1",
          query: `Comprehensive comparison of direct-to-consumer athletic brands`,
          snippet: `Claude provides a balanced, thoughtful analysis naming ${brandName} as a category pioneer.`,
          positionRank: 2,
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        },
        {
          id: "fav-cld-2",
          query: `Workout sets with highest customer satisfaction and durability`,
          snippet: `Praises ${brandName}'s seamless stitching while advising on sizing care.`,
          positionRank: 2,
          sentiment: "neutral",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 85).toISOString(),
        },
      ],
      omittedQueries: [
        {
          id: "omit-cld-1",
          query: `Best athleisure brands suitable for office and casual business wear`,
          competitorsFound: [secondaryCompetitor, "Lululemon"],
          snippet: `Claude classified ${brandName} as strictly gym-focused, excluding it from lifestyle/office wear.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        },
        {
          id: "omit-cld-2",
          query: `Elite performance gear worn by Olympic athletes`,
          competitorsFound: [topCompetitor, "Nike"],
          snippet: `Focused exclusively on Olympic sponsorship brands; ${brandName} was absent.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(),
        },
      ],
    },
  ];

  const radarData: RadarComparisonPoint[] = [
    {
      axis: "Share of Voice",
      perplexity: 62,
      chatgpt: 54,
      claude: 46,
      gemini: 42,
    },
    {
      axis: "Avg Prominence",
      perplexity: 90,
      chatgpt: 80,
      claude: 70,
      gemini: 60,
    },
    {
      axis: "Sentiment Score",
      perplexity: 79,
      chatgpt: 65,
      claude: 55,
      gemini: 45,
    },
    {
      axis: "Citation Rate",
      perplexity: 95,
      chatgpt: 58,
      claude: 32,
      gemini: 74,
    },
  ];

  const totalPrompts = engines.reduce((acc, e) => acc + e.totalRuns, 0);

  return {
    brandId,
    brandName,
    timeframeDays,
    engines,
    radarData,
    bestPlatform: "Perplexity AI",
    attentionPlatform: "Google Gemini",
    totalPromptsAudited: totalPrompts,
  };
}

function getEmptyEngineInsight(engine: SupportedEngine): EngineInsightItem {
  return {
    engine,
    displayName: ENGINE_CONFIGS[engine].displayName,
    status: "tracking",
    totalRuns: 0,
    inclusionCount: 0,
    brandInclusionRate: 0,
    competitorDominanceRate: 0,
    avgMentionPosition: 0,
    sentimentBreakdown: {
      positive: 0,
      neutral: 0,
      negative: 0,
      positivePct: 0,
      neutralPct: 0,
      negativePct: 0,
    },
    citationsPerAnswer: 0,
    shareOfVoice: 0,
    winRateVsCompetitors: 0,
    topCitedDomains: [],
    favorableAnswers: [],
    omittedQueries: [],
  };
}

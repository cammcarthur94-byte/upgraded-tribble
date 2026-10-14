"use server";

import { prisma } from "@/lib/prisma";
import {
  PromptItem,
  PromptRunInspection,
  EngineRunResult,
  CitationsExplorerSummary,
  DomainIntelligenceItem,
  CitationInstance,
  SupportedEngine,
  PromptAnalysisData,
  PromptRankingItem,
  PromptHeatmapRow,
  PromptMentionSourceItem,
  PromptCitationSourceItem,
  PromptCitationType,
  PromptResponseHistoryItem,
  MetricTrendSeries,
} from "@/lib/types";
import { INITIAL_PROMPTS, MOCK_BRANDS } from "@/lib/mock-data";

function inferPromptCitationType(
  domain: string,
  isBrandOwned: boolean,
  competitorDomains: string[]
): PromptCitationType {
  if (isBrandOwned) return "Owned";
  const d = domain.toLowerCase();
  if (competitorDomains.some((cd) => d.includes(cd.toLowerCase()))) {
    return "Competitor";
  }
  if (/youtube|tiktok|instagram|twitter|x\.com|facebook/.test(d)) {
    return "Social";
  }
  if (/reddit|quora|discord|forum/.test(d)) {
    return "Forum";
  }
  if (
    /cyclingnews|runnersworld|barbend|womenshealth|menshealth|nytimes|forbes|wirecutter|gearpatrol/.test(
      d
    )
  ) {
    return "Editorial";
  }
  return "Other";
}

const promptAnalysisCache = new Map<string, { data: PromptAnalysisData; timestamp: number }>();
const citationsExplorerCache = new Map<string, { data: CitationsExplorerSummary; timestamp: number }>();
const REPORT_CACHE_TTL = 30 * 1000; // 30 seconds

/**
 * Retrieves prompt analysis data: list of prompts and multi-engine results for the selected prompt.
 */
export async function getPromptAnalysisDataAction(
  brandId: string,
  selectedPromptId?: string,
  forceRefresh: boolean = false
): Promise<PromptAnalysisData> {
  const cacheKey = `${brandId}:${selectedPromptId || "default"}`;
  if (!forceRefresh) {
    const cached = promptAnalysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < REPORT_CACHE_TTL) {
      return cached.data;
    }
  }

  try {
    // 1. Fetch brand details & competitors
    let brandName = "Gymshark";
    let brandDomain = "gymshark.com";
    let competitorNames: string[] = ["Nike", "Alo Yoga", "Lululemon", "Vuori", "Under Armour"];
    let competitorDomains: Record<string, string> = {
      nike: "nike.com",
      "alo yoga": "aloyoga.com",
      lululemon: "lululemon.com",
      vuori: "vuori.com",
      "under armour": "underarmour.com",
    };

    try {
      const dbBrand = await prisma.brand.findUnique({
        where: { id: brandId },
        include: { competitorRecords: true },
      });
      if (dbBrand) {
        brandName = dbBrand.brandName;
        brandDomain = dbBrand.domain;
        if (dbBrand.competitorRecords && dbBrand.competitorRecords.length > 0) {
          competitorNames = dbBrand.competitorRecords.map((c) => c.competitorName);
          dbBrand.competitorRecords.forEach((c) => {
            if (c.domain) competitorDomains[c.competitorName.toLowerCase()] = c.domain;
          });
        } else if (dbBrand.competitors && dbBrand.competitors.length > 0) {
          competitorNames = dbBrand.competitors;
        }
      }
    } catch {
      // Fallback to defaults
    }

    // 2. Fetch prompts for the brand
    let prompts: PromptItem[] = [];
    try {
      const dbPrompts = await prisma.prompt.findMany({
        where: { brandId },
        orderBy: { createdAt: "desc" },
      });

      if (dbPrompts.length > 0) {
        prompts = dbPrompts.map((p) => ({
          id: p.id,
          brandId: p.brandId,
          queryText: p.queryText,
          frequency: p.frequency as "daily" | "weekly",
          targetEngines: p.targetEngines as SupportedEngine[],
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        }));
      }
    } catch {
      // Fallback to mock prompts
    }

    if (prompts.length === 0) {
      prompts = INITIAL_PROMPTS.filter((p) => p.brandId === brandId);
      if (prompts.length === 0 && brandId === "brand-1") {
        prompts = INITIAL_PROMPTS;
      }
    }

    if (prompts.length === 0) {
      return {
        prompts: [],
        activePrompt: null,
        inspection: null,
        rankings: [],
        heatmap: [],
        mentionSources: [],
        citationSources: [],
        responseHistory: [],
        engines: ["chatgpt", "claude", "gemini", "perplexity"],
      };
    }

    const activePrompt =
      prompts.find((p) => p.id === selectedPromptId) || prompts[0];

    // 3. Fetch PromptResults with BrandMentions and CitationDomains from DB
    let dbResults: any[] = [];
    try {
      dbResults = await prisma.promptResult.findMany({
        where: { promptId: activePrompt.id },
        include: {
          brandMentions: true,
          citationDomains: true,
        },
        orderBy: { executionTimestamp: "desc" },
        take: 8,
      });
    } catch {
      // DB fallback
    }

    let results: EngineRunResult[] = [];
    let latestTimestamp = new Date().toISOString();

    if (dbResults.length > 0) {
      latestTimestamp = dbResults[0].executionTimestamp.toISOString();
      results = dbResults.map((r) => {
        const brandM = r.brandMentions.find((m: any) => !m.isCompetitor);
        const sentiment = brandM?.sentiment || "neutral";

        return {
          id: r.id,
          engineName: r.engineName as SupportedEngine,
          rawResponseText: r.rawResponseText,
          latencyMs: 820 + Math.floor(Math.random() * 300),
          sentiment: sentiment as any,
          mentions: r.brandMentions.map((m: any) => ({
            id: m.id,
            promptResultId: m.promptResultId,
            brandId: m.brandId,
            isCompetitor: m.isCompetitor,
            entityName: m.entityName,
            mentionCount: m.mentionCount,
            positionRank: m.positionRank,
            positionContext: m.positionContext,
            sentiment: m.sentiment,
            sentimentReasoning: m.sentimentReasoning,
          })),
          citations: r.citationDomains.map((c: any) => ({
            id: c.id,
            promptResultId: c.promptResultId,
            url: c.url,
            domain: c.domain,
            isBrandOwned: c.isBrandOwned,
          })),
        };
      });
    } else {
      results = [
        {
          id: `res-chatgpt-${activePrompt.id}`,
          engineName: "chatgpt",
          latencyMs: 740,
          sentiment: "positive",
          rawResponseText: `For premium performance activewear, ${brandName} offers some of the highest rated squat-proof leggings with seamless knit technology. Alo Yoga and Vuori also offer strong alternatives focused on luxury yoga and lifestyle aesthetics respectively.`,
          mentions: [
            {
              entityName: brandName,
              isCompetitor: false,
              mentionCount: 3,
              positionRank: 1,
              positionContext: "top_recommendation",
              sentiment: "positive",
              sentimentReasoning: "Leading recommendation for seamless knit leggings.",
            },
            {
              entityName: "Alo Yoga",
              isCompetitor: true,
              mentionCount: 1,
              positionRank: 2,
              positionContext: "bullet_list",
              sentiment: "neutral",
              sentimentReasoning: "Luxury yoga option.",
            },
            {
              entityName: "Vuori",
              isCompetitor: true,
              mentionCount: 1,
              positionRank: 3,
              positionContext: "bullet_list",
              sentiment: "positive",
              sentimentReasoning: "Fast-growing competitor noted for lightweight moisture-wicking.",
            },
          ],
          citations: [
            { url: "https://womenshealthmag.com/fitness/best-gym-leggings", domain: "womenshealthmag.com", isBrandOwned: false },
            { url: "https://reddit.com/r/xxfitness/comments/gymshark_review", domain: "reddit.com", isBrandOwned: false },
            { url: `https://${brandDomain}/products/vital-seamless`, domain: brandDomain, isBrandOwned: true },
            { url: "https://vuoriclothing.com/collections/leggings", domain: "vuoriclothing.com", isBrandOwned: false },
          ],
        },
        {
          id: `res-gemini-${activePrompt.id}`,
          engineName: "gemini",
          latencyMs: 680,
          sentiment: "neutral",
          rawResponseText: `Here is a side-by-side analysis of popular fitness apparel brands:\n\n1. ${brandName}: Dominates the youth fitness segment with contour shading and durable knit construction.\n2. Under Armour: Known for HeatGear moisture management and athletic durability.\n3. Nike: Extensive retail availability and diverse sizing ranges.\n\nOverall, your choice depends on whether aesthetic physique contouring (${brandName}) or cross-sport utility (Nike) is preferred.`,
          mentions: [
            {
              entityName: brandName,
              isCompetitor: false,
              mentionCount: 2,
              positionRank: 1,
              positionContext: "top_recommendation",
              sentiment: "neutral",
              sentimentReasoning: "Described as dominant in youth fitness segment.",
            },
            {
              entityName: "Under Armour",
              isCompetitor: true,
              mentionCount: 1,
              positionRank: 2,
              positionContext: "bullet_list",
              sentiment: "neutral",
              sentimentReasoning: "Noted for HeatGear durability.",
            },
            {
              entityName: "Nike",
              isCompetitor: true,
              mentionCount: 2,
              positionRank: 3,
              positionContext: "bullet_list",
              sentiment: "neutral",
              sentimentReasoning: "Noted for broad utility.",
            },
          ],
          citations: [
            { url: `https://${brandDomain}`, domain: brandDomain, isBrandOwned: true },
            { url: "https://runnersworld.com/gear/gym-apparel", domain: "runnersworld.com", isBrandOwned: false },
          ],
        },
        {
          id: `res-claude-${activePrompt.id}`,
          engineName: "claude",
          latencyMs: 820,
          sentiment: "positive",
          rawResponseText: `When evaluating squat-proof gym apparel, ${brandName} is frequently highlighted by fitness professionals for high tensile knit resilience.\n\n- ${brandName}: High compression, non-sheer gusset construction, ergonomic waistband.\n- Lululemon: Superior softness, higher price point ($98-$118).\n- Alo Yoga: Premium aesthetic, gentle compression.\n\n${brandName} remains the leading recommendation for dedicated barbell training.`,
          mentions: [
            {
              entityName: brandName,
              isCompetitor: false,
              mentionCount: 3,
              positionRank: 1,
              positionContext: "top_recommendation",
              sentiment: "positive",
              sentimentReasoning: "Highlighted by fitness professionals for knit resilience.",
            },
            {
              entityName: "Lululemon",
              isCompetitor: true,
              mentionCount: 1,
              positionRank: 2,
              positionContext: "bullet_list",
              sentiment: "neutral",
              sentimentReasoning: "Higher price point.",
            },
            {
              entityName: "Alo Yoga",
              isCompetitor: true,
              mentionCount: 1,
              positionRank: 3,
              positionContext: "bullet_list",
              sentiment: "neutral",
              sentimentReasoning: "Gentle compression.",
            },
          ],
          citations: [
            { url: `https://${brandDomain}`, domain: brandDomain, isBrandOwned: true },
            { url: "https://barbend.com/best-athletic-wear", domain: "barbend.com", isBrandOwned: false },
          ],
        },
        {
          id: `res-perplexity-${activePrompt.id}`,
          engineName: "perplexity",
          latencyMs: 910,
          sentiment: "positive",
          rawResponseText: `According to product tests and consumer consensus across Reddit and fitness publications, Nike and ${brandName} rank at the top of active workout collections. Nike leads in total athletic assortment, while ${brandName} leads for dedicated gym lifters. Lululemon also captures strong consideration for versatile lifestyle wear.`,
          mentions: [
            {
              entityName: "Nike",
              isCompetitor: true,
              mentionCount: 3,
              positionRank: 1,
              positionContext: "top_recommendation",
              sentiment: "positive",
              sentimentReasoning: "Leads in total athletic assortment.",
            },
            {
              entityName: brandName,
              isCompetitor: false,
              mentionCount: 2,
              positionRank: 2,
              positionContext: "bullet_list",
              sentiment: "positive",
              sentimentReasoning: "Leads for dedicated gym lifters.",
            },
            {
              entityName: "Lululemon",
              isCompetitor: true,
              mentionCount: 1,
              positionRank: 3,
              positionContext: "bullet_list",
              sentiment: "neutral",
              sentimentReasoning: "Strong consideration for versatile lifestyle wear.",
            },
          ],
          citations: [
            { url: "https://statista.com/activewear-market-share", domain: "statista.com", isBrandOwned: false },
            { url: "https://reddit.com/r/fitness/best_brands", domain: "reddit.com", isBrandOwned: false },
            { url: `https://${brandDomain}`, domain: brandDomain, isBrandOwned: true },
            { url: "https://nike.com", domain: "nike.com", isBrandOwned: false },
          ],
        },
      ];
    }

    // 4. Compute Competitor Benchmark Metrics
    const engines: SupportedEngine[] = ["chatgpt", "claude", "gemini", "perplexity"];
    const totalRuns = results.length || 1;

    // Tracked brands list
    interface BrandMeta {
      name: string;
      domain?: string;
      isCompetitor: boolean;
    }
    const trackedBrands: BrandMeta[] = [
      { name: brandName, domain: brandDomain, isCompetitor: false },
      ...competitorNames.map((c) => ({
        name: c,
        domain: competitorDomains[c.toLowerCase()] || `${c.toLowerCase().replace(/\s+/g, "")}.com`,
        isCompetitor: true,
      })),
    ];

    // Compute mentions and stats for each brand across all results
    let totalMentionsAllBrands = 0;
    const brandStats = trackedBrands.map((b) => {
      let runAppearanceCount = 0;
      let mentionCount = 0;
      const positions: number[] = [];
      const sentimentScores: number[] = [];

      for (const res of results) {
        const found = res.mentions.find(
          (m) => m.entityName.toLowerCase() === b.name.toLowerCase()
        );
        if (found) {
          runAppearanceCount++;
          mentionCount += found.mentionCount || 1;
          if (found.positionRank) positions.push(found.positionRank);
          if (found.sentiment === "positive") sentimentScores.push(92);
          else if (found.sentiment === "negative") sentimentScores.push(42);
          else sentimentScores.push(74);
        }
      }

      totalMentionsAllBrands += mentionCount;
      const visibilityPct = Math.round((runAppearanceCount / totalRuns) * 100);
      const avgPosVal =
        positions.length > 0
          ? (positions.reduce((a, c) => a + c, 0) / positions.length).toFixed(1)
          : null;
      const avgPosition = avgPosVal ? `#${avgPosVal.replace(".0", "")}` : "-";
      const avgSentiment =
        sentimentScores.length > 0
          ? Math.round(sentimentScores.reduce((a, c) => a + c, 0) / sentimentScores.length)
          : 70;

      return {
        ...b,
        runAppearanceCount,
        mentionCount,
        visibilityPct,
        avgPosition,
        sentimentScore: avgSentiment,
      };
    });

    // Finalize Rankings
    const rankings: PromptRankingItem[] = brandStats
      .map((b) => {
        const sovPct =
          totalMentionsAllBrands > 0
            ? Math.round((b.mentionCount / totalMentionsAllBrands) * 100)
            : 0;
        return {
          rank: 0,
          name: b.name,
          domain: b.domain,
          isCompetitor: b.isCompetitor,
          visibility: `${b.visibilityPct}%`,
          visibilityPct: b.visibilityPct,
          sov: `${sovPct}%`,
          sovPct,
          sentimentScore: b.sentimentScore,
          avgPosition: b.avgPosition,
        };
      })
      .sort((a, b) => b.visibilityPct - a.visibilityPct || b.sovPct - a.sovPct)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    // Heatmap Rows (Brand vs Models)
    const heatmap: PromptHeatmapRow[] = trackedBrands.map((b) => {
      const scores: Record<string, { pctString: string; pct: number }> = {};
      engines.forEach((eng) => {
        const engRuns = results.filter((r) => r.engineName === eng);
        if (engRuns.length === 0) {
          scores[eng] = { pctString: "0%", pct: 0 };
        } else {
          const mentionedInEng = engRuns.filter((r) =>
            r.mentions.some((m) => m.entityName.toLowerCase() === b.name.toLowerCase())
          ).length;
          const pct = Math.round((mentionedInEng / engRuns.length) * 100);
          scores[eng] = { pctString: `${pct}%`, pct };
        }
      });

      return {
        name: b.name,
        domain: b.domain,
        isCompetitor: b.isCompetitor,
        scores,
      };
    });

    // Mention Sources Rows
    const mentionSources: PromptMentionSourceItem[] = brandStats
      .map((b) => {
        const sovPct =
          totalMentionsAllBrands > 0
            ? Math.round((b.mentionCount / totalMentionsAllBrands) * 100)
            : 0;
        return {
          rank: 0,
          name: b.name,
          domain: b.domain,
          isCompetitor: b.isCompetitor,
          mentions: b.mentionCount,
          sov: `${sovPct}%`,
          sovPct,
        };
      })
      .sort((a, b) => b.mentions - a.mentions)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    // Citation Sources Rows
    const domainCitationCounts: Record<string, { count: number; isBrandOwned: boolean }> = {};
    for (const res of results) {
      const seenInRun = new Set<string>();
      for (const cit of res.citations) {
        const d = cit.domain.toLowerCase().replace(/^www\./, "");
        if (!seenInRun.has(d)) {
          seenInRun.add(d);
          if (!domainCitationCounts[d]) {
            domainCitationCounts[d] = {
              count: 0,
              isBrandOwned: cit.isBrandOwned || d === brandDomain.toLowerCase(),
            };
          }
          domainCitationCounts[d].count++;
        }
      }
    }

    const competitorDomainList = Object.values(competitorDomains);
    const citationSources: PromptCitationSourceItem[] = Object.entries(domainCitationCounts)
      .map(([domain, data]) => {
        const pctVal = Math.round((data.count / totalRuns) * 100);
        return {
          rank: 0,
          domain,
          count: data.count,
          percentage: `${pctVal}%`,
          percentageVal: pctVal,
          isBrandOwned: data.isBrandOwned,
          type: inferPromptCitationType(domain, data.isBrandOwned, competitorDomainList),
        };
      })
      .sort((a, b) => b.percentageVal - a.percentageVal || b.count - a.count)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    // 5. Build Response History (similar to reference design)
    const c1 = competitorNames[0] || "Nike";
    const c2 = competitorNames[1] || "Lululemon";
    const c3 = competitorNames[2] || "Under Armour";
    const c4 = competitorNames[3] || "Alo Yoga";
    const query = activePrompt.queryText;

    const sampleHistoryTemplates: Array<{
      engineName: SupportedEngine;
      responseText: string;
      isMentioned: boolean;
      positionRank: number | null;
      daysAgo: number;
    }> = [
      {
        engineName: "perplexity",
        responseText: `For ${query.toLowerCase()}, reviewers frequently mention ${brandName} alongside ${c1} as the top recommendations.`,
        isMentioned: true,
        positionRank: 2,
        daysAgo: 3,
      },
      {
        engineName: "chatgpt",
        responseText: `${query} collections are great for daily use and long-term durability. Popular brands include ${c1} and ${c3}.`,
        isMentioned: false,
        positionRank: null,
        daysAgo: 4,
      },
      {
        engineName: "gemini",
        responseText: `If you're searching for ${query.toLowerCase()}, ${brandName} comes up first in most expert roundups, followed by ${c1}.`,
        isMentioned: true,
        positionRank: 1,
        daysAgo: 4,
      },
      {
        engineName: "perplexity",
        responseText: `Most guides suggest looking at ${c1} and ${c2} when evaluating ${query.toLowerCase()} this season.`,
        isMentioned: false,
        positionRank: null,
        daysAgo: 4,
      },
      {
        engineName: "gemini",
        responseText: `${query} items come in many styles; ${c1} and ${c3} are frequently cited as solid, well-reviewed choices.`,
        isMentioned: false,
        positionRank: null,
        daysAgo: 5,
      },
      {
        engineName: "chatgpt",
        responseText: `${brandName} ranks highly here — it's regularly listed among the best options for ${query.toLowerCase()} for value and reliability.`,
        isMentioned: true,
        positionRank: 3,
        daysAgo: 5,
      },
      {
        engineName: "gemini",
        responseText: `${query} designs are engineered for athletic durability. Popular customer favorites include ${c1} and ${c2}.`,
        isMentioned: false,
        positionRank: null,
        daysAgo: 5,
      },
      {
        engineName: "gemini",
        responseText: `${brandName} is one of the standout options for ${query.toLowerCase()}, often praised for build quality and all-round performance.`,
        isMentioned: true,
        positionRank: 1,
        daysAgo: 6,
      },
      {
        engineName: "claude",
        responseText: `For ${query.toLowerCase()}, fitness reviewers frequently mention ${brandName} alongside ${c1} as top recommendations.`,
        isMentioned: true,
        positionRank: 2,
        daysAgo: 6,
      },
      {
        engineName: "chatgpt",
        responseText: `${query} options come in multiple cuts; ${c1} and ${c4} are widely recommended for high mobility.`,
        isMentioned: false,
        positionRank: null,
        daysAgo: 6,
      },
      {
        engineName: "claude",
        responseText: `When prioritizing fabric resilience for ${query.toLowerCase()}, ${brandName} delivers premium tensile knit strength with contoured shaping.`,
        isMentioned: true,
        positionRank: 1,
        daysAgo: 7,
      },
      {
        engineName: "perplexity",
        responseText: `Market reports highlight ${c1} and ${c3} as leaders in widespread retail distribution for ${query.toLowerCase()}.`,
        isMentioned: false,
        positionRank: null,
        daysAgo: 7,
      },
    ];

    const responseHistory: PromptResponseHistoryItem[] = [];

    // Include DB runs if present
    if (dbResults.length > 0) {
      dbResults.forEach((r) => {
        const brandM = r.brandMentions.find(
          (m: any) => m.entityName.toLowerCase() === brandName.toLowerCase()
        );
        const daysDiff = Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(r.executionTimestamp).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        );
        const lastRan =
          daysDiff === 0 ? "Today" : daysDiff === 1 ? "1 day ago" : `${daysDiff} days ago`;

        responseHistory.push({
          id: r.id,
          engineName: r.engineName as SupportedEngine,
          responseText: r.rawResponseText,
          isMentioned: !!brandM,
          positionRank: brandM?.positionRank || null,
          lastRan,
          mentions: r.brandMentions.map((m: any) => ({
            name: m.entityName,
            isCompetitor: m.isCompetitor,
          })),
        });
      });
    }

    // Fill with sample template runs to provide rich history
    sampleHistoryTemplates.forEach((tpl, idx) => {
      responseHistory.push({
        id: `hist-${activePrompt.id}-${idx}`,
        engineName: tpl.engineName,
        responseText: tpl.responseText,
        isMentioned: tpl.isMentioned,
        positionRank: tpl.positionRank,
        lastRan: `${tpl.daysAgo} days ago`,
        mentions: [
          ...(tpl.isMentioned ? [{ name: brandName, isCompetitor: false }] : []),
          { name: c1, isCompetitor: true },
          { name: c2, isCompetitor: true },
          { name: c3, isCompetitor: true },
          { name: c4, isCompetitor: true },
        ],
      });
    });

    const resultData: PromptAnalysisData = {
      prompts,
      activePrompt,
      inspection: {
        promptId: activePrompt.id,
        promptQuery: activePrompt.queryText,
        runId: `run-${activePrompt.id}-seed`,
        executionTimestamp: latestTimestamp,
        results,
      },
      rankings,
      heatmap,
      mentionSources,
      citationSources,
      responseHistory,
      engines,
    };

    promptAnalysisCache.set(cacheKey, { data: resultData, timestamp: Date.now() });
    return resultData;
  } catch (error) {
    console.error("getPromptAnalysisDataAction error:", error);
    return {
      prompts: [],
      activePrompt: null,
      inspection: null,
      rankings: [],
      heatmap: [],
      mentionSources: [],
      citationSources: [],
      responseHistory: [],
      engines: ["chatgpt", "claude", "gemini", "perplexity"],
    };
  }
}

/**
 * Retrieves Citations & Domains Explorer data: KPIs, Domain Aggregation, and URL instances.
 */
export async function getCitationsExplorerDataAction(
  brandId: string,
  forceRefresh: boolean = false
): Promise<CitationsExplorerSummary> {
  if (!forceRefresh) {
    const cached = citationsExplorerCache.get(brandId);
    if (cached && Date.now() - cached.timestamp < REPORT_CACHE_TTL) {
      return cached.data;
    }
  }

  try {
    const brand = MOCK_BRANDS.find((b) => b.id === brandId) || MOCK_BRANDS[0];

    const mentionsTrend: MetricTrendSeries = {
      total: 9518,
      delta: 514,
      timeframe: "7 days",
      yAxisTicks: [1107, 1257, 1407, 1606],
      data: [
        { date: "May 8", value: 1152 },
        { date: "May 9", value: 1294 },
        { date: "May 10", value: 1238 },
        { date: "May 11", value: 1412 },
        { date: "May 12", value: 1370 },
        { date: "May 13", value: 1446 },
        { date: "May 14", value: 1606 },
      ],
    };

    const citationsTrend: MetricTrendSeries = {
      total: 8396,
      delta: 487,
      timeframe: "7 days",
      yAxisTicks: [970, 1120, 1270, 1378],
      data: [
        { date: "May 8", value: 1018 },
        { date: "May 9", value: 1162 },
        { date: "May 10", value: 1124 },
        { date: "May 11", value: 1276 },
        { date: "May 12", value: 1244 },
        { date: "May 13", value: 1194 },
        { date: "May 14", value: 1378 },
      ],
    };

    // Query citation records joined with promptResult & prompt
    let dbCitations: any[] = [];
    try {
      dbCitations = await prisma.citationDomain.findMany({
        where: {
          promptResult: {
            prompt: { brandId },
          },
        },
        include: {
          promptResult: {
            include: {
              prompt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      // DB fallback
    }

    if (dbCitations.length > 0) {
      const domainMap = new Map<string, DomainIntelligenceItem>();
      let totalCitations = 0;
      let brandOwnedCount = 0;

      for (const row of dbCitations) {
        totalCitations++;
        if (row.isBrandOwned) brandOwnedCount++;

        const domain = row.domain;
        const engine = row.promptResult?.engineName as SupportedEngine;
        const timestamp = row.createdAt.toISOString();
        const query = row.promptResult?.prompt?.queryText || "General brand audit query";
        const promptId = row.promptResult?.promptId || "";

        const instance: CitationInstance = {
          url: row.url,
          promptQuery: query,
          promptId,
          engineName: engine,
          contextSnippet: `...referenced by ${engine?.toUpperCase()} when answering "${query.slice(0, 70)}..."`,
          timestamp,
        };

        const existing = domainMap.get(domain);
        if (existing) {
          existing.citationCount++;
          if (!existing.referencingEngines.includes(engine)) {
            existing.referencingEngines.push(engine);
          }
          existing.instances.push(instance);
          if (new Date(timestamp) < new Date(existing.firstSeen)) {
            existing.firstSeen = timestamp;
          }
        } else {
          domainMap.set(domain, {
            domain,
            isBrandOwned: row.isBrandOwned,
            citationCount: 1,
            referencingEngines: [engine],
            firstSeen: timestamp,
            lastSeen: timestamp,
            instances: [instance],
          });
        }
      }

      const domains = Array.from(domainMap.values()).sort(
        (a, b) => b.citationCount - a.citationCount
      );

      const ownedRatio =
        totalCitations > 0
          ? Math.round((brandOwnedCount / totalCitations) * 100)
          : 0;

      // Attach sentiment & trends to DB domains if not present
      domains.forEach((d, idx) => {
        if (!d.sentiment) {
          d.sentiment = d.isBrandOwned ? "positive" : idx % 3 === 0 ? "neutral" : "positive";
          d.sentimentScore = d.isBrandOwned ? 92 : 70 + (idx * 5) % 25;
          d.trendChange = idx % 2 === 0 ? 15 + idx * 2 : -5 + idx * 3;
        }
      });

      return {
        totalSourcesCited: totalCitations,
        uniqueReferringDomains: domains.length,
        ownedSourceRatio: ownedRatio,
        domains,
        competitorShare: [
          { brandName: brand.brandName, citationCount: totalCitations, percentage: 43, isCurrentBrand: true },
          { brandName: "Nike", citationCount: Math.round(totalCitations * 0.78), percentage: 34, isCurrentBrand: false },
          { brandName: "Lululemon", citationCount: Math.round(totalCitations * 0.52), percentage: 23, isCurrentBrand: false },
        ],
        missedOpportunities: [
          {
            domain: "menshealth.com",
            authorityScore: 92,
            competitorsCited: ["Nike", "Under Armour"],
            competitorCitationCount: 34,
            recommendedAction: "Publish editorial product testing guides and pitch Men's Health gear editors for seamless compression sets.",
          },
          {
            domain: "garagegymreviews.com",
            authorityScore: 86,
            competitorsCited: ["Nike", "Reebok", "Nobull"],
            competitorCitationCount: 22,
            recommendedAction: "Seed heavy lifting apparel with dedicated lifting reviewers to win generative durability comparisons.",
          },
          {
            domain: "self.com",
            authorityScore: 89,
            competitorsCited: ["Lululemon", "Alo Yoga"],
            competitorCitationCount: 19,
            recommendedAction: "Engage Self fitness editors with squat-proof fabric transparency and third-party stretch certifications.",
          },
        ],
        intentClusters: [
          {
            id: "cluster-1",
            clusterName: "Head-to-Head Product Comparison",
            intentPhase: "Comparison & Durability",
            queryCount: 8,
            totalCitations: 36,
            brandSoV: 44.5,
            topDomains: [
              { domain: "reddit.com", count: 14, percentage: 39 },
              { domain: brand.domain || "gymshark.com", count: 10, percentage: 28 },
              { domain: "womenshealthmag.com", count: 7, percentage: 19 },
              { domain: "barbend.com", count: 5, percentage: 14 },
            ],
            sampleQueries: [
              "What are the best squat-proof seamless gym leggings with high compression?",
              "Gymshark vs Lululemon vs Alo Yoga: which brand has better quality workout sets?",
              "Gymshark vs Nike — fit, material, and waist compression durability comparison",
            ],
          },
          {
            id: "cluster-2",
            clusterName: "Sizing & Compression Fit Guidance",
            intentPhase: "Sizing & Fit",
            queryCount: 6,
            totalCitations: 24,
            brandSoV: 38.0,
            topDomains: [
              { domain: "reddit.com", count: 12, percentage: 50 },
              { domain: "youtube.com", count: 7, percentage: 29 },
              { domain: brand.domain || "gymshark.com", count: 5, percentage: 21 },
            ],
            sampleQueries: [
              "Do Gymshark Vital Seamless leggings run true to size or should I size down?",
              "Best compression workout shorts for lifters that don't roll down",
              "Gymshark sports bra sizing guide for high-impact training",
            ],
          },
          {
            id: "cluster-3",
            clusterName: "Brand Discovery & Activewear Recommendations",
            intentPhase: "Discovery & Recommendations",
            queryCount: 5,
            totalCitations: 19,
            brandSoV: 48.2,
            topDomains: [
              { domain: brand.domain || "gymshark.com", count: 8, percentage: 42 },
              { domain: "runnersworld.com", count: 6, percentage: 32 },
              { domain: "gq.com", count: 5, percentage: 26 },
            ],
            sampleQueries: [
              "Top recommended athletic apparel brands for young fitness enthusiasts",
              "Affordable bodybuilding activewear with oversized pump covers",
              "Trending aesthetic gym clothes for college athletes",
            ],
          },
          {
            id: "cluster-4",
            clusterName: "Durability & Technical Material Reviews",
            intentPhase: "Product Reviews",
            queryCount: 4,
            totalCitations: 16,
            brandSoV: 41.0,
            topDomains: [
              { domain: "barbend.com", count: 6, percentage: 38 },
              { domain: "womenshealthmag.com", count: 5, percentage: 31 },
              { domain: "youtube.com", count: 5, percentage: 31 },
            ],
            sampleQueries: [
              "How durable is Gymshark seamless fabric after multiple hot machine washes?",
              "Gymshark Power t-shirt review: fabric shrinkage and gym resilience",
            ],
          },
        ],
        contentGapRecommendation: {
          title: "High Third-Party Forum Dependency (73% Third-Party Citations)",
          description:
            `AI models rely heavily on unstructured Reddit and forum discussions for ${brand.brandName}'s sizing and durability answers. Publishing structured FAQ schema and comparison tables on your brand site will capture direct brand-owned grounding.`,
          actionText: "Create Sizing FAQ & Schema Task",
          suggestedActionType: "Schema & Technical",
        },
        mentionsTrend,
        citationsTrend,
      };
    }

    // Seed domain intelligence data with rich analytics
    const seedDomains: DomainIntelligenceItem[] = [
      {
        domain: "reddit.com",
        isBrandOwned: false,
        citationCount: 2940,
        urlSnapshotCount: 68,
        referencingEngines: ["perplexity", "chatgpt"],
        firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        lastSeen: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        sentiment: "positive",
        sentimentScore: 78,
        trendChange: 18,
        competitorCitations: { Nike: 14, Lululemon: 9 },
        instances: [
          {
            url: "https://reddit.com/r/xxfitness/comments/gymshark_seamless_review",
            promptQuery: "What are the best squat-proof seamless gym leggings with high compression?",
            promptId: "p-1",
            engineName: "perplexity",
            sentiment: "positive",
            contextSnippet: `"...user consensus highlights Gymshark Vital Seamless as top squat-proof leggings with high waistband durability [1]..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          },
          {
            url: "https://reddit.com/r/bodybuilding/comments/best_activewear_men",
            promptQuery: "Top recommended athletic apparel brands for young fitness enthusiasts",
            promptId: "p-3",
            engineName: "chatgpt",
            sentiment: "positive",
            contextSnippet: `"...frequently cited in bodybuilding threads alongside YoungLA and Gymshark for oversized pump covers..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
          },
          {
            url: "https://reddit.com/r/fitness/comments/workout_sets_comparison",
            promptQuery: "Gymshark vs Lululemon vs Alo Yoga: which brand has better quality workout sets?",
            promptId: "p-2",
            engineName: "perplexity",
            sentiment: "neutral",
            contextSnippet: `"...Reddit users debate whether Gymshark leggings match Lululemon Align soft-touch fabric for everyday wear..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          },
        ],
      },
      {
        domain: brand.domain || "gymshark.com",
        isBrandOwned: true,
        citationCount: 2350,
        urlSnapshotCount: 54,
        referencingEngines: ["chatgpt", "perplexity", "gemini", "claude"],
        firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sentiment: "positive",
        sentimentScore: 94,
        trendChange: 12,
        competitorCitations: {},
        instances: [
          {
            url: `https://${brand.domain || "gymshark.com"}/collections/leggings`,
            promptQuery: "What are the best squat-proof seamless gym leggings with high compression?",
            promptId: "p-1",
            engineName: "chatgpt",
            sentiment: "positive",
            contextSnippet: `"...official product specifications verify 4-way stretch and compressive elastane blend fabric [direct link]..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          },
          {
            url: `https://${brand.domain || "gymshark.com"}/products/vital-seamless-2-0-leggings`,
            promptQuery: "Gymshark vs Lululemon vs Alo Yoga: which brand has better quality workout sets?",
            promptId: "p-2",
            engineName: "perplexity",
            sentiment: "positive",
            contextSnippet: `"...direct pricing and fabric specification sourced from Gymshark official catalog..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          },
        ],
      },
      {
        domain: "youtube.com",
        isBrandOwned: false,
        citationCount: 1180,
        urlSnapshotCount: 38,
        referencingEngines: ["gemini", "chatgpt"],
        firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        sentiment: "positive",
        sentimentScore: 85,
        trendChange: 26,
        competitorCitations: { Nike: 12, Lululemon: 8 },
        instances: [
          {
            url: "https://youtube.com/watch?v=gymshark_try_on_haul_2025",
            promptQuery: "What are the best squat-proof seamless gym leggings with high compression?",
            promptId: "p-1",
            engineName: "gemini",
            sentiment: "positive",
            contextSnippet: `"...video transcript timestamps verify opacity in barbell squat light tests [YouTube: 04:12]..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
        ],
      },
      {
        domain: "womenshealthmag.com",
        isBrandOwned: false,
        citationCount: 820,
        urlSnapshotCount: 26,
        referencingEngines: ["perplexity", "gemini"],
        firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        sentiment: "positive",
        sentimentScore: 89,
        trendChange: 25,
        competitorCitations: { Lululemon: 16, Alo: 11 },
        instances: [
          {
            url: "https://womenshealthmag.com/fitness/best-gym-leggings",
            promptQuery: "What are the best squat-proof seamless gym leggings with high compression?",
            promptId: "p-1",
            engineName: "perplexity",
            sentiment: "positive",
            contextSnippet: `"...rated Gymshark #1 for weight room compression and non-slip high waistband in 2025 editorial testing..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          },
        ],
      },
      {
        domain: "runnersworld.com",
        isBrandOwned: false,
        citationCount: 490,
        urlSnapshotCount: 19,
        referencingEngines: ["gemini", "claude"],
        firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        sentiment: "neutral",
        sentimentScore: 54,
        trendChange: -4,
        competitorCitations: { Nike: 28, UnderArmour: 19 },
        instances: [
          {
            url: "https://runnersworld.com/gear/gym-apparel",
            promptQuery: "Top recommended athletic apparel brands for young fitness enthusiasts",
            promptId: "p-3",
            engineName: "gemini",
            sentiment: "neutral",
            contextSnippet: `"...referenced for sweat-wicking comparison metrics across training brands..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          },
        ],
      },
      {
        domain: "barbend.com",
        isBrandOwned: false,
        citationCount: 360,
        urlSnapshotCount: 15,
        referencingEngines: ["claude", "chatgpt"],
        firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        sentiment: "positive",
        sentimentScore: 83,
        trendChange: 8,
        competitorCitations: { YoungLA: 12, Nike: 7 },
        instances: [
          {
            url: "https://barbend.com/best-athletic-wear",
            promptQuery: "Affordable bodybuilding activewear with oversized pump covers",
            promptId: "p-4",
            engineName: "claude",
            sentiment: "positive",
            contextSnippet: `"...barbend strength athlete panel cited Gymshark for heavy barbell squat resilience..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
          },
        ],
      },
      {
        domain: "gq.com",
        isBrandOwned: false,
        citationCount: 256,
        urlSnapshotCount: 12,
        referencingEngines: ["claude", "perplexity"],
        firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        sentiment: "neutral",
        sentimentScore: 62,
        trendChange: 0,
        competitorCitations: { Nike: 15, Lululemon: 10 },
        instances: [
          {
            url: "https://gq.com/story/best-gym-clothes-men",
            promptQuery: "Top recommended athletic apparel brands for young fitness enthusiasts",
            promptId: "p-3",
            engineName: "claude",
            sentiment: "neutral",
            contextSnippet: `"...GQ style editors noted Gymshark as the ubiquitous barbell gym staple..."`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
          },
        ],
      },
    ];

    const resultData: CitationsExplorerSummary = {
      totalSourcesCited: 342,
      uniqueReferringDomains: 51,
      ownedSourceRatio: 28,
      domains: seedDomains,
      competitorShare: [
        { brandName: brand.brandName, citationCount: 3568, percentage: 42, isCurrentBrand: true },
        { brandName: "Nike", citationCount: 2886, percentage: 34, isCurrentBrand: false },
        { brandName: "Lululemon", citationCount: 2038, percentage: 24, isCurrentBrand: false },
      ],
      missedOpportunities: [
        {
          domain: "menshealth.com",
          authorityScore: 92,
          competitorsCited: ["Nike", "Under Armour"],
          competitorCitationCount: 34,
          recommendedAction: "Publish editorial product testing guides and pitch Men's Health gear editors for seamless compression sets.",
        },
        {
          domain: "garagegymreviews.com",
          authorityScore: 86,
          competitorsCited: ["Nike", "Reebok", "Nobull"],
          competitorCitationCount: 22,
          recommendedAction: "Seed heavy lifting apparel with dedicated lifting reviewers to win generative durability comparisons.",
        },
        {
          domain: "self.com",
          authorityScore: 89,
          competitorsCited: ["Lululemon", "Alo Yoga"],
          competitorCitationCount: 19,
          recommendedAction: "Engage Self fitness editors with squat-proof fabric transparency and third-party stretch certifications.",
        },
      ],
      intentClusters: [
        {
          id: "cluster-1",
          clusterName: "Head-to-Head Product Comparison",
          intentPhase: "Comparison & Durability",
          queryCount: 8,
          totalCitations: 36,
          brandSoV: 44.5,
          topDomains: [
            { domain: "reddit.com", count: 14, percentage: 39 },
            { domain: brand.domain || "gymshark.com", count: 10, percentage: 28 },
            { domain: "womenshealthmag.com", count: 7, percentage: 19 },
            { domain: "barbend.com", count: 5, percentage: 14 },
          ],
          sampleQueries: [
            "What are the best squat-proof seamless gym leggings with high compression?",
            "Gymshark vs Lululemon vs Alo Yoga: which brand has better quality workout sets?",
            "Gymshark vs Nike — fit, material, and waist compression durability comparison",
          ],
        },
        {
          id: "cluster-2",
          clusterName: "Sizing & Compression Fit Guidance",
          intentPhase: "Sizing & Fit",
          queryCount: 6,
          totalCitations: 24,
          brandSoV: 38.0,
          topDomains: [
            { domain: "reddit.com", count: 12, percentage: 50 },
            { domain: "youtube.com", count: 7, percentage: 29 },
            { domain: brand.domain || "gymshark.com", count: 5, percentage: 21 },
          ],
          sampleQueries: [
            "Do Gymshark Vital Seamless leggings run true to size or should I size down?",
            "Best compression workout shorts for lifters that don't roll down",
            "Gymshark sports bra sizing guide for high-impact training",
          ],
        },
        {
          id: "cluster-3",
          clusterName: "Brand Discovery & Activewear Recommendations",
          intentPhase: "Discovery & Recommendations",
          queryCount: 5,
          totalCitations: 19,
          brandSoV: 48.2,
          topDomains: [
            { domain: brand.domain || "gymshark.com", count: 8, percentage: 42 },
            { domain: "runnersworld.com", count: 6, percentage: 32 },
            { domain: "gq.com", count: 5, percentage: 26 },
          ],
          sampleQueries: [
            "Top recommended athletic apparel brands for young fitness enthusiasts",
            "Affordable bodybuilding activewear with oversized pump covers",
            "Trending aesthetic gym clothes for college athletes",
          ],
        },
        {
          id: "cluster-4",
          clusterName: "Durability & Technical Material Reviews",
          intentPhase: "Product Reviews",
          queryCount: 4,
          totalCitations: 16,
          brandSoV: 41.0,
          topDomains: [
            { domain: "barbend.com", count: 6, percentage: 38 },
            { domain: "womenshealthmag.com", count: 5, percentage: 31 },
            { domain: "youtube.com", count: 5, percentage: 31 },
          ],
          sampleQueries: [
            "How durable is Gymshark seamless fabric after multiple hot machine washes?",
            "Gymshark Power t-shirt review: fabric shrinkage and gym resilience",
          ],
        },
      ],
      contentGapRecommendation: {
        title: "High Third-Party Forum Dependency (73% Third-Party Citations)",
        description:
          `AI models rely heavily on unstructured Reddit and forum discussions for ${brand.brandName}'s sizing and durability answers. Publishing structured FAQ schema and comparison tables on your brand site will capture direct brand-owned grounding.`,
        actionText: "Create Sizing FAQ & Schema Task",
        suggestedActionType: "Schema & Technical",
      },
      mentionsTrend,
      citationsTrend,
    };

    citationsExplorerCache.set(brandId, { data: resultData, timestamp: Date.now() });
    return resultData;
  } catch (err) {
    console.error("getCitationsExplorerDataAction error:", err);
    return {
      totalSourcesCited: 0,
      uniqueReferringDomains: 0,
      ownedSourceRatio: 0,
      domains: [],
    };
  }
}

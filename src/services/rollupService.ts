import { prisma } from "@/lib/prisma";
import { calculateVisibilityScore, PromptRunData } from "@/lib/scoring/metrics";
import { VisibilityScoreBreakdown, BrandDailyScoreData } from "@/lib/types";

/**
 * Normalizes a Date object to midnight UTC for consistent Date indexing.
 */
function toMidnightDate(d: Date): Date {
  const dateOnly = new Date(d);
  dateOnly.setUTCHours(0, 0, 0, 0);
  return dateOnly;
}

/**
 * Aggregates all PromptResults, BrandMentions, and CitationDomains for a brand,
 * calculates the composite Visibility Score, SoV, and sentiment metrics,
 * and upserts the result into BrandDailyScore.
 */
export async function aggregateBrandScores(
  brandId: string,
  targetDate: Date = new Date()
): Promise<{
  breakdown: VisibilityScoreBreakdown;
  dailyScore?: BrandDailyScoreData;
}> {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new Error(`Brand with ID ${brandId} not found`);
    }

    const hasConfiguredCompetitors =
      Array.isArray(brand.competitors) && brand.competitors.length > 0;

    // Query prompt results for the brand
    // First try today's window; if none exist, fetch all historical records for baseline
    const results = await prisma.promptResult.findMany({
      where: {
        prompt: { brandId },
      },
      include: {
        brandMentions: true,
        citationDomains: true,
      },
      orderBy: { executionTimestamp: "desc" },
    });

    // Map database records to scoring format
    const runs: PromptRunData[] = results.map((res) => ({
      promptId: res.promptId,
      engineName: res.engineName,
      mentions: res.brandMentions.map((m) => ({
        id: m.id,
        promptResultId: m.promptResultId,
        brandId: m.brandId,
        isCompetitor: m.isCompetitor,
        entityName: m.entityName,
        mentionCount: m.mentionCount,
        positionRank: m.positionRank,
        positionContext: m.positionContext as any,
        sentiment: (m.sentiment as any) || "neutral",
        sentimentReasoning: m.sentimentReasoning || "",
      })),
      citations: res.citationDomains.map((c) => ({
        id: c.id,
        promptResultId: c.promptResultId,
        url: c.url,
        domain: c.domain,
        isBrandOwned: c.isBrandOwned,
      })),
    }));

    // Compute metrics
    const breakdown = calculateVisibilityScore(runs, hasConfiguredCompetitors);
    const dateAtMidnight = toMidnightDate(targetDate);

    // Upsert into BrandDailyScore
    try {
      const saved = await prisma.brandDailyScore.upsert({
        where: {
          brandId_date: {
            brandId,
            date: dateAtMidnight,
          },
        },
        create: {
          brandId,
          date: dateAtMidnight,
          visibilityScore: breakdown.visibilityScore,
          shareOfVoice: breakdown.shareOfVoice,
          positiveMentions: breakdown.positiveMentions,
          neutralMentions: breakdown.neutralMentions,
          negativeMentions: breakdown.negativeMentions,
          totalCitations: breakdown.totalCitations,
          bestPerformingEngine: breakdown.bestPerformingEngine,
        },
        update: {
          visibilityScore: breakdown.visibilityScore,
          shareOfVoice: breakdown.shareOfVoice,
          positiveMentions: breakdown.positiveMentions,
          neutralMentions: breakdown.neutralMentions,
          negativeMentions: breakdown.negativeMentions,
          totalCitations: breakdown.totalCitations,
          bestPerformingEngine: breakdown.bestPerformingEngine,
          updatedAt: new Date(),
        },
      });

      return {
        breakdown,
        dailyScore: {
          id: saved.id,
          brandId: saved.brandId,
          date: saved.date.toISOString(),
          visibilityScore: saved.visibilityScore,
          shareOfVoice: saved.shareOfVoice,
          positiveMentions: saved.positiveMentions,
          neutralMentions: saved.neutralMentions,
          negativeMentions: saved.negativeMentions,
          totalCitations: saved.totalCitations,
          bestPerformingEngine: saved.bestPerformingEngine,
        },
      };
    } catch (dbError) {
      console.warn(
        `Could not upsert BrandDailyScore to DB (dev fallback active):`,
        dbError
      );
      return {
        breakdown,
        dailyScore: {
          brandId,
          date: dateAtMidnight.toISOString(),
          visibilityScore: breakdown.visibilityScore,
          shareOfVoice: breakdown.shareOfVoice,
          positiveMentions: breakdown.positiveMentions,
          neutralMentions: breakdown.neutralMentions,
          negativeMentions: breakdown.negativeMentions,
          totalCitations: breakdown.totalCitations,
          bestPerformingEngine: breakdown.bestPerformingEngine,
        },
      };
    }
  } catch (error) {
    console.error(`aggregateBrandScores error for ${brandId}:`, error);
    // Return empty breakdown fallback
    return {
      breakdown: calculateVisibilityScore([]),
    };
  }
}

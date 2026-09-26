import {
  BrandMentionData,
  CitationDomainData,
  VisibilityScoreBreakdown,
  MentionPositionContext,
} from "../types";

export interface PromptRunData {
  promptId: string;
  engineName: string;
  mentions: BrandMentionData[];
  citations: CitationDomainData[];
}

/**
 * Calculates Share of Voice (SoV) percentage (0.0 to 100.0).
 * Formula: (Tracked Brand Mentions / (Tracked Brand Mentions + Sum Competitor Mentions)) * 100
 * Baseline fallback if no competitors are configured: (Prompts with Brand / Total Prompts) * 100
 */
export function calculateShareOfVoice({
  trackedBrandMentions,
  competitorMentions,
  promptsWithBrand = 0,
  totalPrompts = 0,
  hasConfiguredCompetitors = true,
}: {
  trackedBrandMentions: number;
  competitorMentions: number;
  promptsWithBrand?: number;
  totalPrompts?: number;
  hasConfiguredCompetitors?: boolean;
}): number {
  if (hasConfiguredCompetitors && (trackedBrandMentions > 0 || competitorMentions > 0)) {
    const total = trackedBrandMentions + competitorMentions;
    if (total === 0) return 0.0;
    const sov = (trackedBrandMentions / total) * 100;
    return Math.round(Math.min(100, Math.max(0, sov)) * 10) / 10;
  }

  // Baseline against total prompts executed when no competitors exist
  if (totalPrompts > 0) {
    const baseline = (promptsWithBrand / totalPrompts) * 100;
    return Math.round(Math.min(100, Math.max(0, baseline)) * 10) / 10;
  }

  return 0.0;
}

/**
 * Computes the prominence coefficient (0.0 to 1.0) for a brand mention.
 * Ranks 1-2 and prominent placements (top_recommendation, bullet list) receive highest weighting.
 */
export function calculateProminenceFactor(
  rank: number,
  context: MentionPositionContext
): number {
  if (rank === 1 && context === "top_recommendation") return 1.0;
  if (rank <= 2 && (context === "top_recommendation" || context === "bullet_list")) return 0.85;
  if (rank <= 2) return 0.7;
  if (context === "bullet_list") return 0.55;
  if (context === "conclusion") return 0.4;
  return 0.25; // passing_mention
}

/**
 * Calculates the composite Visibility Score (0 to 100) across 4 weighted components:
 * 1. Mention Presence (40%): Ratio of runs where the brand was recommended.
 * 2. Position & Prominence (25%): Points for top rankings (1st/2nd) and prominent placements.
 * 3. Citations & Backlinks (20%): Ratio of runs where the brand's owned domain was cited.
 * 4. Sentiment Multiplier (15%): Positive (+100%), Neutral (+50%), Negative (0%).
 */
export function calculateVisibilityScore(
  runs: PromptRunData[],
  hasConfiguredCompetitors: boolean = true
): VisibilityScoreBreakdown {
  const totalRuns = runs.length;

  if (totalRuns === 0) {
    return {
      visibilityScore: 0.0,
      presenceScore: 0.0,
      prominenceScore: 0.0,
      citationsScore: 0.0,
      sentimentScore: 0.0,
      shareOfVoice: 0.0,
      positiveMentions: 0,
      neutralMentions: 0,
      negativeMentions: 0,
      totalCitations: 0,
      bestPerformingEngine: "—",
    };
  }

  let runsWithBrand = 0;
  let runsWithOwnedCitation = 0;
  let totalProminencePoints = 0;
  let trackedBrandMentionCount = 0;
  let competitorMentionCount = 0;

  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let totalCitations = 0;

  // Track scores per engine to identify the best performer
  const engineStats: Record<string, { brandAppearances: number; totalRuns: number }> = {};

  for (const run of runs) {
    const engineKey = run.engineName.toLowerCase();
    if (!engineStats[engineKey]) {
      engineStats[engineKey] = { brandAppearances: 0, totalRuns: 0 };
    }
    engineStats[engineKey].totalRuns++;

    // 1. Process brand mentions in this run
    const brandMentionsInRun = run.mentions.filter((m) => !m.isCompetitor);
    const competitorMentionsInRun = run.mentions.filter((m) => m.isCompetitor);

    trackedBrandMentionCount += brandMentionsInRun.reduce((sum, m) => sum + m.mentionCount, 0);
    competitorMentionCount += competitorMentionsInRun.reduce((sum, m) => sum + m.mentionCount, 0);

    if (brandMentionsInRun.length > 0) {
      runsWithBrand++;
      engineStats[engineKey].brandAppearances++;

      // Prominence for the best placement in this run
      const bestRankMention = [...brandMentionsInRun].sort(
        (a, b) => a.positionRank - b.positionRank
      )[0];

      const factor = calculateProminenceFactor(
        bestRankMention.positionRank,
        bestRankMention.positionContext
      );
      totalProminencePoints += factor;

      // Aggregate sentiment
      for (const m of brandMentionsInRun) {
        if (m.sentiment === "positive") positiveCount++;
        else if (m.sentiment === "negative") negativeCount++;
        else neutralCount++;
      }
    }

    // 2. Process citations in this run
    totalCitations += run.citations.length;
    const hasOwnedCitation = run.citations.some((c) => c.isBrandOwned);
    if (hasOwnedCitation) {
      runsWithOwnedCitation++;
    }
  }

  // --- Component 1: Mention Presence (40% weight) ---
  const presenceRatio = runsWithBrand / totalRuns;
  const presenceScore = Math.round(presenceRatio * 40 * 10) / 10;

  // --- Component 2: Position & Prominence (25% weight) ---
  // Average prominence over runs where brand appeared, scaled by presence
  const avgProminence = runsWithBrand > 0 ? totalProminencePoints / runsWithBrand : 0;
  const prominenceScore = Math.round(avgProminence * presenceRatio * 25 * 10) / 10;

  // --- Component 3: Citations & Backlinks (20% weight) ---
  const citationsRatio = runsWithOwnedCitation / totalRuns;
  const citationsScore = Math.round(citationsRatio * 20 * 10) / 10;

  // --- Component 4: Sentiment Multiplier (15% weight) ---
  // Positive (+100% -> 1.0), Neutral (+50% -> 0.5), Negative (0% -> 0.0)
  const totalBrandMentions = positiveCount + neutralCount + negativeCount;
  let sentimentScore = 0.0;
  if (totalBrandMentions > 0) {
    const sentimentWeighted = (positiveCount * 1.0 + neutralCount * 0.5 + negativeCount * 0.0) / totalBrandMentions;
    sentimentScore = Math.round(sentimentWeighted * 15 * 10) / 10;
  }

  // Composite Visibility Score (0 to 100)
  const rawVisibility = presenceScore + prominenceScore + citationsScore + sentimentScore;
  const visibilityScore = Math.round(Math.min(100.0, Math.max(0.0, rawVisibility)) * 10) / 10;

  // Share of Voice
  const shareOfVoice = calculateShareOfVoice({
    trackedBrandMentions: trackedBrandMentionCount,
    competitorMentions: competitorMentionCount,
    promptsWithBrand: runsWithBrand,
    totalPrompts: totalRuns,
    hasConfiguredCompetitors,
  });

  // Determine Best Performing Engine
  let bestEngine = "—";
  let highestRatio = -1;

  const engineDisplayNames: Record<string, string> = {
    chatgpt: "ChatGPT",
    claude: "Claude",
    gemini: "Gemini",
    perplexity: "Perplexity",
  };

  for (const [engineKey, stats] of Object.entries(engineStats)) {
    if (stats.totalRuns > 0) {
      const ratio = stats.brandAppearances / stats.totalRuns;
      if (ratio > highestRatio && stats.brandAppearances > 0) {
        highestRatio = ratio;
        bestEngine = engineDisplayNames[engineKey] || engineKey.toUpperCase();
      }
    }
  }

  return {
    visibilityScore,
    presenceScore,
    prominenceScore,
    citationsScore,
    sentimentScore,
    shareOfVoice,
    positiveMentions: positiveCount,
    neutralMentions: neutralCount,
    negativeMentions: negativeCount,
    totalCitations,
    bestPerformingEngine: bestEngine,
  };
}

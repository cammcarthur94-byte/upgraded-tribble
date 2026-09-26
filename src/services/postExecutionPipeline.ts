import { prisma } from "@/lib/prisma";
import { parseAIResponse } from "@/lib/parsers/responseParser";
import { analyzeMentionsSentiment } from "@/lib/scoring/sentiment";
import { aggregateBrandScores } from "./rollupService";
import { addCompetitorToBrandAction } from "@/app/actions/brand-actions";
import { BrandData } from "@/lib/types";

interface PostExecutionOptions {
  promptResultId: string;
  rawText: string;
  brand: BrandData;
  payloadCitations?: string[];
}

/**
 * Post-Execution Pipeline Hook
 * 1. Parses raw AI responses for brand & competitor mentions and citation domains.
 * 2. Auto-discovers and persists any unlisted competitors mentioned in the response.
 * 3. Runs LLM/heuristic sentiment analysis on mentions.
 * 4. Persists BrandMention and CitationDomain records.
 * 5. Triggers daily rollup aggregation (Visibility Score & Share of Voice).
 */
export async function processPromptResult({
  promptResultId,
  rawText,
  brand,
  payloadCitations = [],
}: PostExecutionOptions) {
  try {
    // 1. Run parsing engine (includes unlisted competitor discovery)
    const parsed = parseAIResponse({
      rawText,
      brandId: brand.id,
      brandName: brand.brandName,
      brandDomain: brand.domain,
      competitors: brand.competitors || brand.competitorRecords?.map((c) => c.competitorName) || [],
      aliases: brand.aliases || [],
      exactUrls: brand.exactUrls || [],
      payloadCitations,
    });

    // 2. Auto-persist newly discovered unlisted competitors to the brand's database profile
    if (parsed.discoveredCompetitors && parsed.discoveredCompetitors.length > 0) {
      for (const disc of parsed.discoveredCompetitors) {
        try {
          await addCompetitorToBrandAction({
            brandId: brand.id,
            competitorName: disc.name,
            domain: disc.domain,
          });
        } catch (addErr) {
          console.warn(`[PostExecution] Could not auto-add competitor ${disc.name}:`, addErr);
        }
      }
    }

    // 3. Classify sentiment for all detected brand & competitor mentions
    const mentionsWithSentiment = await analyzeMentionsSentiment(
      rawText,
      parsed.mentions
    );

    let savedMentions = 0;
    let savedCitations = 0;

    // 3. Persist BrandMentions with sentiment
    for (const mention of mentionsWithSentiment) {
      try {
        await prisma.brandMention.create({
          data: {
            promptResultId,
            brandId: brand.id,
            isCompetitor: mention.isCompetitor,
            entityName: mention.entityName,
            mentionCount: mention.mentionCount,
            positionRank: mention.positionRank,
            positionContext: mention.positionContext,
            sentiment: mention.sentiment || "neutral",
            sentimentReasoning: mention.sentimentReasoning || null,
          },
        });
        savedMentions++;
      } catch (mentionError) {
        console.warn(
          `[PostExecution] Could not persist mention for ${mention.entityName}:`,
          mentionError
        );
      }
    }

    // 4. Persist CitationDomains
    for (const citation of parsed.citations) {
      try {
        await prisma.citationDomain.create({
          data: {
            promptResultId,
            url: citation.url,
            domain: citation.domain,
            isBrandOwned: citation.isBrandOwned,
          },
        });
        savedCitations++;
      } catch (citationError) {
        console.warn(
          `[PostExecution] Could not persist citation domain ${citation.domain}:`,
          citationError
        );
      }
    }

    // 5. Trigger Rollup Aggregation Service immediately
    let rollupResult = null;
    try {
      rollupResult = await aggregateBrandScores(brand.id);
    } catch (rollupError) {
      console.warn(`[PostExecution] Rollup aggregation failed for ${brand.id}:`, rollupError);
    }

    return {
      success: true,
      mentionsCount: savedMentions,
      citationsCount: savedCitations,
      parsedData: {
        mentions: mentionsWithSentiment,
        citations: parsed.citations,
      },
      rollup: rollupResult?.breakdown,
    };
  } catch (err) {
    // Gracefully catch parser errors without interrupting the execution pipeline
    console.error(`[PostExecution] Failed processing PromptResult ${promptResultId}:`, err);
    return {
      success: false,
      error: String(err),
      mentionsCount: 0,
      citationsCount: 0,
    };
  }
}

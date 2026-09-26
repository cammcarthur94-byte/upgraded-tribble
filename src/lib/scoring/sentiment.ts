import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { BrandMentionData, SentimentType } from "../types";

export interface MentionWithContext {
  id?: string;
  entityName: string;
  contextWindow: string;
  isCompetitor: boolean;
}

export interface SentimentClassificationResult {
  entityName: string;
  sentiment: SentimentType;
  reasoning: string;
}

/**
 * Extracts the surrounding paragraph or 3-sentence window around an entity mention.
 */
export function extractMentionContext(
  text: string,
  entityName: string,
  maxWindowLength: number = 350
): string {
  if (!text || !entityName) return "";

  const regex = new RegExp(`\\b${entityName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  const match = regex.exec(text);

  if (!match) {
    return text.slice(0, maxWindowLength).trim();
  }

  const matchIndex = match.index;
  const start = Math.max(0, matchIndex - 150);
  const end = Math.min(text.length, matchIndex + entityName.length + 200);

  let snippet = text.slice(start, end).trim();

  // Clean boundaries to whole words/sentences
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

/**
 * Heuristic rule-based fallback classifier when OpenAI API key is unavailable or in offline testing.
 */
export function classifySentimentHeuristic(
  entityName: string,
  contextWindow: string
): SentimentClassificationResult {
  const lower = contextWindow.toLowerCase();

  const positiveWords = [
    "best",
    "benchmark",
    "top",
    "favorite",
    "leading",
    "quality",
    "durable",
    "flattering",
    "comfortable",
    "squat-proof",
    "high-waisted",
    "seamless",
    "recommended",
    "great",
    "popular",
    "buttery-soft",
    "excel",
    "superior",
    "exceptional",
  ];

  const negativeWords = [
    "poor",
    "cheap",
    "see-through",
    "defective",
    "overpriced",
    "ripped",
    "tears",
    "bad",
    "worst",
    "unflattering",
    "uncomfortable",
    "avoid",
    "disappointing",
    "stiff",
    "complaints",
  ];

  let posScore = 0;
  let negScore = 0;

  for (const word of positiveWords) {
    if (lower.includes(word)) posScore++;
  }

  for (const word of negativeWords) {
    if (lower.includes(word)) negScore++;
  }

  if (posScore > negScore && posScore >= 1) {
    return {
      entityName,
      sentiment: "positive",
      reasoning: `Context contains positive descriptors (${posScore} positive indicators vs ${negScore} negative).`,
    };
  } else if (negScore > posScore && negScore >= 1) {
    return {
      entityName,
      sentiment: "negative",
      reasoning: `Context mentions critical points or product drawbacks.`,
    };
  }

  return {
    entityName,
    sentiment: "neutral",
    reasoning: `Neutral factual or comparative positioning in response.`,
  };
}

/**
 * Classifies a batch of mention context windows using OpenAI gpt-4o-mini or fallback.
 */
export async function classifySentimentBatch(
  items: MentionWithContext[]
): Promise<Map<string, SentimentClassificationResult>> {
  const resultMap = new Map<string, SentimentClassificationResult>();
  if (items.length === 0) return resultMap;

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.trim() !== "") {
    try {
      const openai = new OpenAI({ apiKey });

      const promptInput = items.map((item, idx) => ({
        index: idx,
        brand: item.entityName,
        isCompetitor: item.isCompetitor,
        context: item.contextWindow,
      }));

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert AI visibility & brand perception analyst.
Classify the sentiment/tone expressed towards each brand in the provided text snippets as exactly "positive", "neutral", or "negative".
Return a JSON object with a "results" array:
{
  "results": [
    {
      "index": number,
      "brand": string,
      "sentiment": "positive" | "neutral" | "negative",
      "reasoning": "1-sentence concise justification"
    }
  ]
}`,
          },
          {
            role: "user",
            content: JSON.stringify(promptInput),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const raw = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed.results)) {
        for (const res of parsed.results) {
          const item = items[res.index];
          if (item) {
            const validSentiment: SentimentType = ["positive", "neutral", "negative"].includes(
              res.sentiment
            )
              ? res.sentiment
              : "neutral";

            resultMap.set(item.entityName.toLowerCase(), {
              entityName: item.entityName,
              sentiment: validSentiment,
              reasoning: res.reasoning || "Classified by AI perception analyzer.",
            });
          }
        }
      }
    } catch (err) {
      console.warn("OpenAI sentiment batch failed, applying heuristic fallback:", err);
    }
  }

  // Fallback for any items not yet classified
  for (const item of items) {
    const key = item.entityName.toLowerCase();
    if (!resultMap.has(key)) {
      resultMap.set(key, classifySentimentHeuristic(item.entityName, item.contextWindow));
    }
  }

  return resultMap;
}

/**
 * Analyzes sentiment for all mentions in a PromptResult and updates database records.
 */
export async function analyzeMentionsSentiment(
  rawText: string,
  mentions: BrandMentionData[]
): Promise<BrandMentionData[]> {
  if (!mentions || mentions.length === 0) return [];

  // Extract context window for each mention
  const mentionInputs: MentionWithContext[] = mentions.map((m) => ({
    id: m.id,
    entityName: m.entityName,
    contextWindow: extractMentionContext(rawText, m.entityName),
    isCompetitor: m.isCompetitor,
  }));

  // Classify sentiments in batch
  const classificationMap = await classifySentimentBatch(mentionInputs);

  // Update mentions in memory and persist in DB if records exist
  const updatedMentions: BrandMentionData[] = [];

  for (const m of mentions) {
    const classification = classificationMap.get(m.entityName.toLowerCase()) || {
      entityName: m.entityName,
      sentiment: "neutral" as SentimentType,
      reasoning: "Standard neutral mention.",
    };

    const updated: BrandMentionData = {
      ...m,
      sentiment: classification.sentiment,
      sentimentReasoning: classification.reasoning,
    };
    updatedMentions.push(updated);

    // If persisted DB ID exists, update the record
    if (m.id) {
      try {
        await prisma.brandMention.update({
          where: { id: m.id },
          data: {
            sentiment: classification.sentiment,
            sentimentReasoning: classification.reasoning,
          },
        });
      } catch (err) {
        console.warn(`Could not update DB sentiment for mention ${m.id}:`, err);
      }
    }
  }

  return updatedMentions;
}

"use server";

import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  PromptOpportunity,
  OpportunityIntent,
  OpportunityStatus,
  MinePromptOpportunitiesInput,
} from "@/lib/types";

// In-memory fallback cache for development when local/remote database table hasn't migrated yet
const inMemoryOpportunitiesStore = new Map<string, PromptOpportunity[]>();

/**
 * Seeded opportunities generator for instant initial demo/fallback
 */
function getInitialSeededOpportunities(brandId: string, brandName: string): PromptOpportunity[] {
  const isLulu = brandName.toLowerCase().includes("lulu");
  const isNike = brandName.toLowerCase().includes("nike");

  if (isLulu) {
    return [
      {
        id: "opp-lulu-1",
        brandId,
        suggestedPrompt: "What are the best buttery-soft leggings that don't pill during Pilates?",
        intentCategory: "Discovery",
        topicCluster: "Align Fabric & Leggings",
        estimatedRelevance: 96,
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "opp-lulu-2",
        brandId,
        suggestedPrompt: "Lululemon Align vs Alo Yoga Airlift: which has better waistband compression?",
        intentCategory: "Consideration",
        topicCluster: "Align Fabric & Leggings",
        estimatedRelevance: 92,
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "opp-lulu-3",
        brandId,
        suggestedPrompt: "Is the Lululemon Scuba Oversized Half-Zip hoodie worth $118?",
        intentCategory: "Commercial",
        topicCluster: "Outerwear & Hoodies",
        estimatedRelevance: 89,
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "opp-lulu-4",
        brandId,
        suggestedPrompt: "Best dupe for Lululemon Everywhere Belt Bag under $30",
        intentCategory: "Discovery",
        topicCluster: "Accessories & Bags",
        estimatedRelevance: 85,
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  if (isNike) {
    return [
      {
        id: "opp-nike-1",
        brandId,
        suggestedPrompt: "Best cushioned marathon running shoes for daily road miles in 2026",
        intentCategory: "Discovery",
        topicCluster: "Marathon & Road Running",
        estimatedRelevance: 97,
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "opp-nike-2",
        brandId,
        suggestedPrompt: "Nike Pegasus 41 vs Adidas Boston 12: which lasts longer for high mileage?",
        intentCategory: "Consideration",
        topicCluster: "Marathon & Road Running",
        estimatedRelevance: 94,
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "opp-nike-3",
        brandId,
        suggestedPrompt: "Where can I buy authentic Jordan 4 Retro sneakers at retail price?",
        intentCategory: "Commercial",
        topicCluster: "Jordan Lifestyle & Streetwear",
        estimatedRelevance: 91,
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Default Gymshark seeded opportunities
  return [
    {
      id: "opp-gs-1",
      brandId,
      suggestedPrompt: "What are the most squat-proof seamless gym leggings that don't roll down?",
      intentCategory: "Discovery",
      topicCluster: "Seamless Activewear & Leggings",
      estimatedRelevance: 98,
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "opp-gs-2",
      brandId,
      suggestedPrompt: "Gymshark Vital Seamless 2.0 vs Lululemon Wunder Train for heavy lifting",
      intentCategory: "Consideration",
      topicCluster: "Seamless Activewear & Leggings",
      estimatedRelevance: 95,
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "opp-gs-3",
      brandId,
      suggestedPrompt: "Do Gymshark Power Stringers and oversized tees run true to size?",
      intentCategory: "Consideration",
      topicCluster: "Men's Lifting Apparel",
      estimatedRelevance: 88,
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "opp-gs-4",
      brandId,
      suggestedPrompt: "Best high-support sports bras for running and HIIT under $50",
      intentCategory: "Discovery",
      topicCluster: "Sports Bras & Support",
      estimatedRelevance: 92,
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "opp-gs-5",
      brandId,
      suggestedPrompt: "Is Gymshark activewear worth buying compared to Alo Yoga?",
      intentCategory: "Consideration",
      topicCluster: "Brand Value & Comparison",
      estimatedRelevance: 91,
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "opp-gs-6",
      brandId,
      suggestedPrompt: "Where can I find student discounts for Gymshark lifting gear?",
      intentCategory: "Commercial",
      topicCluster: "Discounts & Commercial Buying",
      estimatedRelevance: 84,
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

/**
 * Generates realistic prompt opportunities via LLM (Gemini 2.0 Flash)
 * or smart heuristic fallback when GEMINI_API_KEY is not configured.
 */
function generateHeuristicOpportunities(
  brandName: string,
  competitorNames: string[],
  catalogContext: string
): Array<{
  suggested_prompt: string;
  intent_category: OpportunityIntent;
  topic_cluster: string;
  estimated_relevance: number;
}> {
  const comp1 = competitorNames[0] || "Competitor";
  const comp2 = competitorNames[1] || "Alternative";
  const categories = catalogContext
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const mainCat = categories[0] || "Activewear";
  const secondCat = categories[1] || "Apparel & Accessories";
  const thirdCat = categories[2] || "Workout Essentials";

  return [
    {
      suggested_prompt: `What are the best high-performance ${mainCat.toLowerCase()} brands for serious athletes in 2026?`,
      intent_category: "Discovery",
      topic_cluster: `${mainCat} Discovery`,
      estimated_relevance: 96,
    },
    {
      suggested_prompt: `Is ${brandName} or ${comp1} better quality for daily workout ${mainCat.toLowerCase()}?`,
      intent_category: "Consideration",
      topic_cluster: "Competitive Head-to-Head",
      estimated_relevance: 94,
    },
    {
      suggested_prompt: `Top rated moisture-wicking ${mainCat.toLowerCase()} with compression waistband`,
      intent_category: "Discovery",
      topic_cluster: `${mainCat} Discovery`,
      estimated_relevance: 92,
    },
    {
      suggested_prompt: `${brandName} sizing review: does their ${mainCat.toLowerCase()} run small or true to size?`,
      intent_category: "Consideration",
      topic_cluster: "Sizing & Durability Inquiries",
      estimated_relevance: 89,
    },
    {
      suggested_prompt: `Where can I buy genuine ${brandName} ${secondCat.toLowerCase()} on sale?`,
      intent_category: "Commercial",
      topic_cluster: "Purchase Intent & Deals",
      estimated_relevance: 87,
    },
    {
      suggested_prompt: `Best alternatives to ${comp1} and ${comp2} for durable ${secondCat.toLowerCase()}`,
      intent_category: "Discovery",
      topic_cluster: "Competitive Head-to-Head",
      estimated_relevance: 91,
    },
    {
      suggested_prompt: `How does ${brandName} fabric compare to ${comp2} for squat-proof gym sessions?`,
      intent_category: "Consideration",
      topic_cluster: "Fabric & Material Performance",
      estimated_relevance: 95,
    },
    {
      suggested_prompt: `Are ${brandName} premium ${thirdCat.toLowerCase()} worth the price tag in 2026?`,
      intent_category: "Consideration",
      topic_cluster: "Brand Value & Comparison",
      estimated_relevance: 90,
    },
    {
      suggested_prompt: `Buy high-support ${thirdCat.toLowerCase()} with free shipping and returns`,
      intent_category: "Commercial",
      topic_cluster: "Purchase Intent & Deals",
      estimated_relevance: 86,
    },
    {
      suggested_prompt: `What are the most aesthetic gym outfits from ${brandName} for weightlifting?`,
      intent_category: "Discovery",
      topic_cluster: "Aesthetic & Style Curation",
      estimated_relevance: 93,
    },
    {
      suggested_prompt: `${brandName} vs ${comp1}: return policy and customer service comparison`,
      intent_category: "Consideration",
      topic_cluster: "Brand Value & Comparison",
      estimated_relevance: 82,
    },
    {
      suggested_prompt: `Top 5 must-have ${brandName} products for beginner gym goers`,
      intent_category: "Discovery",
      topic_cluster: `${mainCat} Discovery`,
      estimated_relevance: 94,
    },
  ];
}

/**
 * Next.js Server Action: Mine Prompt Opportunities Pipeline
 * Accepts brand name, competitor names, and catalog context.
 * Instructs LLM (acting as GEO analyst) to generate 10-15 prompts,
 * then writes them to Supabase / Prisma with 'pending' status.
 */
export async function minePromptOpportunities(
  input: MinePromptOpportunitiesInput
): Promise<{ success: boolean; data?: PromptOpportunity[]; error?: string }> {
  try {
    const { brandId, brandName, competitorNames, catalogContext } = input;
    const catalogString = Array.isArray(catalogContext)
      ? catalogContext.join(", ")
      : catalogContext || "Activewear, Workout Sets, Hoodies, Gym Accessories";

    let rawGenerated: Array<{
      suggested_prompt: string;
      intent_category: OpportunityIntent;
      topic_cluster: string;
      estimated_relevance: number;
    }> = [];

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
You are an expert Generative Engine Optimization (GEO) and AI Search Analyst.
Your task is to autonomously generate 12-15 highly realistic, natural conversational search queries that high-intent consumers type or speak into AI assistants (like ChatGPT Search, Perplexity, Gemini, Claude, and Microsoft Copilot).

TARGET BRAND: ${brandName}
DIRECT COMPETITORS: ${competitorNames.join(", ")}
CATALOG / PRODUCT CATEGORIES: ${catalogString}

GUIDELINES:
1. Prompts must sound like real human queries to an AI engine (e.g. "What are the best squat-proof leggings that don't roll down?", "Gymshark vs Lululemon for heavy deadlifts", "Is the oversized hoodie true to size?").
2. Cover 3 intent categories:
   - "Discovery": Top-of-funnel recommendation and category searches ("best X for Y", "alternatives to Z").
   - "Consideration": Mid-funnel comparative evaluations, sizing, fabric durability, and head-to-head competitor matchups.
   - "Commercial": Bottom-of-funnel buying questions ("where to buy", "is X worth the price", discount or stock inquiries).
3. Group queries into coherent "topic_cluster" groups (3-4 clusters, e.g., "Seamless Performance Leggings", "Head-to-Head Comparisons", "Sizing & Material Durability", "Commercial Deals & Value").
4. Assign an estimated_relevance score between 75 and 99.

OUTPUT FORMAT:
Return strictly a JSON object with this exact structure:
{
  "opportunities": [
    {
      "suggested_prompt": "string query text",
      "intent_category": "Discovery" | "Consideration" | "Commercial",
      "topic_cluster": "string cluster name",
      "estimated_relevance": 85
    }
  ]
}
`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text || "{}";
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.opportunities) && parsed.opportunities.length > 0) {
          rawGenerated = parsed.opportunities.map((item: any) => ({
            suggested_prompt: String(item.suggested_prompt || ""),
            intent_category: ["Discovery", "Consideration", "Commercial"].includes(item.intent_category)
              ? item.intent_category
              : "Discovery",
            topic_cluster: String(item.topic_cluster || "General Discovery"),
            estimated_relevance: Math.min(100, Math.max(50, Number(item.estimated_relevance) || 85)),
          }));
        }
      } catch (llmErr) {
        console.warn("LLM generation fallback triggered in minePromptOpportunities:", llmErr);
      }
    }

    // Heuristic fallback if LLM returned empty or apiKey is missing
    if (rawGenerated.length === 0) {
      rawGenerated = generateHeuristicOpportunities(brandName, competitorNames, catalogString);
    }

    const newRows: PromptOpportunity[] = rawGenerated.map((item, idx) => ({
      id: `opp-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      brandId,
      suggestedPrompt: item.suggested_prompt,
      intentCategory: item.intent_category,
      topicCluster: item.topic_cluster,
      estimatedRelevance: item.estimated_relevance,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Try inserting into Supabase first
    try {
      const supabase = createClient();
      const dbPayload = newRows.map((r) => ({
        id: r.id.startsWith("opp-") ? undefined : r.id, // allow DB uuid default if needed
        brand_id: r.brandId,
        suggested_prompt: r.suggestedPrompt,
        intent_category: r.intentCategory,
        topic_cluster: r.topicCluster,
        estimated_relevance: r.estimatedRelevance,
        status: "pending",
      }));

      const { data, error } = await supabase
        .from("prompt_opportunities")
        .insert(dbPayload)
        .select();

      if (!error && data && data.length > 0) {
        const persisted: PromptOpportunity[] = data.map((d: any) => ({
          id: d.id,
          brandId: d.brand_id,
          suggestedPrompt: d.suggested_prompt,
          intentCategory: d.intent_category as OpportunityIntent,
          topicCluster: d.topic_cluster,
          estimatedRelevance: d.estimated_relevance,
          status: d.status as OpportunityStatus,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));

        // Update in-memory cache as well
        const existing = inMemoryOpportunitiesStore.get(brandId) || [];
        inMemoryOpportunitiesStore.set(brandId, [...persisted, ...existing]);

        revalidatePath("/tools/growth");
        return { success: true, data: persisted };
      }
    } catch (sbError) {
      // Supabase table pending migration, proceed to fallback cache
    }

    // Save to in-memory store for instant zero-config availability
    const existing = inMemoryOpportunitiesStore.get(brandId) || getInitialSeededOpportunities(brandId, brandName);
    const combined = [...newRows, ...existing];
    inMemoryOpportunitiesStore.set(brandId, combined);

    revalidatePath("/tools/growth");
    return { success: true, data: newRows };
  } catch (error: any) {
    console.error("Error in minePromptOpportunities:", error);
    return { success: false, error: error?.message || "Failed to mine prompt opportunities" };
  }
}

/**
 * Server Action: Fetches prompt opportunities for a brand.
 * Supports status filtering ('all', 'pending', 'accepted', 'dismissed').
 */
export async function getPromptOpportunitiesAction(
  brandId: string,
  statusFilter: OpportunityStatus | "all" = "all"
): Promise<PromptOpportunity[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("prompt_opportunities")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        brandId: d.brand_id,
        suggestedPrompt: d.suggested_prompt,
        intentCategory: d.intent_category as OpportunityIntent,
        topicCluster: d.topic_cluster,
        estimatedRelevance: d.estimated_relevance,
        status: d.status as OpportunityStatus,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch (sbErr) {
    // Database query fallback
  }

  // Fallback to in-memory store or seeded items
  if (!inMemoryOpportunitiesStore.has(brandId)) {
    inMemoryOpportunitiesStore.set(brandId, getInitialSeededOpportunities(brandId, "Gymshark"));
  }

  const items = inMemoryOpportunitiesStore.get(brandId) || [];
  if (statusFilter === "all") {
    return items;
  }
  return items.filter((item) => item.status === statusFilter);
}

/**
 * Server Action: Tracks a prompt opportunity
 * 1. Updates status in prompt_opportunities to 'accepted'
 * 2. Adds prompt to main prompts table for active monitoring
 */
export async function trackOpportunityAction(
  opportunityId: string,
  brandId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Fetch the opportunity details
    let opportunity: PromptOpportunity | undefined;

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("prompt_opportunities")
        .select("*")
        .eq("id", opportunityId)
        .single();

      if (data) {
        opportunity = {
          id: data.id,
          brandId: data.brand_id,
          suggestedPrompt: data.suggested_prompt,
          intentCategory: data.intent_category,
          topicCluster: data.topic_cluster,
          estimatedRelevance: data.estimated_relevance,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // ignore
    }

    if (!opportunity) {
      const items = inMemoryOpportunitiesStore.get(brandId) || [];
      opportunity = items.find((i) => i.id === opportunityId);
    }

    const promptText = opportunity?.suggestedPrompt || "New Discovered Query";
    const topicCluster = opportunity?.topicCluster || "Growth Opportunities";
    const intent = opportunity?.intentCategory || "Discovery";

    // 2. Insert into the main prompts table (Prisma / Supabase)
    try {
      await prisma.prompt.create({
        data: {
          brandId,
          queryText: promptText,
          frequency: "daily",
          targetEngines: ["chatgpt", "gemini", "perplexity", "claude"],
          promptType: "Recommendation",
          brandedType: "Unbranded",
          searchIntent: intent === "Discovery" ? "Commercial" : intent,
          promptCategory: topicCluster,
        } as any,
      });
    } catch (prismaErr) {
      console.warn("Could not insert prompt into main table via Prisma:", prismaErr);
    }

    // 3. Update opportunity status in Supabase
    try {
      const supabase = createClient();
      await supabase
        .from("prompt_opportunities")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", opportunityId);
    } catch {
      // ignore
    }

    // 4. Update in-memory store
    const list = inMemoryOpportunitiesStore.get(brandId) || [];
    inMemoryOpportunitiesStore.set(
      brandId,
      list.map((item) =>
        item.id === opportunityId
          ? { ...item, status: "accepted", updatedAt: new Date().toISOString() }
          : item
      )
    );

    revalidatePath("/tools/growth");
    revalidatePath("/tools/prompts");
    return { success: true };
  } catch (err: any) {
    console.error("Error in trackOpportunityAction:", err);
    return { success: false, error: err?.message || "Failed to track opportunity" };
  }
}

/**
 * Server Action: Dismisses a prompt opportunity
 * Updates status in prompt_opportunities to 'dismissed'
 */
export async function dismissOpportunityAction(
  opportunityId: string,
  brandId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    try {
      const supabase = createClient();
      await supabase
        .from("prompt_opportunities")
        .update({ status: "dismissed", updated_at: new Date().toISOString() })
        .eq("id", opportunityId);
    } catch {
      // ignore
    }

    const list = inMemoryOpportunitiesStore.get(brandId) || [];
    inMemoryOpportunitiesStore.set(
      brandId,
      list.map((item) =>
        item.id === opportunityId
          ? { ...item, status: "dismissed", updatedAt: new Date().toISOString() }
          : item
      )
    );

    revalidatePath("/tools/growth");
    return { success: true };
  } catch (err: any) {
    console.error("Error in dismissOpportunityAction:", err);
    return { success: false, error: err?.message || "Failed to dismiss opportunity" };
  }
}

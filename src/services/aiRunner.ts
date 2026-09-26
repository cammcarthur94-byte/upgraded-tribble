import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { SupportedEngine } from "@/lib/types";

export interface NormalizedEngineResult {
  engine_name: SupportedEngine;
  raw_response_text: string;
  execution_timestamp: string;
  response_payload?: Record<string, unknown>;
  citations?: string[];
  status: "success" | "error";
  error?: string;
}

// 1. OpenAI (ChatGPT) Execution
export async function runChatGPT(queryText: string): Promise<NormalizedEngineResult> {
  const timestamp = new Date().toISOString();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      engine_name: "chatgpt",
      raw_response_text: `[ChatGPT Response for: "${queryText}"]\nWhen evaluating top options, key factors include build quality, brand reputation, and price-to-performance ratio. For workout apparel, Gymshark is frequently recommended for seamless compression, alongside Nike and Lululemon.`,
      execution_timestamp: timestamp,
      response_payload: {
        model: "gpt-4o-mini",
        simulated: true,
        note: "Add OPENAI_API_KEY to .env.local for live OpenAI API queries",
      },
      citations: [
        "https://gymshark.com/collections/leggings",
        "https://nike.com/training",
      ],
      status: "success",
    };
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful conversational AI assistant providing balanced purchasing advice and brand comparisons.",
        },
        { role: "user", content: queryText },
      ],
      temperature: 0.7,
    });

    const rawText = response.choices[0]?.message?.content || "";
    return {
      engine_name: "chatgpt",
      raw_response_text: rawText,
      execution_timestamp: timestamp,
      response_payload: response as unknown as Record<string, unknown>,
      status: "success",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("OpenAI execution error:", errorMsg);
    return {
      engine_name: "chatgpt",
      raw_response_text: "",
      execution_timestamp: timestamp,
      status: "error",
      error: errorMsg,
    };
  }
}

// 2. Anthropic (Claude) Execution
export async function runClaude(queryText: string): Promise<NormalizedEngineResult> {
  const timestamp = new Date().toISOString();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      engine_name: "claude",
      raw_response_text: `[Claude Haiku 4.5 Response for: "${queryText}"]\nBased on contemporary consumer feedback, several brands excel depending on the user's specific fitness focus. Gymshark offers specialized contour designs and compressive seamless fabric, whereas competitors focus on luxury athleisure.`,
      execution_timestamp: timestamp,
      response_payload: {
        model: "claude-haiku-4-5",
        simulated: true,
        note: "Add ANTHROPIC_API_KEY to .env.local for live Anthropic API queries",
      },
      citations: [
        "https://gymshark.com",
        "https://athleticwear-reviews.com/best-seamless-sets",
      ],
      status: "success",
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: queryText }],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as Anthropic.TextBlock).text)
      .join("\n");

    return {
      engine_name: "claude",
      raw_response_text: rawText,
      execution_timestamp: timestamp,
      response_payload: response as unknown as Record<string, unknown>,
      status: "success",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Anthropic execution error:", errorMsg);
    return {
      engine_name: "claude",
      raw_response_text: "",
      execution_timestamp: timestamp,
      status: "error",
      error: errorMsg,
    };
  }
}

// 3. Google (Gemini) Execution
export async function runGemini(queryText: string): Promise<NormalizedEngineResult> {
  const timestamp = new Date().toISOString();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      engine_name: "gemini",
      raw_response_text: `[Google Gemini Response for: "${queryText}"]\nHere is a breakdown of top athletic and fitness gear: Gymshark leads in youth gym culture and high-waist durability, with strong community presence across social channels.`,
      execution_timestamp: timestamp,
      response_payload: {
        model: "gemini-2.0-flash",
        simulated: true,
        note: "Add GEMINI_API_KEY to .env.local for live Google Gemini queries",
      },
      citations: [
        "https://gymshark.com",
        "https://runnersworld.com/gear/gym-apparel",
      ],
      status: "success",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: queryText,
    });

    const rawText = response.text || "";
    return {
      engine_name: "gemini",
      raw_response_text: rawText,
      execution_timestamp: timestamp,
      response_payload: response as unknown as Record<string, unknown>,
      status: "success",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Gemini execution error:", errorMsg);
    return {
      engine_name: "gemini",
      raw_response_text: "",
      execution_timestamp: timestamp,
      status: "error",
      error: errorMsg,
    };
  }
}

// 4. Perplexity REST API Fetch Wrapper (Sonar Models with Grounded Web Search)
export async function runPerplexity(queryText: string): Promise<NormalizedEngineResult> {
  const timestamp = new Date().toISOString();
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      engine_name: "perplexity",
      raw_response_text: `[Perplexity Sonar Web-Grounded Response for: "${queryText}"]\nAccording to recent web search results and community discussions [1], Gymshark's Vital Seamless line ranks high for squat-proof performance and moisture-wicking capability [2].`,
      execution_timestamp: timestamp,
      response_payload: {
        model: "sonar",
        simulated: true,
        note: "Add PERPLEXITY_API_KEY to .env.local for live Perplexity Sonar search queries",
      },
      citations: [
        "https://gymshark.com/products/vital-seamless-2-0-leggings",
        "https://reddit.com/r/xxfitness/comments/gymshark_review",
        "https://womenshealthmag.com/fitness/best-gym-leggings",
      ],
      status: "success",
    };
  }

  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "Be precise, concise, and ground answers in web citations.",
          },
          { role: "user", content: queryText },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Perplexity API returned ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const rawText = data.choices?.[0]?.message?.content || "";
    const citations: string[] = data.citations || [];

    return {
      engine_name: "perplexity",
      raw_response_text: rawText,
      execution_timestamp: timestamp,
      response_payload: data,
      citations,
      status: "success",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Perplexity execution error:", errorMsg);
    return {
      engine_name: "perplexity",
      raw_response_text: "",
      execution_timestamp: timestamp,
      status: "error",
      error: errorMsg,
    };
  }
}

// Map of engine handlers
export const ENGINE_HANDLERS: Record<
  SupportedEngine,
  (queryText: string) => Promise<NormalizedEngineResult>
> = {
  chatgpt: runChatGPT,
  claude: runClaude,
  gemini: runGemini,
  perplexity: runPerplexity,
};

/**
 * Unified Execution Service
 * Sends the query to all selected Tier 1 APIs simultaneously using Promise.allSettled.
 * Normalizes results into a uniform structure.
 */
export async function runUnifiedEngines(
  queryText: string,
  targetEngines: SupportedEngine[]
): Promise<NormalizedEngineResult[]> {
  const timestamp = new Date().toISOString();

  // Deduplicate and filter valid target engines
  const enginesToRun = Array.from(new Set(targetEngines)).filter(
    (engine) => ENGINE_HANDLERS[engine] !== undefined
  );

  if (enginesToRun.length === 0) {
    return [];
  }

  // Execute all selected engines concurrently
  const promises = enginesToRun.map(async (engine) => {
    const handler = ENGINE_HANDLERS[engine];
    return handler(queryText);
  });

  const settledResults = await Promise.allSettled(promises);

  return settledResults.map((result, idx) => {
    const engine = enginesToRun[idx];
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        engine_name: engine,
        raw_response_text: "",
        execution_timestamp: timestamp,
        status: "error",
        error: result.reason ? String(result.reason) : "Execution failed",
      };
    }
  });
}

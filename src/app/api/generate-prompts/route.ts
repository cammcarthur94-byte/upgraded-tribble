import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productCategory, targetPersona } = body;

    if (!productCategory || !productCategory.trim()) {
      return NextResponse.json(
        { error: "Product category is required" },
        { status: 400 }
      );
    }

    const category = productCategory.trim();
    const persona = targetPersona ? targetPersona.trim() : "buyers";

    // If OpenAI API key is available, call OpenAI gpt-4o-mini
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `You are an expert in Generative Engine Optimization (GEO) and AI Engine Optimization (AEO).
Generate exactly 5 natural, high-intent conversational search queries that ${persona} ask AI assistants (ChatGPT, Claude, Gemini, Perplexity) when researching and looking for purchasing recommendations for: "${category}".

Guidelines:
- Each query must sound like a real user prompt to an AI assistant.
- Focus on commercial and high purchasing intent (comparisons, best recommendations, features, price-to-performance).
- Return ONLY a JSON array containing 5 strings, with no markdown formatting or commentary. Example format: ["query 1", "query 2", "query 3", "query 4", "query 5"]`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content?.trim() || "";
        // Clean markdown backticks if any
        const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({ prompts: parsed.slice(0, 5) });
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to heuristic generator:", err);
      }
    }

    // High-quality contextual fallback generation
    const fallbackPrompts = [
      `What is the best ${category} specifically built for ${persona}?`,
      `Top rated ${category} alternatives for ${persona} with fast setup and proven results`,
      `Compare the leading ${category} platforms for ${persona} in 2026`,
      `Which ${category} do most experienced ${persona} recommend and why?`,
      `What are the most cost-effective ${category} solutions for ${persona} looking to scale?`,
    ];

    return NextResponse.json({ prompts: fallbackPrompts });
  } catch (error) {
    console.error("Error generating prompts:", error);
    return NextResponse.json(
      { error: "Failed to generate prompts" },
      { status: 500 }
    );
  }
}

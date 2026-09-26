"use server";

import { getEngineInsights, EngineInsightsReport } from "@/lib/scoring/modelInsights";

export async function getModelInsightsAction(
  brandId: string,
  timeframeDays: number = 30
): Promise<EngineInsightsReport> {
  try {
    return await getEngineInsights(brandId, timeframeDays);
  } catch (error) {
    console.error("getModelInsightsAction error:", error);
    // Fallback to 30 days
    return await getEngineInsights(brandId, 30);
  }
}

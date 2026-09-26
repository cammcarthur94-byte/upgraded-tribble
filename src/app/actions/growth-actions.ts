"use server";

import { prisma } from "@/lib/prisma";
import { aggregateBrandScores } from "@/services/rollupService";
import { generateGrowthOpportunities } from "@/services/growthEngine";
import { GrowthOpportunity, BrandData } from "@/lib/types";
import { MOCK_BRANDS } from "@/lib/mock-data";

export async function getGrowthOpportunitiesAction(
  brandId: string
): Promise<GrowthOpportunity[]> {
  try {
    let brand: BrandData | null = null;

    try {
      const dbBrand = await prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (dbBrand) {
        brand = {
          id: dbBrand.id,
          userId: dbBrand.userId,
          brandName: dbBrand.brandName,
          domain: dbBrand.domain,
          competitors: dbBrand.competitors,
        };
      }
    } catch {
      // Database fallback
    }

    if (!brand) {
      brand = MOCK_BRANDS.find((b) => b.id === brandId) || MOCK_BRANDS[0];
    }

    const { breakdown } = await aggregateBrandScores(brandId);
    return await generateGrowthOpportunities({ brand, breakdown });
  } catch (err) {
    console.error(`getGrowthOpportunitiesAction error for ${brandId}:`, err);
    return [];
  }
}

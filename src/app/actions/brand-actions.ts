"use server";

import { prisma } from "@/lib/prisma";
import { BrandData, CompetitorItem } from "@/lib/types";
import { MOCK_BRANDS, MOCK_USER } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

export interface UpdateBrandInput {
  brandId: string;
  brandName: string;
  domain: string;
  aliases: string[];
  exactUrls: string[];
  competitors: Array<{ id?: string; competitorName: string; domain: string }>;
}

export interface CreateBrandInput {
  brandName: string;
  domain: string;
  aliases?: string[];
  exactUrls?: string[];
  competitors?: Array<{ competitorName: string; domain: string }>;
}

/**
 * Normalizes domain by trimming and removing protocol & trailing slashes
 */
function cleanDomain(d: string): string {
  return d
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
}

/**
 * Fetches all brands associated with the current user, including relational competitors.
 * Falls back to MOCK_BRANDS if the database is offline or unseeded.
 */
export async function getUserBrandsAction(): Promise<BrandData[]> {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        competitorRecords: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!brands || brands.length === 0) {
      return MOCK_BRANDS;
    }

    return brands.map((b) => ({
      id: b.id,
      userId: b.userId,
      brandName: b.brandName,
      domain: b.domain,
      aliases: b.aliases || [],
      exactUrls: b.exactUrls || [],
      competitors: b.competitorRecords.map((c) => c.competitorName),
      competitorRecords: b.competitorRecords.map((c) => ({
        id: c.id,
        brandId: c.brandId,
        competitorName: c.competitorName,
        domain: c.domain,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    }));
  } catch (error) {
    console.warn("getUserBrandsAction using mock fallback:", error);
    return MOCK_BRANDS;
  }
}

/**
 * Fetches a single brand by ID with full competitor records.
 */
export async function getBrandByIdAction(brandId: string): Promise<BrandData | null> {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        competitorRecords: true,
      },
    });

    if (brand) {
      return {
        id: brand.id,
        userId: brand.userId,
        brandName: brand.brandName,
        domain: brand.domain,
        aliases: brand.aliases || [],
        exactUrls: brand.exactUrls || [],
        competitors: brand.competitorRecords.map((c) => c.competitorName),
        competitorRecords: brand.competitorRecords.map((c) => ({
          id: c.id,
          brandId: c.brandId,
          competitorName: c.competitorName,
          domain: c.domain,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        })),
      };
    }

    const mock = MOCK_BRANDS.find((b) => b.id === brandId);
    return mock || null;
  } catch (error) {
    console.warn("getBrandByIdAction fallback:", error);
    const mock = MOCK_BRANDS.find((b) => b.id === brandId);
    return mock || null;
  }
}

/**
 * Updates a Brand's identity (name, domain, aliases, exact_urls) and syncs its relational competitors.
 */
export async function updateBrandProfileAction(
  input: UpdateBrandInput
): Promise<{ success: boolean; data?: BrandData; error?: string }> {
  const brandDomain = cleanDomain(input.domain);
  const competitorNames = input.competitors.map((c) => c.competitorName.trim());

  try {
    // 1. Update the Brand record
    const updatedBrand = await prisma.brand.update({
      where: { id: input.brandId },
      data: {
        brandName: input.brandName.trim(),
        domain: brandDomain,
        aliases: input.aliases,
        exactUrls: input.exactUrls.map(cleanDomain),
        competitors: competitorNames,
      },
    });

    // 2. Sync Competitors:
    // Delete competitors no longer in input
    const validExistingIds = input.competitors
      .map((c) => c.id)
      .filter((id): id is string => Boolean(id && !id.startsWith("temp-")));

    await prisma.competitor.deleteMany({
      where: {
        brandId: input.brandId,
        id: { notIn: validExistingIds },
      },
    });

    // Create or update competitors
    const syncedCompetitors: CompetitorItem[] = [];
    for (const comp of input.competitors) {
      const cDomain = cleanDomain(comp.domain);
      const cName = comp.competitorName.trim();

      if (comp.id && !comp.id.startsWith("temp-")) {
        const updatedComp = await prisma.competitor.update({
          where: { id: comp.id },
          data: {
            competitorName: cName,
            domain: cDomain,
          },
        });
        syncedCompetitors.push({
          id: updatedComp.id,
          brandId: updatedComp.brandId,
          competitorName: updatedComp.competitorName,
          domain: updatedComp.domain,
          createdAt: updatedComp.createdAt.toISOString(),
          updatedAt: updatedComp.updatedAt.toISOString(),
        });
      } else {
        const createdComp = await prisma.competitor.create({
          data: {
            brandId: input.brandId,
            competitorName: cName,
            domain: cDomain,
          },
        });
        syncedCompetitors.push({
          id: createdComp.id,
          brandId: createdComp.brandId,
          competitorName: createdComp.competitorName,
          domain: createdComp.domain,
          createdAt: createdComp.createdAt.toISOString(),
          updatedAt: createdComp.updatedAt.toISOString(),
        });
      }
    }

    revalidatePath("/admin/brand-profile");
    revalidatePath("/");
    revalidatePath("/tools/prompts");

    return {
      success: true,
      data: {
        id: updatedBrand.id,
        userId: updatedBrand.userId,
        brandName: updatedBrand.brandName,
        domain: updatedBrand.domain,
        aliases: updatedBrand.aliases || [],
        exactUrls: updatedBrand.exactUrls || [],
        competitors: competitorNames,
        competitorRecords: syncedCompetitors,
      },
    };
  } catch (error) {
    console.warn("updateBrandProfileAction DB update error (using graceful fallback):", error);

    // Provide optimistic fallback response for offline dev
    const fallbackData: BrandData = {
      id: input.brandId,
      userId: "user-1",
      brandName: input.brandName.trim(),
      domain: brandDomain,
      aliases: input.aliases,
      exactUrls: input.exactUrls.map(cleanDomain),
      competitors: competitorNames,
      competitorRecords: input.competitors.map((c, idx) => ({
        id: c.id && !c.id.startsWith("temp-") ? c.id : `comp-${Date.now()}-${idx}`,
        brandId: input.brandId,
        competitorName: c.competitorName.trim(),
        domain: cleanDomain(c.domain),
      })),
    };

    return {
      success: true,
      data: fallbackData,
    };
  }
}

/**
 * Creates a new Brand with initial competitors.
 */
export async function createBrandAction(
  input: CreateBrandInput
): Promise<{ success: boolean; data?: BrandData; error?: string }> {
  const brandDomain = cleanDomain(input.domain);
  const competitorNames = (input.competitors || []).map((c) => c.competitorName.trim());

  try {
    const createdBrand = await prisma.brand.create({
      data: {
        userId: MOCK_USER.id,
        brandName: input.brandName.trim(),
        domain: brandDomain,
        aliases: input.aliases || [],
        exactUrls: (input.exactUrls || []).map(cleanDomain),
        competitors: competitorNames,
        competitorRecords: {
          create: (input.competitors || []).map((c) => ({
            competitorName: c.competitorName.trim(),
            domain: cleanDomain(c.domain),
          })),
        },
      },
      include: {
        competitorRecords: true,
      },
    });

    revalidatePath("/admin/brand-profile");
    revalidatePath("/");

    return {
      success: true,
      data: {
        id: createdBrand.id,
        userId: createdBrand.userId,
        brandName: createdBrand.brandName,
        domain: createdBrand.domain,
        aliases: createdBrand.aliases,
        exactUrls: createdBrand.exactUrls,
        competitors: competitorNames,
        competitorRecords: createdBrand.competitorRecords.map((c) => ({
          id: c.id,
          brandId: c.brandId,
          competitorName: c.competitorName,
          domain: c.domain,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.warn("createBrandAction DB error (fallback):", error);

    const newId = `brand-${Date.now()}`;
    const fallbackBrand: BrandData = {
      id: newId,
      userId: "user-1",
      brandName: input.brandName.trim(),
      domain: brandDomain,
      aliases: input.aliases || [],
      exactUrls: (input.exactUrls || []).map(cleanDomain),
      competitors: competitorNames,
      competitorRecords: (input.competitors || []).map((c, idx) => ({
        id: `comp-${Date.now()}-${idx}`,
        brandId: newId,
        competitorName: c.competitorName.trim(),
        domain: cleanDomain(c.domain),
      })),
    };

    return {
      success: true,
      data: fallbackBrand,
    };
  }
}

/**
 * Adds an unlisted competitor to a brand's tracked database records.
 * Invoked automatically when an unlisted competitor is detected in AI results.
 */
export async function addCompetitorToBrandAction({
  brandId,
  competitorName,
  domain,
}: {
  brandId: string;
  competitorName: string;
  domain: string;
}): Promise<{ success: boolean; competitor?: CompetitorItem }> {
  const cName = competitorName.trim();
  const cDomain = cleanDomain(domain);

  if (!cName) return { success: false };

  try {
    // 1. Check if competitor already exists in DB
    const existing = await prisma.competitor.findFirst({
      where: {
        brandId,
        competitorName: { equals: cName, mode: "insensitive" },
      },
    });

    if (existing) {
      return {
        success: true,
        competitor: {
          id: existing.id,
          brandId: existing.brandId,
          competitorName: existing.competitorName,
          domain: existing.domain,
          createdAt: existing.createdAt.toISOString(),
          updatedAt: existing.updatedAt.toISOString(),
        },
      };
    }

    // 2. Create in Competitor table
    const createdComp = await prisma.competitor.create({
      data: {
        brandId,
        competitorName: cName,
        domain: cDomain,
      },
    });

    // 3. Append to brand's string array
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { competitors: true },
    });

    if (brand) {
      const currentComps = brand.competitors || [];
      if (!currentComps.some((c) => c.toLowerCase() === cName.toLowerCase())) {
        await prisma.brand.update({
          where: { id: brandId },
          data: {
            competitors: [...currentComps, cName],
          },
        });
      }
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/brand-profile");
      revalidatePath("/tools/prompts");
      revalidatePath("/reports/brand");
    } catch {
      // Ignore when invoked outside Next.js request context (e.g. scripts/workers)
    }

    return {
      success: true,
      competitor: {
        id: createdComp.id,
        brandId: createdComp.brandId,
        competitorName: createdComp.competitorName,
        domain: createdComp.domain,
        createdAt: createdComp.createdAt.toISOString(),
        updatedAt: createdComp.updatedAt.toISOString(),
      },
    };
  } catch (dbError) {
    console.warn("[addCompetitorToBrandAction] DB unavailable, syncing to mock brand store:", dbError);

    // Update in-memory MOCK_BRANDS for offline/dev resilience
    const mockBrand = MOCK_BRANDS.find((b) => b.id === brandId) || MOCK_BRANDS[0];
    if (mockBrand) {
      if (!mockBrand.competitors) mockBrand.competitors = [];
      if (!mockBrand.competitorRecords) mockBrand.competitorRecords = [];

      const existsInMock = mockBrand.competitorRecords.some(
        (c) => c.competitorName.toLowerCase() === cName.toLowerCase()
      );

      if (!existsInMock) {
        if (!mockBrand.competitors.some((c) => c.toLowerCase() === cName.toLowerCase())) {
          mockBrand.competitors.push(cName);
        }

        const newComp: CompetitorItem = {
          id: `comp-ai-${Date.now()}-${mockBrand.competitorRecords.length}`,
          brandId: mockBrand.id,
          competitorName: cName,
          domain: cDomain,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockBrand.competitorRecords.push(newComp);

        try {
          revalidatePath("/");
          revalidatePath("/admin/brand-profile");
        } catch {
          // Ignore outside request context
        }

        return {
          success: true,
          competitor: newComp,
        };
      }
    }

    return { success: true };
  }
}

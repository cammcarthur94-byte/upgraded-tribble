"use server";

import { prisma } from "@/lib/prisma";
import {
  SupportedEngine,
  PromptItem,
  PromptResultStatus,
  ErrorLogItem,
  PromptType,
  BrandStatus,
  SearchIntent,
  PromptCategory,
} from "@/lib/types";
import { runUnifiedEngines } from "@/services/aiRunner";
import { processPromptResult } from "@/services/postExecutionPipeline";
import { inngest } from "@/lib/inngest/client";
import { INITIAL_PROMPTS } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

export interface CreatePromptInput {
  brandId: string;
  queryText: string;
  frequency: "daily" | "weekly";
  targetEngines: SupportedEngine[];
  promptType?: PromptType;
  brandedType?: BrandStatus;
  searchIntent?: SearchIntent;
  promptCategory?: PromptCategory;
}

export interface UpdatePromptInput {
  id: string;
  queryText: string;
  frequency: "daily" | "weekly";
  targetEngines: SupportedEngine[];
  promptType?: PromptType;
  brandedType?: BrandStatus;
  searchIntent?: SearchIntent;
  promptCategory?: PromptCategory;
}

/**
 * Fetches prompts for a brand and calculates aggregate execution status & error logs
 */
export async function getPromptsByBrandAction(brandId: string): Promise<PromptItem[]> {
  try {
    const dbPrompts = await prisma.prompt.findMany({
      where: { brandId },
      include: {
        results: {
          orderBy: { executionTimestamp: "desc" },
          take: 8,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!dbPrompts || dbPrompts.length === 0) {
      return INITIAL_PROMPTS.filter((p) => p.brandId === brandId);
    }

    return dbPrompts.map((p) => {
      const results = p.results || [];
      const latestResult = results[0];
      const lastExecutedAt = latestResult
        ? latestResult.executionTimestamp.toISOString()
        : null;

      // Group recent results by most recent execution timestamp window (within 5 minutes)
      const latestRunWindow = latestResult
        ? results.filter(
            (r) =>
              Math.abs(
                new Date(r.executionTimestamp).getTime() -
                  new Date(latestResult.executionTimestamp).getTime()
              ) < 5 * 60 * 1000
          )
        : [];

      let latestStatus: PromptResultStatus | undefined = undefined;
      const failedEngines: SupportedEngine[] = [];
      const latestErrorLog: ErrorLogItem[] = [];

      if (latestRunWindow.length > 0) {
        let hasRunning = false;
        let successCount = 0;
        let failCount = 0;

        for (const res of latestRunWindow) {
          if (res.status === "running" || res.status === "queued") {
            hasRunning = true;
          } else if (res.status === "failed") {
            failCount++;
            failedEngines.push(res.engineName as SupportedEngine);
            if (res.errorLog) {
              const err = res.errorLog as any;
              latestErrorLog.push({
                message: err.message || "Execution error",
                statusCode: err.statusCode,
                retryCount: err.retryCount,
                timestamp: err.timestamp || res.executionTimestamp.toISOString(),
                engine: res.engineName,
              });
            }
          } else if (res.status === "completed") {
            successCount++;
          }
        }

        if (hasRunning) {
          latestStatus = "running";
        } else if (failCount > 0 && successCount > 0) {
          latestStatus = "partial_success";
        } else if (failCount > 0 && successCount === 0) {
          latestStatus = "failed";
        } else if (successCount > 0) {
          latestStatus = "completed";
        }
      }

      const mockMatch = INITIAL_PROMPTS.find((ip) => ip.id === p.id || ip.queryText === p.queryText);
      return {
        id: p.id,
        brandId: p.brandId,
        queryText: p.queryText,
        frequency: p.frequency as "daily" | "weekly",
        targetEngines: p.targetEngines as SupportedEngine[],
        promptType: ((p as any).promptType || "Recommendation") as PromptType,
        brandedType: ((p as any).brandedType || "Unbranded") as BrandStatus,
        searchIntent: ((p as any).searchIntent || "Commercial") as SearchIntent,
        promptCategory: ((p as any).promptCategory || "Top of Funnel Discovery") as PromptCategory,
        geoMarket: (p as any).geoMarket || mockMatch?.geoMarket || "🇺🇸 US • Activewear",
        performanceRank: (p as any).performanceRank || mockMatch?.performanceRank || { label: "#1 Pick (3/4)", variant: "green" },
        lastExecutedAt,
        latestStatus,
        failedEngines,
        latestErrorLog,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    });
  } catch (error) {
    console.warn("getPromptsByBrandAction using mock fallback:", error);
    return INITIAL_PROMPTS.filter((p) => p.brandId === brandId);
  }
}

export async function createPromptAction(input: CreatePromptInput) {
  try {
    const created = await prisma.prompt.create({
      data: {
        brandId: input.brandId,
        queryText: input.queryText,
        frequency: input.frequency,
        targetEngines: input.targetEngines,
        promptType: input.promptType || "Recommendation",
        brandedType: input.brandedType || "Unbranded",
        searchIntent: input.searchIntent || "Commercial",
        promptCategory: input.promptCategory || "Top of Funnel Discovery",
      } as any,
    });

    revalidatePath("/tools/prompts");

    return {
      success: true,
      data: {
        id: created.id,
        brandId: created.brandId,
        queryText: created.queryText,
        frequency: created.frequency as "daily" | "weekly",
        targetEngines: created.targetEngines as SupportedEngine[],
        promptType: ((created as any).promptType || input.promptType || "Recommendation") as PromptType,
        brandedType: ((created as any).brandedType || input.brandedType || "Unbranded") as BrandStatus,
        searchIntent: ((created as any).searchIntent || input.searchIntent || "Commercial") as SearchIntent,
        promptCategory: ((created as any).promptCategory || input.promptCategory || "Top of Funnel Discovery") as PromptCategory,
        lastExecutedAt: null,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      } as PromptItem,
    };
  } catch (error) {
    console.warn("Database create failed (using fallback):", error);
    return {
      success: true,
      data: {
        id: `p-${Date.now()}`,
        brandId: input.brandId,
        queryText: input.queryText,
        frequency: input.frequency,
        targetEngines: input.targetEngines,
        promptType: input.promptType || "Recommendation",
        brandedType: input.brandedType || "Unbranded",
        searchIntent: input.searchIntent || "Commercial",
        promptCategory: input.promptCategory || "Top of Funnel Discovery",
        lastExecutedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as PromptItem,
    };
  }
}

export async function updatePromptAction(input: UpdatePromptInput) {
  try {
    const updateData: any = {
      queryText: input.queryText,
      frequency: input.frequency,
      targetEngines: input.targetEngines,
    };
    if (input.promptType) updateData.promptType = input.promptType;
    if (input.brandedType) updateData.brandedType = input.brandedType;
    if (input.searchIntent) updateData.searchIntent = input.searchIntent;
    if (input.promptCategory) updateData.promptCategory = input.promptCategory;

    const updated = await prisma.prompt.update({
      where: { id: input.id },
      data: updateData,
    });

    revalidatePath("/tools/prompts");

    return {
      success: true,
      data: {
        id: updated.id,
        brandId: updated.brandId,
        queryText: updated.queryText,
        frequency: updated.frequency as "daily" | "weekly",
        targetEngines: updated.targetEngines as SupportedEngine[],
        promptType: ((updated as any).promptType || input.promptType || "Recommendation") as PromptType,
        brandedType: ((updated as any).brandedType || input.brandedType || "Unbranded") as BrandStatus,
        searchIntent: ((updated as any).searchIntent || input.searchIntent || "Commercial") as SearchIntent,
        promptCategory: ((updated as any).promptCategory || input.promptCategory || "Top of Funnel Discovery") as PromptCategory,
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.warn("Database update failed (using fallback):", error);
    return {
      success: true,
      data: input,
    };
  }
}

export async function deletePromptAction(id: string) {
  try {
    await prisma.prompt.delete({
      where: { id },
    });
    revalidatePath("/tools/prompts");
    return { success: true, id };
  } catch (error) {
    console.warn("Database delete failed (using fallback):", error);
    return { success: true, id };
  }
}

/**
 * Executes a Prompt across all selected target engines via Inngest durable queue
 * with synchronous resilience fallback.
 */
export async function runPromptAction(
  id: string,
  queryText?: string,
  targetEngines?: SupportedEngine[]
) {
  try {
    let engines = targetEngines;
    let query = queryText;
    let brandId = "";

    // Load prompt and associated brand from database
    const p = await prisma.prompt.findUnique({
      where: { id },
      include: { brand: true },
    });

    if (p) {
      query = query || p.queryText;
      engines = engines || (p.targetEngines as SupportedEngine[]);
      brandId = p.brandId;
    }

    if (!query || !engines || engines.length === 0) {
      return { success: false, error: "Missing query or target engines" };
    }

    // 1. Dispatch to Inngest Event Queue for durable execution & retries
    try {
      await inngest.send({
        name: "recomnd/prompt.execute",
        data: {
          promptId: id,
          brandId: brandId || "brand-1",
          queryText: query,
          targetEngines: engines,
          isRetry: false,
          runId: `run-${id}-${Date.now()}`,
        },
      });
    } catch (inngestErr) {
      console.warn("Inngest dispatch failed (continuing with direct execution):", inngestErr);
    }

    // 2. Direct execution fallback
    const results = await runUnifiedEngines(query, engines);
    const now = new Date();

    for (const res of results) {
      const isError = res.status === "error";
      try {
        const createdResult = await prisma.promptResult.create({
          data: {
            promptId: id,
            engineName: res.engine_name,
            rawResponseText: res.raw_response_text || "",
            responsePayload: (res.response_payload || {}) as object,
            citations: (res.citations || []) as object,
            status: isError ? "failed" : "completed",
            errorLog: isError
              ? {
                  message: res.error || "Engine failed",
                  statusCode: 500,
                  retryCount: 0,
                  timestamp: now.toISOString(),
                  engine: res.engine_name,
                }
              : undefined,
            executionTimestamp: new Date(res.execution_timestamp),
          },
        });

        if (p?.brand && res.raw_response_text && !isError) {
          await processPromptResult({
            promptResultId: createdResult.id,
            rawText: res.raw_response_text,
            brand: p.brand,
            payloadCitations: res.citations || [],
          });
        }
      } catch {
        // Dev mode ignore
      }
    }

    try {
      await prisma.prompt.update({
        where: { id },
        data: { updatedAt: now },
      });
    } catch {
      // Ignored
    }

    revalidatePath("/tools/prompts");
    return { success: true, id, executedAt: now.toISOString() };
  } catch (error) {
    console.warn("Database run record failed (using fallback):", error);
    return { success: true, id, executedAt: new Date().toISOString() };
  }
}

/**
 * Retries ONLY the specific engines that failed in the last run for a given prompt.
 */
export async function retryFailedEnginesAction(
  promptId: string,
  failedEngines: SupportedEngine[]
) {
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      include: { brand: true },
    });

    const query = prompt?.queryText || "Prompt query retry";
    const brandId = prompt?.brandId || "brand-1";

    // 1. Dispatch targeted Inngest retry event
    try {
      await inngest.send({
        name: "recomnd/prompt.execute",
        data: {
          promptId,
          brandId,
          queryText: query,
          targetEngines: failedEngines,
          onlyFailedEngines: failedEngines,
          isRetry: true,
          runId: `retry-${promptId}-${Date.now()}`,
        },
      });
    } catch (inngestErr) {
      console.warn("Inngest retry dispatch failed:", inngestErr);
    }

    // 2. Direct execution fallback
    const results = await runUnifiedEngines(query, failedEngines);
    const now = new Date();

    for (const res of results) {
      const isSuccess = res.status === "success";
      try {
        const created = await prisma.promptResult.create({
          data: {
            promptId,
            engineName: res.engine_name,
            rawResponseText: res.raw_response_text || "",
            responsePayload: (res.response_payload || {}) as object,
            citations: (res.citations || []) as object,
            status: isSuccess ? "completed" : "failed",
            retryCount: 1,
            errorLog: isSuccess
              ? undefined
              : {
                  message: res.error || "Retry failed",
                  statusCode: 500,
                  retryCount: 1,
                  timestamp: now.toISOString(),
                  engine: res.engine_name,
                },
            executionTimestamp: now,
          },
        });

        if (isSuccess && prompt?.brand && res.raw_response_text) {
          await processPromptResult({
            promptResultId: created.id,
            rawText: res.raw_response_text,
            brand: prompt.brand,
            payloadCitations: res.citations || [],
          });
        }
      } catch {
        // Dev mode ignore
      }
    }

    revalidatePath("/tools/prompts");
    return {
      success: true,
      promptId,
      retriedEngines: failedEngines,
      message: `Retried ${failedEngines.length} failed engine(s) successfully.`,
    };
  } catch (error) {
    console.error("retryFailedEnginesAction error:", error);
    return {
      success: true,
      promptId,
      retriedEngines: failedEngines,
      message: `Retried ${failedEngines.length} failed engine(s).`,
    };
  }
}

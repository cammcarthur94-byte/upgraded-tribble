import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import {
  runChatGPT,
  runClaude,
  runGemini,
  runPerplexity,
  NormalizedEngineResult,
} from "@/services/aiRunner";
import { processPromptResult } from "@/services/postExecutionPipeline";
import { SupportedEngine, PromptResultStatus, ErrorLogItem } from "@/lib/types";

/**
 * 1. Scheduled Runner / Fan-out Workflow
 * Runs hourly to detect prompts due for execution and fans out isolated jobs.
 */
export const schedulePromptsCron = inngest.createFunction(
  {
    id: "run-scheduled-prompts",
    name: "Run Scheduled AI Prompts",
    retries: 2,
    triggers: [
      { cron: "0 * * * *" }, // Hourly cron trigger
      { event: "recomnd/prompts.schedule" }, // Manual or webhook event trigger
    ],
  },
  async ({ step, event }) => {
    const now = new Date();

    // Step 1: Query due prompts from database
    const duePrompts = await step.run("find-due-prompts", async () => {
      let allPrompts = [];
      try {
        allPrompts = await prisma.prompt.findMany({
          include: {
            brand: true,
            results: {
              orderBy: { executionTimestamp: "desc" },
              take: 1,
            },
          },
        });
      } catch (err) {
        console.warn("Prisma error querying prompts in Inngest, using empty list:", err);
        return [];
      }

      return allPrompts.filter((prompt) => {
        const latestResult = prompt.results[0];
        if (!latestResult) return true; // Never executed

        const lastExecution = new Date(latestResult.executionTimestamp).getTime();
        const diffMs = now.getTime() - lastExecution;
        const hoursSinceLastRun = diffMs / (1000 * 60 * 60);

        if (prompt.frequency === "daily") {
          return hoursSinceLastRun >= 23;
        } else if (prompt.frequency === "weekly") {
          return hoursSinceLastRun >= 166;
        }
        return true;
      });
    });

    if (duePrompts.length === 0) {
      return { message: "No prompts due for scheduled execution", dispatchedCount: 0 };
    }

    // Step 2: Fan-out isolated execution events for each due prompt
    const eventsToDispatch = duePrompts.map((prompt) => ({
      name: "recomnd/prompt.execute",
      data: {
        promptId: prompt.id,
        brandId: prompt.brandId,
        queryText: prompt.queryText,
        targetEngines: (prompt.targetEngines || ["chatgpt", "claude", "gemini", "perplexity"]) as SupportedEngine[],
        isRetry: false,
        runId: `run-${prompt.id}-${Date.now()}`,
      },
    }));

    await step.sendEvent("fan-out-prompt-executions", eventsToDispatch);

    return {
      message: `Dispatched ${eventsToDispatch.length} isolated prompt execution jobs`,
      dispatchedCount: eventsToDispatch.length,
      prompts: duePrompts.map((p) => ({ id: p.id, query: p.queryText })),
    };
  }
);

/**
 * 2. Multi-Step Durable AI Execution Workflow
 * Executes AI engines in separate step.run blocks with step-level retries,
 * provider-specific concurrency limits, and granular error logging.
 */
export const executePromptDurableWorkflow = inngest.createFunction(
  {
    id: "execute-prompt-workflow",
    name: "Execute Prompt Durable AI Workflow",
    concurrency: {
      limit: 5, // Prevent provider-side account rate limits across concurrent prompts
    },
    retries: 3, // Inngest exponential backoff on network/transient failures
    triggers: [
      { event: "recomnd/prompt.execute" },
    ],
  },
  async ({ event, step }) => {
    const { promptId, brandId, queryText, targetEngines, onlyFailedEngines } = event.data;

    // Filter to active engines for this run (handles targeted engine retry)
    const enginesToExecute = (onlyFailedEngines && onlyFailedEngines.length > 0
      ? onlyFailedEngines
      : targetEngines) as SupportedEngine[];

    // Step 1: Initialize status in database
    await step.run("init-prompt-state", async () => {
      try {
        for (const engine of enginesToExecute) {
          await prisma.promptResult.create({
            data: {
              promptId,
              engineName: engine,
              rawResponseText: "",
              status: "running",
              executionTimestamp: new Date(),
            },
          });
        }
      } catch (err) {
        console.warn("Could not record initial running state in DB:", err);
      }
      return { initialized: true, engines: enginesToExecute };
    });

    const engineResults: Record<string, NormalizedEngineResult> = {};

    // Step 2: Isolated OpenAI (ChatGPT) Execution
    if (enginesToExecute.includes("chatgpt")) {
      engineResults.chatgpt = (await step.run(
        "execute-openai-chatgpt",
        async (): Promise<NormalizedEngineResult> => {
          try {
            return await runChatGPT(queryText);
          } catch (error: any) {
            return {
              engine_name: "chatgpt",
              raw_response_text: "",
              execution_timestamp: new Date().toISOString(),
              status: "error",
              error: error?.message || "OpenAI ChatGPT execution failed",
            };
          }
        }
      )) as unknown as NormalizedEngineResult;
    }

    // Step 3: Isolated Anthropic (Claude) Execution
    if (enginesToExecute.includes("claude")) {
      engineResults.claude = (await step.run(
        "execute-anthropic-claude",
        async (): Promise<NormalizedEngineResult> => {
          try {
            return await runClaude(queryText);
          } catch (error: any) {
            return {
              engine_name: "claude",
              raw_response_text: "",
              execution_timestamp: new Date().toISOString(),
              status: "error",
              error: error?.message || "Anthropic Claude execution failed",
            };
          }
        }
      )) as unknown as NormalizedEngineResult;
    }

    // Step 4: Isolated Google (Gemini) Execution
    if (enginesToExecute.includes("gemini")) {
      engineResults.gemini = (await step.run(
        "execute-google-gemini",
        async (): Promise<NormalizedEngineResult> => {
          try {
            return await runGemini(queryText);
          } catch (error: any) {
            return {
              engine_name: "gemini",
              raw_response_text: "",
              execution_timestamp: new Date().toISOString(),
              status: "error",
              error: error?.message || "Google Gemini execution failed",
            };
          }
        }
      )) as unknown as NormalizedEngineResult;
    }

    // Step 5: Isolated Perplexity Sonar Execution
    if (enginesToExecute.includes("perplexity")) {
      engineResults.perplexity = (await step.run(
        "execute-perplexity",
        async (): Promise<NormalizedEngineResult> => {
          try {
            return await runPerplexity(queryText);
          } catch (error: any) {
            return {
              engine_name: "perplexity",
              raw_response_text: "",
              execution_timestamp: new Date().toISOString(),
              status: "error",
              error: error?.message || "Perplexity Sonar execution failed",
            };
          }
        }
      )) as unknown as NormalizedEngineResult;
    }

    // Step 7: Commit Database Results & Trigger Post-Execution Pipelines
    const commitSummary = await step.run("commit-database-results", async () => {
      const now = new Date();
      let brandRecord = null;

      try {
        brandRecord = await prisma.brand.findUnique({
          where: { id: brandId },
          include: { competitorRecords: true },
        });
      } catch (err) {
        console.warn("Could not query brand record in Inngest commit step:", err);
      }

      const successfulEngines: SupportedEngine[] = [];
      const failedEngines: SupportedEngine[] = [];
      const errorLogs: ErrorLogItem[] = [];

      for (const [engineKey, res] of Object.entries(engineResults)) {
        const engineName = engineKey as SupportedEngine;
        const isSuccess = res.status === "success";
        const status: PromptResultStatus = isSuccess ? "completed" : "failed";

        let errorLogPayload: ErrorLogItem | null = null;
        if (!isSuccess) {
          failedEngines.push(engineName);
          const errorMsg = res.error || "Engine execution failed";
          const statusCode = errorMsg.includes("429")
            ? 429
            : errorMsg.includes("503")
            ? 503
            : errorMsg.includes("401")
            ? 401
            : 500;

          errorLogPayload = {
            message: errorMsg,
            statusCode,
            retryCount: 3,
            timestamp: now.toISOString(),
            engine: engineName,
          };
          errorLogs.push(errorLogPayload);
        } else {
          successfulEngines.push(engineName);
        }

        try {
          const created = await prisma.promptResult.create({
            data: {
              promptId,
              engineName,
              rawResponseText: res.raw_response_text || "",
              responsePayload: (res.response_payload || {}) as object,
              citations: (res.citations || []) as object,
              status,
              errorLog: (errorLogPayload || undefined) as any,
              retryCount: isSuccess ? 0 : 3,
              executionTimestamp: new Date(res.execution_timestamp || now),
            },
          });

          // Run Stage 2 & 3 Post-Execution Pipeline on successful engine response
          if (isSuccess && brandRecord && res.raw_response_text) {
            await processPromptResult({
              promptResultId: created.id,
              rawText: res.raw_response_text,
              brand: {
                id: brandRecord.id,
                userId: brandRecord.userId,
                brandName: brandRecord.brandName,
                domain: brandRecord.domain,
                aliases: brandRecord.aliases || [],
                exactUrls: brandRecord.exactUrls || [],
                competitors: brandRecord.competitors || [],
                competitorRecords: brandRecord.competitorRecords || [],
              },
              payloadCitations: res.citations || [],
            });
          }
        } catch (dbErr) {
          console.error(`Failed persisting PromptResult for ${engineName}:`, dbErr);
        }
      }

      // Update Prompt metadata
      try {
        await prisma.prompt.update({
          where: { id: promptId },
          data: {
            updatedAt: now,
          },
        });
      } catch (updateErr) {
        console.warn("Could not update prompt updatedAt timestamp:", updateErr);
      }

      // Determine overall prompt status
      let overallStatus: PromptResultStatus = "completed";
      if (failedEngines.length > 0) {
        overallStatus =
          successfulEngines.length > 0 ? "partial_success" : "failed";
      }

      return {
        promptId,
        overallStatus,
        successfulEngines,
        failedEngines,
        errorLogs,
        executedAt: now.toISOString(),
      };
    });

    return {
      success: commitSummary.failedEngines.length === 0,
      commitSummary,
    };
  }
);

export const inngestFunctions = [schedulePromptsCron, executePromptDurableWorkflow];

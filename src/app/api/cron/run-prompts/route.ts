import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { runUnifiedEngines } from "@/services/aiRunner";
import { processPromptResult } from "@/services/postExecutionPipeline";
import { SupportedEngine } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * Scheduled Runner Cron Route (/api/cron/run-prompts)
 * Triggers durable Inngest event dispatching for resilient background processing.
 */
export async function GET(request: Request) {
  return handleCronExecution(request);
}

export async function POST(request: Request) {
  return handleCronExecution(request);
}

async function handleCronExecution(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecretHeader = request.headers.get("x-cron-secret");
  const cronSecret = process.env.CRON_SECRET;

  // Verify CRON_SECRET if configured
  if (cronSecret) {
    const bearerMatch = authHeader === `Bearer ${cronSecret}`;
    const headerMatch = cronSecretHeader === cronSecret;

    if (!bearerMatch && !headerMatch) {
      const { searchParams } = new URL(request.url);
      const keyParam = searchParams.get("key");
      if (process.env.NODE_ENV !== "development" || keyParam !== cronSecret) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing cron secret" },
          { status: 401 }
        );
      }
    }
  }

  const { searchParams } = new URL(request.url);
  const forceSync = searchParams.get("sync") === "true";
  const now = new Date();

  // Primary: Dispatch to Inngest Event Queue for durable execution
  if (!forceSync) {
    try {
      const { ids } = await inngest.send({
        name: "recomnd/prompts.schedule",
        data: {
          triggeredBy: "cron",
          timestamp: now.toISOString(),
        },
      });

      return NextResponse.json({
        success: true,
        queued: true,
        message: "Successfully queued scheduled prompt batch in Inngest event queue.",
        inngestEventIds: ids,
        timestamp: now.toISOString(),
      });
    } catch (inngestErr) {
      console.warn(
        "Inngest dispatch failed or dev server offline, continuing to fallback execution:",
        inngestErr
      );
    }
  }

  // Fallback synchronous execution for offline dev or when ?sync=true
  const summary = {
    executedAt: now.toISOString(),
    promptsChecked: 0,
    promptsDue: 0,
    resultsSaved: 0,
    failedEngines: 0,
    errors: [] as string[],
  };

  try {
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
    } catch (dbError) {
      return NextResponse.json({
        message: "Database connection not ready. Check DATABASE_URL in .env.local.",
        summary,
        status: "skipped",
      });
    }

    summary.promptsChecked = allPrompts.length;

    const duePrompts = allPrompts.filter((prompt) => {
      const latestResult = prompt.results[0];
      if (!latestResult) return true;

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

    summary.promptsDue = duePrompts.length;

    for (const prompt of duePrompts) {
      try {
        const engines = prompt.targetEngines as SupportedEngine[];
        const engineResults = await runUnifiedEngines(prompt.queryText, engines);

        for (const res of engineResults) {
          const isError = res.status === "error";
          if (isError) {
            summary.failedEngines++;
            summary.errors.push(`Prompt ${prompt.id} - ${res.engine_name}: ${res.error}`);
          }

          try {
            const createdResult = await prisma.promptResult.create({
              data: {
                promptId: prompt.id,
                engineName: res.engine_name,
                rawResponseText: res.raw_response_text || "",
                responsePayload: (res.response_payload || {}) as object,
                citations: (res.citations || []) as object,
                status: isError ? "failed" : "completed",
                errorLog: isError
                  ? { message: res.error, statusCode: 500, retryCount: 0, timestamp: now.toISOString() }
                  : undefined,
                executionTimestamp: new Date(res.execution_timestamp),
              },
            });
            summary.resultsSaved++;

            if (prompt.brand && res.raw_response_text && !isError) {
              await processPromptResult({
                promptResultId: createdResult.id,
                rawText: res.raw_response_text,
                brand: prompt.brand,
                payloadCitations: res.citations || [],
              });
            }
          } catch (insertError) {
            console.error("Failed to insert PromptResult:", insertError);
          }
        }

        await prisma.prompt.update({
          where: { id: prompt.id },
          data: { updatedAt: now },
        });
      } catch (promptError) {
        summary.errors.push(`Prompt ${prompt.id} failed: ${String(promptError)}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Completed cron execution. ${summary.resultsSaved} engine results processed.`,
      summary,
    });
  } catch (globalError) {
    return NextResponse.json(
      { error: "Cron runner failed unexpectedly", details: String(globalError) },
      { status: 500 }
    );
  }
}

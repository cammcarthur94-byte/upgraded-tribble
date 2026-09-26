import { Inngest } from "inngest";
import { SupportedEngine } from "@/lib/types";

export type SchedulePromptsEvent = {
  name: "recomnd/prompts.schedule";
  data: {
    triggeredBy?: "cron" | "manual" | "api";
    timestamp?: string;
  };
};

export type ExecutePromptEvent = {
  name: "recomnd/prompt.execute";
  data: {
    promptId: string;
    brandId: string;
    queryText: string;
    targetEngines: SupportedEngine[];
    isRetry?: boolean;
    onlyFailedEngines?: SupportedEngine[];
    runId?: string;
  };
};

/**
 * Primary Inngest Client instance for Recomnd B2B SaaS
 */
export const inngest = new Inngest({
  id: "recomnd",
});

import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { inngestFunctions } from "@/lib/inngest/functions";

/**
 * Primary Inngest webhook route handler for Next.js App Router.
 * Handles incoming executor events, function runs, and step executions.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: inngestFunctions,
});

import { google } from "@ai-sdk/google";
import type { UIMessage } from "ai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { runQueryTool } from "@/lib/tools";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are an expert Data Analyst for MetroFleet.
- You have access to a Postgres database with NYC taxi trip data.
- Always query the database before answering data questions.
- Tables: dbt_dev.fct_trips, dbt_dev.dm_daily_revenue
- Be concise and professional.`;

export const POST = async (req: Request): Promise<Response> => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools: { runQuery: runQueryTool },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
};

import { tool } from "ai";
import { z } from "zod";
import type { QueryResult, ToolOutput } from "@/types/database";
import sql from "./db";

const FORBIDDEN_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "TRUNCATE",
] as const;

const MAX_ROWS = 50;

const isReadOnly = (query: string): boolean =>
  !FORBIDDEN_KEYWORDS.some((kw) => query.toUpperCase().includes(kw));

export const runQueryTool = tool({
  description: `Execute a read-only SQL query on the NYC Taxi database.
Tables:
- dbt_dev.fct_trips (pickup_datetime, total_amount, trip_distance, precip_mm, temp_c, is_holiday, holiday_name)
- dbt_dev.dm_daily_revenue (revenue_date, pickup_borough, total_trips, total_revenue, avg_ticket_size)`,
  inputSchema: z.object({
    query: z.string().describe("The SQL query to execute. Must be READ-ONLY."),
  }),
  execute: async ({ query }): Promise<ToolOutput> => {
    if (!isReadOnly(query)) {
      return { error: "Read-only queries only." };
    }

    try {
      const result = (await sql.unsafe(query)) as QueryResult[];

      if (result.length > MAX_ROWS) {
        return {
          data: result.slice(0, MAX_ROWS),
          note: `Result truncated. Showing ${MAX_ROWS} of ${result.length} rows.`,
        };
      }

      return { data: result };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  },
});

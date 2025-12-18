import { db } from "@/db";
import { trips } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async () => {
  const result = await db.select().from(trips).orderBy(desc(trips.createdAt)).limit(100);
  return NextResponse.json(result);
};

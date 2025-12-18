import { db } from "@/db";
import { trips } from "@/db/schema";
import { desc, asc, ilike, and, gte, lte, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const zone = searchParams.get("zone");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const conditions = [];

    if (zone) {
        conditions.push(
            or(
                ilike(trips.pickupZone, `%${zone}%`),
                ilike(trips.dropoffZone, `%${zone}%`)
            )
        );
    }

    if (dateFrom) {
        conditions.push(gte(trips.createdAt, new Date(dateFrom)));
    }

    if (dateTo) {
        conditions.push(lte(trips.createdAt, new Date(dateTo)));
    }

    const orderColumn = sortBy === "fare" ? trips.estimatedFare
        : sortBy === "distance" ? trips.distance
            : trips.createdAt;

    const orderDirection = order === "asc" ? asc(orderColumn) : desc(orderColumn);

    const result = await db
        .select()
        .from(trips)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderDirection)
        .limit(100);

    return NextResponse.json(result);
}

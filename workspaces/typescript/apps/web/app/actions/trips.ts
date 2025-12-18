"use server";

import { db } from "@/db";
import { trips, type NewTrip } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTrip(data: Omit<NewTrip, "id" | "createdAt">) {
    const [trip] = await db.insert(trips).values(data).returning();
    revalidatePath("/history");
    return trip;
}

export async function deleteTrip(id: string) {
    await db.delete(trips).where(eq(trips.id, id));
    revalidatePath("/history");
}

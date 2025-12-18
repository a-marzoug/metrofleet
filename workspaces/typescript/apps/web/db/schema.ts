import { pgTable, text, real, timestamp, uuid } from "drizzle-orm/pg-core";

export const trips = pgTable("trips", {
    id: uuid("id").primaryKey().defaultRandom(),
    pickupZone: text("pickup_zone").notNull(),
    dropoffZone: text("dropoff_zone").notNull(),
    distance: real("distance").notNull(),
    estimatedFare: real("estimated_fare").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;

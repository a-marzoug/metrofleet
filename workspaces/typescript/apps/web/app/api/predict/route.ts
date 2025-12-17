import { MetroFleetClient } from "@metrofleet/sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const client = new MetroFleetClient({
            apiKey: process.env.METROFLEET_API_KEY,
            baseUrl: process.env.METROFLEET_API_URL || "http://localhost:8000",
        });

        const result = await client.predictTrip({
            pickupLocationId: body.pickupLocationId,
            dropoffLocationId: body.dropoffLocationId,
            tripDistance: body.tripDistance,
            pickupDatetime: body.pickupDatetime || new Date().toISOString(),
        });

        if (result.error) {
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        return NextResponse.json(result.data);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Prediction failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

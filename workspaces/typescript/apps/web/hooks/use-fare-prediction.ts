"use client";

import { useState } from "react";
import type { PredictionResult } from "@/lib/types";
import { getZoneById } from "@/lib/zones";

interface PredictParams {
  pickupLocationId: number;
  dropoffLocationId: number;
  tripDistance: number;
}

export function useFarePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (params: PredictParams): Promise<PredictionResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual SDK call
      // const client = new MetroFleetClient();
      // const result = await client.predictTrip({ ... });

      await new Promise((r) => setTimeout(r, 600));
      const baseFare = 3.0;
      const perMile = 2.5;
      const estimatedFare = baseFare + params.tripDistance * perMile + Math.random() * 3;

      const pickup = getZoneById(params.pickupLocationId);
      const dropoff = getZoneById(params.dropoffLocationId);

      return {
        id: crypto.randomUUID(),
        pickupZone: pickup?.zone ?? "Unknown",
        dropoffZone: dropoff?.zone ?? "Unknown",
        estimatedFare: Math.round(estimatedFare * 100) / 100,
        distance: params.tripDistance,
        timestamp: new Date(),
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { predict, loading, error };
}

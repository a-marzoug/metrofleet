"use client";

import { useState } from "react";
import type { PredictionResult } from "@/lib/types";
import { getZoneById } from "@/lib/zones";
import { MetroFleetClient } from "@metrofleet/sdk";

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
      const client = new MetroFleetClient();

      const result = await client.predictTrip({
        pickupLocationId: params.pickupLocationId,
        dropoffLocationId: params.dropoffLocationId,
        tripDistance: params.tripDistance,
        pickupDatetime: new Date().toISOString(),
      });

      if (result.error) {
        throw new Error(result.error.message || "Unknown API error");
      }

      const prediction = result.data;

      const pickup = getZoneById(params.pickupLocationId);
      const dropoff = getZoneById(params.dropoffLocationId);

      return {
        id: crypto.randomUUID(),
        pickupZone: pickup?.zone ?? "Unknown",
        dropoffZone: dropoff?.zone ?? "Unknown",
        estimatedFare: prediction.estimatedFare,
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

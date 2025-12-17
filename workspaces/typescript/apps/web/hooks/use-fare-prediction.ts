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
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupLocationId: params.pickupLocationId,
          dropoffLocationId: params.dropoffLocationId,
          tripDistance: params.tripDistance,
          pickupDatetime: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Prediction failed");
      }

      const prediction = await response.json();

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

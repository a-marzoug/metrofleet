"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { FeatureCards } from "@/components/fare/feature-cards";
import { FareForm } from "@/components/fare/fare-form";
import { FareResult } from "@/components/fare/fare-result";
import { useFarePrediction } from "@/hooks/use-fare-prediction";
import { getZoneById, calculateDistance } from "@/lib/zones";
import type { PredictionResult } from "@/lib/types";

const TripMap = dynamic(() => import("@/components/fare/trip-map").then((m) => ({ default: m.TripMap })), {
  ssr: false,
  loading: () => <div className="h-full bg-card rounded-xl animate-pulse" />,
});

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { predict, loading } = useFarePrediction();

  const pickupZone = useMemo(() => (pickup ? getZoneById(Number(pickup)) : null), [pickup]);
  const dropoffZone = useMemo(() => (dropoff ? getZoneById(Number(dropoff)) : null), [dropoff]);

  const distance = useMemo(() => {
    if (!pickupZone || !dropoffZone) return 0;
    return calculateDistance(pickupZone.lat, pickupZone.lng, dropoffZone.lat, dropoffZone.lng);
  }, [pickupZone, dropoffZone]);

  const handleSubmit = async () => {
    if (!pickup || !dropoff) return;
    const res = await predict({
      pickupLocationId: Number(pickup),
      dropoffLocationId: Number(dropoff),
      tripDistance: distance,
    });
    if (res) {
      setResult(res);
      setShowResult(true);
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-techno">
              <span className="text-foreground">Fare</span>{" "}
              <span className="neon-text">Prediction</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Get accurate fare estimates using our machine learning model
            </p>
          </div>

          <FeatureCards />

          <div className="grid grid-cols-2 gap-6 mt-6">
            <FareForm
              pickup={pickup}
              dropoff={dropoff}
              onPickupChange={setPickup}
              onDropoffChange={setDropoff}
              distance={distance}
              onSubmit={handleSubmit}
              loading={loading}
            />
            <div className="h-[420px]">
              <TripMap
                pickup={pickupZone ? { lat: pickupZone.lat, lng: pickupZone.lng } : null}
                dropoff={dropoffZone ? { lat: dropoffZone.lat, lng: dropoffZone.lng } : null}
              />
            </div>
          </div>
        </main>
      </div>

      <FareResult result={result} open={showResult} onClose={() => setShowResult(false)} />
    </div>
  );
}

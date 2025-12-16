"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, MapPin, Route, Clock } from "lucide-react";
import type { PredictionResult } from "@/lib/types";

interface FareResultProps {
  result: PredictionResult | null;
  open: boolean;
  onClose: () => void;
}

export function FareResult({ result, open, onClose }: FareResultProps) {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Fare Estimate
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-6">
          <p className="text-6xl font-bold neon-text">${result.estimatedFare.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-2">Estimated fare (excl. tips & tolls)</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Pickup</p>
              <p>{result.pickupZone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <MapPin className="w-4 h-4 text-pink-400" />
            <div>
              <p className="text-muted-foreground text-xs">Dropoff</p>
              <p>{result.dropoffZone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <Route className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Distance</p>
              <p>{result.distance.toFixed(2)} miles</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Predicted at</p>
              <p>{result.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

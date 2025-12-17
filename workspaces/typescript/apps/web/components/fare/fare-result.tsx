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
          <DialogTitle className="flex items-center gap-2 text-primary">
            <DollarSign className="w-5 h-5" />
            Fare Estimate
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-6">
          <p className="text-6xl font-bold neon-text">${result.estimatedFare.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-2">Estimated fare (excl. tips & tolls)</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Pickup</p>
              <p className="font-medium">{result.pickupZone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
            <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-violet-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Dropoff</p>
              <p className="font-medium">{result.dropoffZone}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
              <Route className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Distance</p>
                <p className="font-medium">{result.distance.toFixed(2)} mi</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Time</p>
                <p className="font-medium">{result.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

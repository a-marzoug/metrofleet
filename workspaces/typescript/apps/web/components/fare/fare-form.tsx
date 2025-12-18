"use client";

import { DollarSign, MapPin, Clock, Route, Thermometer, CloudRain, Zap } from "lucide-react";
import { ZoneSelect } from "@/components/fare/zone-select";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";

interface FareFormProps {
  pickup: string;
  dropoff: string;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  distance: number;
  onSubmit: () => void;
  loading: boolean;
}

export const FareForm = ({ pickup, dropoff, onPickupChange, onDropoffChange, distance, onSubmit, loading }: FareFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-sidebar rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold font-techno">Fare Prediction</h2>
          <p className="text-xs text-muted-foreground">ML-powered fare estimates</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Pickup Location
            </label>
            <ZoneSelect value={pickup} onValueChange={onPickupChange} placeholder="Select pickup" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <MapPin className="w-4 h-4 text-violet-400" />
              Dropoff Location
            </label>
            <ZoneSelect value={dropoff} onValueChange={onDropoffChange} placeholder="Select dropoff" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Pickup Date & Time
            </label>
            <Input
              type="datetime-local"
              defaultValue={new Date().toISOString().slice(0, 16)}
              className="bg-secondary border-border h-11"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Route className="w-4 h-4 text-muted-foreground" />
              Trip Distance (auto-calculated)
            </label>
            <Input
              type="text"
              value={distance > 0 ? `${distance.toFixed(2)} miles` : "Select locations"}
              readOnly
              className="bg-secondary border-border h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              Temperature
            </label>
            <Input
              type="text"
              defaultValue="15°C"
              readOnly
              className="bg-secondary border-border h-11"
              placeholder="API"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <CloudRain className="w-4 h-4 text-muted-foreground" />
              Precipitation
            </label>
            <Input
              type="text"
              defaultValue="0 mm"
              readOnly
              className="bg-secondary border-border h-11"
              placeholder="API"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || !pickup || !dropoff}
          className="w-full h-12 rounded-lg font-semibold text-primary-foreground neon-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          {loading ? "Predicting..." : "Predict Fare"}
        </motion.button>
      </form>
    </motion.div>
  );
};

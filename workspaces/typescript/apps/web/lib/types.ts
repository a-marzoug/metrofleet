export interface PredictionResult {
  id: string;
  pickupZone: string;
  dropoffZone: string;
  estimatedFare: number;
  distance: number;
  timestamp: Date;
}

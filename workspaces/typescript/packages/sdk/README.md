# @metrofleet/sdk

The official TypeScript SDK for the MetroFleet API Gateway.

## Features

- **Type-safe**: Full TypeScript definitions for all API models.
- **Robust Error Handling**: Uses a Result pattern (`{ data, error }`) instead of throwing exceptions.
- **Isomorphic**: Works in Node.js, Bun, and modern browsers (requires `fetch`).

## Installation

```bash
bun install @metrofleet/sdk
# or
npm install @metrofleet/sdk
```

## Usage

### Initialization

```typescript
import { MetroFleetClient } from "@metrofleet/sdk";

const client = new MetroFleetClient({
  apiKey: "your-api-key", // defaults to process.env.METROFLEET_API_KEY
  baseUrl: "http://localhost:8000" // defaults to process.env.METROFLEET_API_URL
});
```

### Health Check

```typescript
const { data, error } = await client.healthCheck();

if (error) {
  console.error("Health check failed:", error);
} else {
  console.log("Status:", data.status);
}
```

### Predict Trip Fare

```typescript
import { type TripRequest } from "@metrofleet/sdk";

const trip: TripRequest = {
  pickupLocationId: 120,
  dropoffLocationId: 132,
  pickupDatetime: "2025-12-25T10:00:00Z",
  tripDistance: 12.5,
  precipMm: 0,
  tempC: 15
};

const result = await client.predictTrip(trip);

if (result.error) {
  console.error("Prediction failed:", result.error);
} else {
  console.log(`Estimated Fare: $${result.data.estimatedFare} ${result.data.currency}`);
}
```

## Error Handling

All methods return a `Promise<Result<T>>` type:

```typescript
type Result<T, E = Error> = 
  | { data: T; error: null }
  | { data: null; error: E };
```

You should always check if `error` is not null before accessing `data`.

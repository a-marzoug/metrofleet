import { MetroFleetClient } from "./index";

const client = new MetroFleetClient({
    apiKey: "dev-secret-key",
    baseUrl: "http://localhost:8000"
});

const req = {
    pickupLocationId: 120,
    dropoffLocationId: 132,
    pickupDatetime: new Date().toISOString(),
    tripDistance: 10,
};

console.log("Testing Health Check...");
const health = await client.healthCheck();
console.log("Health:", health);

console.log("\nTesting Prediction...");
const prediction = await client.predictTrip(req);
console.log("Prediction:", prediction);

if (prediction.error) {
    console.error("Prediction failed:", prediction.error);
    process.exit(1);
}

if (!prediction.data.estimatedFare) {
    console.error("No fare returned");
    process.exit(1);
}

console.log("\nSuccess!");

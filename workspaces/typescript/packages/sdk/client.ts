import { type Result, ok, err, type TripRequest, type TripPrediction } from "./types";

export interface MetroFleetClientOptions {
    apiKey?: string;
    baseUrl?: string;
}

export class MetroFleetClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(options: MetroFleetClientOptions = {}) {
        this.apiKey = options.apiKey || process.env.METROFLEET_API_KEY || "";
        this.baseUrl = options.baseUrl || process.env.METROFLEET_API_URL || "http://localhost:8000";
    }

    private async request<T>(path: string, options: RequestInit = {}): Promise<Result<T>> {
        const url = `${this.baseUrl}${path}`;
        const headers = new Headers(options.headers);

        if (this.apiKey) {
            headers.set("X-API-Key", this.apiKey);
        }

        headers.set("Content-Type", "application/json");

        try {
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                return err(new Error(`API Error: ${response.status} ${response.statusText}`));
            }

            const data = await response.json() as T;
            return ok<T>(data);
        } catch (error) {
            return err(error instanceof Error ? error : new Error(String(error)));
        }
    }

    async predictTrip(request: TripRequest): Promise<Result<TripPrediction>> {
        return this.request<TripPrediction>("/api/v1/predict/fare", {
            method: "POST",
            body: JSON.stringify(request),
        });
    }

    async healthCheck(): Promise<Result<{ status: string }>> {
        return this.request<{ status: string }>("/api/v1/health");
    }
}

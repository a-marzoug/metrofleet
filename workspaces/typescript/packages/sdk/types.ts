export interface TripRequest {
    pickupLocationId: number;
    dropoffLocationId: number;
    pickupDatetime: string; // ISO 8601
    tripDistance: number;
    precipMm?: number;
    tempC?: number;
}

export interface TripPrediction {
    estimatedFare: number;
    currency: string;
    modelVersion: string;
}

export type Result<T, E = Error> =
    | { data: T; error: null }
    | { data: null; error: E };

export const ok = <T>(data: T): Result<T> => ({ data, error: null });
export const err = <E = Error>(error: E): Result<any, E> => ({ data: null, error });

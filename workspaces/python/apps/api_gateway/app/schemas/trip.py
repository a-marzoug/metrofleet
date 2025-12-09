"""Trip-related schemas."""

from datetime import datetime

from pydantic import BaseModel, Field


class TripRequest(BaseModel):
    pickup_location_id: int = Field(..., ge=1)
    dropoff_location_id: int = Field(..., ge=1)
    pickup_datetime: datetime
    trip_distance: float = Field(..., gt=0)


class TripPrediction(BaseModel):
    estimated_fare: float
    currency: str = 'USD'
    model_version: str = 'v1'

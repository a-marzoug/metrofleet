"""Prediction endpoints."""

from fastapi import APIRouter

from app.schemas import TripPrediction, TripRequest
from app.services import predict_fare

router = APIRouter()


@router.post('/fare', response_model=TripPrediction)
def predict_trip_fare(trip: TripRequest):
    """Predict fare for a trip."""
    return predict_fare(trip)

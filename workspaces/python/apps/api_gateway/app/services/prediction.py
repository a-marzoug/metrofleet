"""Prediction service for fare estimation."""

from fastapi import HTTPException

from app.core import settings
from app.models import model_manager
from app.schemas import TripPrediction, TripRequest
from app.services.features import prepare_features


def predict_fare(trip: TripRequest) -> TripPrediction:
    """Predict fare for a given trip."""
    model = model_manager.get_model('price_model')
    if not model:
        raise HTTPException(status_code=503, detail='Model not loaded')

    input_data = prepare_features(trip)

    try:
        prediction = model.predict(input_data)
        fare = float(prediction[0])
        fare = max(settings.min_fare, fare)

        return TripPrediction(estimated_fare=round(fare, 2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Prediction error: {str(e)}')

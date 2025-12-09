"""Feature engineering for model inference."""

import pandas as pd

from app.schemas import TripRequest


def prepare_features(trip: TripRequest) -> pd.DataFrame:
    """Transform trip request into model input features."""
    pickup_hour = float(trip.pickup_datetime.hour)
    pickup_day = int(trip.pickup_datetime.weekday())

    return pd.DataFrame(
        [
            {
                'pickup_location_id': trip.pickup_location_id,
                'dropoff_location_id': trip.dropoff_location_id,
                'pickup_hour': pickup_hour,
                'pickup_day': pickup_day,
                'trip_distance': trip.trip_distance,
            }
        ]
    )

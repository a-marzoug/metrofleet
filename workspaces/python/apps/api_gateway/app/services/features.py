"""Feature engineering for model inference."""

import holidays
import pandas as pd

from app.schemas import TripRequest

# We use New York holidays since this is a specific NYC model
ny_holidays = holidays.US(subdiv='NY')


def prepare_features(trip: TripRequest) -> pd.DataFrame:
    """Transform trip request into model input features."""
    # --- FEATURE ENGINEERING ---

    # 1. Temporal Features
    pickup_hour = float(trip.pickup_datetime.hour)
    pickup_day = int(trip.pickup_datetime.weekday())  # 0=Mon, 6=Sun

    # 2. Holiday Logic (Real-time calculation)
    # Check if the date is in the NY Holiday registry
    is_holiday = trip.pickup_datetime.date() in ny_holidays
    is_holiday_int = 1 if is_holiday else 0

    # 3. Construct DataFrame
    # CRITICAL: The column names and order must match 'train_model.py' EXACTLY
    return pd.DataFrame(
        [
            {
                'pickup_location_id': trip.pickup_location_id,
                'dropoff_location_id': trip.dropoff_location_id,
                'pickup_hour': pickup_hour,
                'pickup_day': pickup_day,
                'trip_distance': trip.trip_distance,
                'precip_mm': trip.precip_mm,  # Passed from request or default 0.0
                'temp_c': trip.temp_c,  # Passed from request or default 15.0
                'is_holiday_int': is_holiday_int,  # Calculated locally
            }
        ]
    )

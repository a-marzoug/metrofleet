import pickle
from contextlib import asynccontextmanager
from datetime import datetime

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


# 1. Define Input Schema (What the Frontend sends)
class TripRequest(BaseModel):
    pickup_location_id: int
    dropoff_location_id: int
    pickup_datetime: datetime
    trip_distance: float


# 2. Define Output Schema (What we send back)
class TripPrediction(BaseModel):
    estimated_fare: float
    currency: str = 'USD'
    model_version: str = 'v1'


# 3. Lifespan: Load Model on Startup
# We use a global variable to hold the model in memory
ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model from the shared volume
    model_path = '/app/data/models/price_model_prod.pkl'
    try:
        print(f'Loading model from {model_path}...')
        with open(model_path, 'rb') as f:
            ml_models['price_model'] = pickle.load(f)
        print('✅ Model loaded successfully.')
    except FileNotFoundError:
        print('⚠️ Model file not found. API will return errors for predictions.')
        ml_models['price_model'] = None
    yield
    # Clean up if needed
    ml_models.clear()


app = FastAPI(title='MetroFleet API', lifespan=lifespan)


@app.get('/health')
def health_check():
    return {'status': 'ok', 'model_loaded': ml_models['price_model'] is not None}


@app.post('/predict/fare', response_model=TripPrediction)
def predict_fare(trip: TripRequest):
    model = ml_models.get('price_model')
    if not model:
        raise HTTPException(status_code=503, detail='Model not loaded')

    # 4. Feature Engineering
    # We must match the transformations done in 'train_model.py'

    # Extract features from datetime
    pickup_hour = float(trip.pickup_datetime.hour)
    pickup_day = int(trip.pickup_datetime.weekday())  # 0=Monday, 6=Sunday

    # Create a DataFrame (Scikit-Learn pipeline expects a DataFrame with specific column names)
    input_data = pd.DataFrame(
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

    # 5. Inference
    try:
        prediction = model.predict(input_data)
        fare = float(prediction[0])
        # Enforce a minimum fare logic (business rule)
        fare = max(2.50, fare)

        return TripPrediction(estimated_fare=round(fare, 2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Prediction error: {str(e)}')

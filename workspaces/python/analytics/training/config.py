import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DB_URI = f'postgresql://{os.getenv("POSTGRES_USER")}:{os.getenv("POSTGRES_PASSWORD")}@{os.getenv("POSTGRES_HOST")}:5432/{os.getenv("POSTGRES_DB")}'

# Model Configuration
PROD_MODEL_PATH = os.getenv(
    'PROD_MODEL_PATH',
    str(
        Path(__file__).parent
        / '..'
        / '..'
        / '..'
        / '..'
        / 'data'
        / 'models'
        / 'price_model_prod.pkl'
    ),
)
ANOMALY_MODEL_PATH = '/app/data/models/anomaly_detector.pkl'

# MLflow Configuration
MLFLOW_TRACKING_URI = os.getenv('MLFLOW_TRACKING_URI', 'sqlite:///mlflow.db')
EXPERIMENT_NAME = 'price_prediction_v2'
ANOMALY_EXPERIMENT_NAME = 'anomaly_detection_v1'

# Data Configuration
DATA_QUERY = """
SELECT 
    pickup_location_id,
    dropoff_location_id,
    pickup_datetime,
    trip_distance,
    total_amount,
    coalesce(precip_mm, 0) as precip_mm,
    coalesce(temp_c, 15) as temp_c,
    case when is_holiday then 1 else 0 end as is_holiday_int
FROM dbt_dev.fct_trips
WHERE total_amount > 0 AND total_amount < 200 AND trip_distance > 0
LIMIT 500000
"""

ANOMALY_DATA_QUERY = """
SELECT 
    trip_distance,
    total_amount,
    EXTRACT(EPOCH FROM (dropoff_datetime - pickup_datetime)) as duration_seconds
FROM dbt_dev.fct_trips
WHERE total_amount > 0 AND trip_distance > 0
LIMIT 100000
"""

# Feature Configuration
CATEGORICAL_FEATURES = ['pickup_location_id', 'dropoff_location_id', 'pickup_day']
NUMERICAL_FEATURES = [
    'pickup_hour',
    'trip_distance',
    'precip_mm',
    'temp_c',
    'is_holiday_int',
]
TARGET_COLUMN = 'total_amount'
ANOMALY_NUMERICAL_FEATURES = ['trip_distance', 'total_amount', 'duration_seconds']

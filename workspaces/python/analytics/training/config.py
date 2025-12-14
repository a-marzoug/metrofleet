import os

from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DB_URI = f'postgresql://{os.getenv("POSTGRES_USER")}:{os.getenv("POSTGRES_PASSWORD")}@{os.getenv("POSTGRES_HOST")}:5432/{os.getenv("POSTGRES_DB")}'

# Model Configuration
PROD_MODEL_PATH = os.getenv(
    'PROD_MODEL_PATH',
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            '..',
            '..',
            '..',
            '..',
            'data',
            'models',
            'price_model_prod.pkl',
        )
    ),
)

# MLflow Configuration
MLFLOW_TRACKING_URI = os.getenv('MLFLOW_TRACKING_URI', 'sqlite:///mlflow.db')
EXPERIMENT_NAME = 'price_prediction_v2'

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

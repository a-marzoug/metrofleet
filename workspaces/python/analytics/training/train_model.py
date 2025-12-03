import os
import pickle

import polars as pl
import xgboost as xgb
from dotenv import load_dotenv
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

load_dotenv()

# Config
DB_URI = f'postgresql://{os.getenv("POSTGRES_USER")}:{os.getenv("POSTGRES_PASSWORD")}@{os.getenv("POSTGRES_HOST")}:5432/{os.getenv("POSTGRES_DB")}'
MODEL_PATH = '/app/data/models/price_model.pkl'


def load_data():
    print('Loading data from Postgres via Polars...')
    query = """
    SELECT 
        pickup_location_id,
        dropoff_location_id,
        pickup_datetime,
        trip_distance,
        total_amount
    FROM dbt_dev.fct_trips
    WHERE total_amount > 0 AND total_amount < 200 AND trip_distance > 0
    LIMIT 100000
    """
    df = pl.read_database_uri(query=query, uri=DB_URI, engine='connectorx')

    # Feature Engineering
    df = df.with_columns(
        [
            pl.col('pickup_datetime').dt.hour().cast(pl.Float32).alias('pickup_hour'),
            pl.col('pickup_datetime').dt.weekday().cast(pl.Int64).alias('pickup_day'),
            pl.col('pickup_location_id').cast(pl.Int64),
            pl.col('dropoff_location_id').cast(pl.Int64),
            pl.col('trip_distance').cast(pl.Float32),
            pl.col('total_amount').cast(pl.Float32),
        ]
    ).drop_nulls()

    return df


def train():
    df = load_data()

    # Select columns
    X = df.select(
        [
            'pickup_location_id',
            'dropoff_location_id',
            'pickup_hour',
            'pickup_day',
            'trip_distance',
        ]
    ).to_pandas()

    y = df.select('total_amount').to_pandas()['total_amount']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    categorical_features = ['pickup_location_id', 'dropoff_location_id', 'pickup_day']
    numerical_features = ['pickup_hour', 'trip_distance']

    preprocessor = ColumnTransformer(
        transformers=[
            (
                'cat',
                OneHotEncoder(handle_unknown='ignore', sparse_output=False),
                categorical_features,
            ),
            ('num', StandardScaler(), numerical_features),
        ],
        verbose_feature_names_out=False,
    )

    # Standard XGBoost 1.7.6 Setup
    pipeline = Pipeline(
        steps=[
            ('preprocessor', preprocessor),
            (
                'regressor',
                xgb.XGBRegressor(n_estimators=100, learning_rate=0.05, n_jobs=-1),
            ),
        ]
    )

    print('Training XGBoost Pipeline...')
    pipeline.fit(X_train, y_train)

    preds = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f'✅ Training Complete. MAE: ${mae:.2f}')

    # Save Pickle
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(pipeline, f)
    print(f'💾 Model saved to {MODEL_PATH}')


if __name__ == '__main__':
    train()

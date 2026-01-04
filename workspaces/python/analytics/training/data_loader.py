import polars as pl
from sklearn.model_selection import train_test_split

from .config import (
    ANOMALY_DATA_QUERY,
    ANOMALY_NUMERICAL_FEATURES,
    DATA_QUERY,
    DB_URI,
    TARGET_COLUMN,
)


def load_data():
    """Load and preprocess data from database."""
    print('Loading data from Postgres via Polars...')
    df = pl.read_database_uri(query=DATA_QUERY, uri=DB_URI, engine='connectorx')

    # Feature Engineering
    df = df.with_columns(
        [
            pl.col('pickup_datetime').dt.hour().cast(pl.Float32).alias('pickup_hour'),
            pl.col('pickup_datetime').dt.weekday().cast(pl.Int64).alias('pickup_day'),
            pl.col('pickup_location_id').cast(pl.Int64),
            pl.col('dropoff_location_id').cast(pl.Int64),
            pl.col('trip_distance').cast(pl.Float32),
            pl.col('total_amount').cast(pl.Float32),
            pl.col('precip_mm').cast(pl.Float32),
            pl.col('temp_c').cast(pl.Float32),
            pl.col('is_holiday_int').cast(pl.Int64),
        ]
    ).drop_nulls()

    return df


def load_anomaly_data():
    """Load data for anomaly detection."""
    print('Loading recent data for Anomaly Baseline...')
    df = pl.read_database_uri(query=ANOMALY_DATA_QUERY, uri=DB_URI, engine='connectorx')
    return df


def prepare_features(df):
    """Split features and target, then train/test split."""
    feature_cols = [
        'pickup_location_id',
        'dropoff_location_id',
        'pickup_hour',
        'pickup_day',
        'trip_distance',
        'precip_mm',
        'temp_c',
        'is_holiday_int',
    ]

    X = df.select(feature_cols).to_pandas()
    y = df.select(TARGET_COLUMN).to_pandas()[TARGET_COLUMN]

    return train_test_split(X, y, test_size=0.2, random_state=42)


def prepare_anomaly_features(df):
    """Select features for anomaly detection (no split needed)."""
    return df.select(ANOMALY_NUMERICAL_FEATURES).to_pandas()

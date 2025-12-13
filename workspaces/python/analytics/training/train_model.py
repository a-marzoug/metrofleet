import argparse
import os
import pickle

import mlflow
import mlflow.sklearn
import numpy as np
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
# Allow overriding the production model path via env var. Default to a path
# under the current working directory so containerized runs don't try to write
# to root-owned `/app` (which can be permission-restricted).
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
# Default MLflow tracking URI can be overridden with env var `MLFLOW_TRACKING_URI`.
MLFLOW_TRACKING_URI = os.getenv(
    'MLFLOW_TRACKING_URI', 'sqlite:///mlflow.db'
)  # Internal Docker URL


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


def train(args):
    # 1. Setup MLflow
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow.set_experiment('price_prediction_v1')

    with mlflow.start_run():
        df = load_data()

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

        # 2. Hyperparameters
        model_params = {}
        if args.model_type == 'xgboost':
            model_params = {
                'n_estimators': args.n_estimators,
                'learning_rate': args.learning_rate,
                'max_depth': args.max_depth,
                'base_score': float(np.mean(y_train)),
            }

        # 3. Pipeline
        categorical_features = [
            'pickup_location_id',
            'dropoff_location_id',
            'pickup_day',
        ]
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

        pipeline = Pipeline(
            steps=[
                ('preprocessor', preprocessor),
                ('regressor', xgb.XGBRegressor(n_jobs=1, verbosity=0, **model_params)),
            ]
        )

        print('Training Pipeline...')
        pipeline.fit(X_train, y_train)

        # 4. Evaluate
        preds = pipeline.predict(X_test)
        mae = mean_absolute_error(y_test, preds)

        print(f'✅ MAE: ${mae:.2f}')
        mlflow.log_metric('mae', mae)
        mlflow.log_params(model_params)
        mlflow.log_param('model_type', args.model_type)

        # 5. Save "Production" Copy (For FastAPI to load easily)
        prod_dir = os.path.dirname(PROD_MODEL_PATH)
        os.makedirs(prod_dir, exist_ok=True)
        with open(PROD_MODEL_PATH, 'wb') as f:
            pickle.dump(pipeline, f)
        print(f'💾 Production model saved to {PROD_MODEL_PATH}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    # Define the "Knobs" you want to turn
    parser.add_argument(
        '--model_type', type=str, default='xgboost', choices=['xgboost', 'linear']
    )
    parser.add_argument('--n_estimators', type=int, default=100)
    parser.add_argument('--learning_rate', type=float, default=0.05)
    parser.add_argument('--max_depth', type=int, default=10)

    args = parser.parse_args()
    train(args)

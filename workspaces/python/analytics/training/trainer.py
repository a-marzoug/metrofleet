import os
import pickle

import mlflow
from sklearn.metrics import mean_absolute_error

from .config import EXPERIMENT_NAME, MLFLOW_TRACKING_URI, PROD_MODEL_PATH
from .data_loader import load_data, prepare_features
from .models import create_pipeline


class ModelTrainer:
    def __init__(self):
        mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
        mlflow.set_experiment(EXPERIMENT_NAME)

    def train(self, model_type='xgboost', **model_params):
        """Train model with given parameters."""
        with mlflow.start_run():
            # Load and prepare data
            df = load_data()
            X_train, X_test, y_train, y_test = prepare_features(df)

            # Create and train pipeline
            pipeline = create_pipeline(model_type, y_train, **model_params)
            print(f'Training {model_type} model...')
            pipeline.fit(X_train, y_train)

            # Evaluate
            preds = pipeline.predict(X_test)
            mae = mean_absolute_error(y_test, preds)

            # Log results
            print(f'✅ MAE: ${mae:.2f}')
            mlflow.log_metric('mae', mae)
            mlflow.log_params(model_params)
            mlflow.log_param('model_type', model_type)

            # Save production model
            self._save_production_model(pipeline)

            return pipeline, mae

    def _save_production_model(self, pipeline):
        """Save model for production use."""
        prod_dir = os.path.dirname(PROD_MODEL_PATH)
        os.makedirs(prod_dir, exist_ok=True)
        with open(PROD_MODEL_PATH, 'wb') as f:
            pickle.dump(pipeline, f)
        print(f'💾 Production model saved to {PROD_MODEL_PATH}')

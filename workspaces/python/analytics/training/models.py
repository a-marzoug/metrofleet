import numpy as np
import xgboost as xgb
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from .config import (
    ANOMALY_NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
)


def create_preprocessor():
    """Create preprocessing pipeline."""
    return ColumnTransformer(
        transformers=[
            (
                'cat',
                OneHotEncoder(handle_unknown='ignore', sparse_output=False),
                CATEGORICAL_FEATURES,
            ),
            ('num', StandardScaler(), NUMERICAL_FEATURES),
        ],
        verbose_feature_names_out=False,
    )


def create_anomaly_preprocessor():
    """Create preprocessing pipeline for anomaly detection."""
    return ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ANOMALY_NUMERICAL_FEATURES),
        ],
        verbose_feature_names_out=False,
    )


def create_model(model_type, y_train=None, **params):
    """Create model based on type and parameters."""
    if model_type == 'xgboost':
        return xgb.XGBRegressor(
            n_jobs=1, verbosity=0, base_score=float(np.mean(y_train)), **params
        )
    elif model_type == 'linear':
        return LinearRegression(**params)
    elif model_type == 'random_forest':
        return RandomForestRegressor(random_state=42, **params)
    elif model_type == 'isolation_forest':
        return IsolationForest(n_jobs=-1, random_state=42, **params)
    else:
        raise ValueError(f'Unsupported model type: {model_type}')


def create_pipeline(model_type, y_train=None, **model_params):
    """Create complete ML pipeline."""
    if model_type == 'isolation_forest':
        preprocessor = create_anomaly_preprocessor()
        model = create_model(model_type, **model_params)
        return Pipeline([('scaler', preprocessor), ('model', model)])

    preprocessor = create_preprocessor()
    model = create_model(model_type, y_train, **model_params)

    return Pipeline([('preprocessor', preprocessor), ('regressor', model)])

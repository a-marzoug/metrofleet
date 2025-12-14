import os
import subprocess

from dagster import AssetExecutionContext, AssetKey, Config, asset


class TrainingConfig(Config):
    model_type: str = 'xgboost'
    n_estimators: int = 100
    learning_rate: float = 0.05
    max_depth: int = 10


@asset(
    group_name='training',
    deps=[AssetKey('dm_daily_revenue')],  # Wait for dbt to finish
    description='Retrains the Price Prediction model and logs to MLflow',
)
def price_model_training(context: AssetExecutionContext, config: TrainingConfig):
    """
    Executes the training script via subprocess.
    """
    context.log.info('Starting Model Training...')

    # Run as a module so that relative imports in the package work
    cmd = [
        'python',
        '-m',
        'analytics.training.train_model',
        '--model_type',
        config.model_type,
        '--n_estimators',
        str(config.n_estimators),
        '--learning_rate',
        str(config.learning_rate),
        '--max_depth',
        str(config.max_depth),
    ]

    # Run script
    # We pass the current environment variables so it inherits DB credentials
    # cwd must be the root of the python workspace for the module to be found
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        env={**os.environ},
        cwd='/opt/dagster/app/workspaces/python',
    )

    # Check result
    if result.returncode != 0:
        raise Exception(f'Training failed: {result.stderr}')

    context.log.info(result.stdout)
    context.log.info('Training complete. Check MLflow for details.')

    # Return the production model path so downstream assets / services can pick it up.
    # Prefer environment override, otherwise default to a path under the current
    # working directory (which is typically writable in the Dagster container).
    prod_path = os.getenv(
        'PROD_MODEL_PATH',
        os.path.join(os.getcwd(), 'data', 'models', 'price_model_prod.pkl'),
    )

    return prod_path

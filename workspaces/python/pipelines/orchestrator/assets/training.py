import os
import subprocess

from dagster import AssetExecutionContext, AssetKey, asset


@asset(
    group_name='training',
    deps=[AssetKey('dm_daily_revenue')],  # Wait for dbt to finish
    description='Retrains the Price Prediction model and logs to MLflow',
)
def price_model_training(context: AssetExecutionContext):
    """
    Executes the training script via subprocess.
    """
    context.log.info('Starting Model Training...')

    # Path to script inside the container
    script_path = '/opt/dagster/app/workspaces/python/analytics/training/train_model.py'

    # Run script
    # We pass the current environment variables so it inherits DB credentials
    result = subprocess.run(
        ['python', script_path], capture_output=True, text=True, env={**os.environ}
    )

    if result.returncode != 0:
        raise Exception(f'Training failed: {result.stderr}')

    context.log.info(result.stdout)
    context.log.info('Training complete. Check MLflow for details.')

    # Return the production model path so downstream assets / services can pick it up.
    # Prefer environment override, otherwise default to a path under the current
    # working directory (which is typically writable in the Dagster container).
    prod_path = os.getenv(
        'PROD_MODEL_PATH', os.path.join(os.getcwd(), 'data', 'models', 'price_model_prod.pkl')
    )

    return prod_path

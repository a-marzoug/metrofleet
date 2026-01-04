import pickle

import polars as pl
from dagster import AssetExecutionContext, AssetKey, asset
from sqlalchemy import create_engine

from ..resources.database import PostgresResource


@asset(
    group_name='analytics',
    deps=[AssetKey('fct_trips')],  # Run after the mart is built
    description='Scans for fraud/anomalies using Isolation Forest',
)
def fraud_detection_job(context: AssetExecutionContext, database: PostgresResource):
    model_path = '/app/data/models/anomaly_detector.pkl'

    # 1. Load Model
    try:
        with open(model_path, 'rb') as f:
            pipeline = pickle.load(f)
    except FileNotFoundError:
        context.log.info('No anomaly model found. Skipping check.')
        return 'Skipped'

    # 2. Load Recent Data (e.g., Last 24 hours)
    # In a real system, you'd use the partition key here.
    conn_str = database.get_connection_string()
    query = """
    SELECT 
        vendor_id,
        pickup_datetime,
        trip_distance,
        total_amount,
        EXTRACT(EPOCH FROM (dropoff_datetime - pickup_datetime)) as duration_seconds
    FROM dbt_dev.fct_trips
    ORDER BY pickup_datetime DESC
    LIMIT 10000 -- Scan the latest batch
    """

    df = pl.read_database_uri(query, conn_str, engine='connectorx')

    # 3. Predict Anomalies
    X = df.select(['trip_distance', 'total_amount', 'duration_seconds']).to_pandas()

    # Isolation Forest returns: -1 (Anomaly), 1 (Normal)
    scores = pipeline.predict(X)

    # Attach scores to dataframe
    df_scored = df.with_columns(pl.Series(name='score', values=scores))

    # Filter for Anomalies (-1)
    anomalies = df_scored.filter(pl.col('score') == -1)

    context.log.info(f'Scanned {len(df)} trips. Found {len(anomalies)} anomalies.')

    # 4. Write to Compliance Table
    if len(anomalies) > 0:
        engine = create_engine(conn_str)

        # Prepare for export (Add a 'flagged_at' timestamp)
        export_df = anomalies.with_columns(
            pl.lit('IsolationForest_v1').alias('rule_id')
        )

        # Write
        export_df.write_database(
            table_name='compliance_flags',
            connection=conn_str,
            if_table_exists='append',  # Keep a log history
            engine='sqlalchemy',
        )

        return f'Flagged {len(anomalies)} suspicious trips.'

    return 'No anomalies detected.'

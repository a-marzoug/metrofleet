import subprocess

import polars as pl
from dagster import AssetExecutionContext, MonthlyPartitionsDefinition, asset

from ..resources.database import PostgresResource

# 1. Define the timeframe we care about (e.g., from 2020 to now)
monthly_partitions = MonthlyPartitionsDefinition(start_date='2020-01-01')

# Constants
RAW_DATA_PATH = '/opt/dagster/app/data/raw'


@asset(group_name='ingestion', partitions_def=monthly_partitions)
def raw_taxi_file(context: AssetExecutionContext) -> str:
    """
    1. EXTRACT: Calls the Rust CLI to download data for a specific month.
    """
    # context.partition_key is "2024-01-01"
    # We need to convert it to "2024-01" for your CLI
    partition_date_str = context.partition_key
    yyyy_mm = partition_date_str[:7]

    context.log.info(f'Triggering Rust CLI for: {yyyy_mm}')

    # Construct the command based on your README
    # We set start and end to the same month to download just one file per partition
    # CHANGED: Use the pre-compiled binary 'tlc-cli' instead of 'cargo run'
    cmd = [
        'tlc-cli',
        'download',
        '--type',
        'yellow',
        '--start',
        yyyy_mm,
        '--end',
        yyyy_mm,
        '--output',
        RAW_DATA_PATH,
        '--concurrency',
        '4',  # Be nice to the API inside docker
    ]

    # Run the command
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        raise Exception(f'Rust CLI failed: {result.stderr}')

    # Log the CLI output (progress bars won't show well in logs, but final status will)
    context.log.info(result.stdout)

    # Return the expected path so the downstream asset knows where to look
    return f'{RAW_DATA_PATH}/yellow_tripdata_{yyyy_mm}.parquet'


@asset(
    group_name='ingestion',
    key_prefix=['public'],
    name='raw_yellow_trips',
    partitions_def=monthly_partitions,  # Downstream must share the partition definition
    deps=[raw_taxi_file],
)
def raw_trips_table(context: AssetExecutionContext, database: PostgresResource):
    """
    2. LOAD: Reads the specific month's Parquet and loads to Postgres.
    """
    partition_date_str = context.partition_key
    yyyy_mm = partition_date_str[:7]

    # Construct the path specifically for this month
    parquet_path = f'{RAW_DATA_PATH}/yellow_tripdata_{yyyy_mm}.parquet'

    context.log.info(f'Loading {parquet_path} into Postgres...')

    try:
        # Lazy load with Polars
        df = pl.scan_parquet(parquet_path)

        # We need to collect() to write to DB
        # For huge files, we might want to iterate in chunks, but Polars handles this well usually
        df_collected = df.collect()

        connection_string = database.get_connection_string()

        # Write to DB
        # Important: For partitions, we usually want "append", not "replace".
        # However, to be idempotent (safe to re-run), we should delete data for this month first.

        # IDEMPOTENCY FIX: Delete existing data for this partition
        # Note: This assumes the table has a 'tpep_pickup_datetime' column or similar to filter by date.
        # Since we don't know the exact schema, we might need to rely on a simpler delete or just assume 'append' for now if we can't delete safely.
        # BUT, the plan said "Implement idempotency".
        # Let's try to execute a DELETE query using sqlalchemy engine if possible, or just use 'replace' if the partition IS the whole table (it's not).
        # Wait, 'raw_yellow_trips' is the table.
        # If we append every time, we get duplicates.
        # We should delete rows where the pickup date is in that month.
        # Let's assume there is a column 'tpep_pickup_datetime' (standard for yellow taxi).

        from sqlalchemy import create_engine, text

        engine = create_engine(connection_string)

        # We need to be careful. If the table doesn't exist, this will fail.
        # So we check existence or just try/except.

        delete_query = text(
            f"DELETE FROM raw_yellow_trips WHERE to_char(tpep_pickup_datetime, 'YYYY-MM') = '{yyyy_mm}'"
        )

        table_exists = False
        with engine.connect() as conn:
            # Check if table exists first to avoid error on first run
            # A simple way is to just try the delete and ignore "table not found" error
            try:
                conn.execute(delete_query)
                conn.commit()
                context.log.info(f'Deleted existing data for {yyyy_mm}')
                table_exists = True
            except Exception as e:
                context.log.info(f'Skipping delete (table might not exist yet): {e}')
                table_exists = False

        context.log.info(f'Dataframe shape: {df_collected.shape}')

        if df_collected.height > 0:
            # 1. Ensure Table Exists
            if not table_exists:
                context.log.info('Table does not exist. Creating table structure...')
                df_collected.head(0).write_database(
                    table_name='raw_yellow_trips',
                    connection=connection_string,
                    if_table_exists='replace',
                    engine='sqlalchemy',
                )

            # 2. Filter Data to Match Partition
            # The source file may contain data from other months (e.g. late reporting).
            # To ensure idempotency (and that our DELETE query works), we must only load data
            # that matches the partition key.

            # Create start and end of month dates
            import datetime

            year = int(yyyy_mm[:4])
            month = int(yyyy_mm[5:7])

            start_date = datetime.datetime(year, month, 1)
            if month == 12:
                end_date = datetime.datetime(year + 1, 1, 1)
            else:
                end_date = datetime.datetime(year, month + 1, 1)

            context.log.info(f'Filtering data for range: [{start_date}, {end_date})')

            # Filter using Polars
            # We assume 'tpep_pickup_datetime' is the partitioning column
            df_filtered = df_collected.filter(
                (pl.col('tpep_pickup_datetime') >= start_date)
                & (pl.col('tpep_pickup_datetime') < end_date)
            )

            rows_removed = df_collected.height - df_filtered.height
            if rows_removed > 0:
                context.log.warning(
                    f'Filtered out {rows_removed} rows that were outside the partition month.'
                )

            if df_filtered.height == 0:
                context.log.warning('No data left after filtering! Skipping write.')
                return

            # 3. Bulk Load using COPY
            import io

            context.log.info('Preparing in-memory CSV for COPY...')
            csv_buffer = io.BytesIO()
            df_filtered.write_csv(csv_buffer)
            csv_buffer.seek(0)

            context.log.info('Executing Postgres COPY command...')

            # Get a raw psycopg2 connection from the SQLAlchemy engine
            raw_conn = engine.raw_connection()
            try:
                with raw_conn.cursor() as cursor:
                    cursor.copy_expert(
                        'COPY raw_yellow_trips FROM STDIN WITH CSV HEADER', csv_buffer
                    )
                raw_conn.commit()
                context.log.info(
                    f'Successfully loaded {df_collected.height} rows using COPY.'
                )
            except Exception as e:
                raw_conn.rollback()
                raise e
            finally:
                raw_conn.close()

        else:
            context.log.warning('Dataframe is empty, skipping write.')

    except Exception as e:
        context.log.error(f'Failed to load {parquet_path}: {e}')
        raise e

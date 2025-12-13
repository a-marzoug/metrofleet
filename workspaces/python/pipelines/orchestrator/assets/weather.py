import httpx
import polars as pl
from dagster import AssetExecutionContext, asset
from sqlalchemy import create_engine, text

from ..resources.database import PostgresResource
from .ingestion import monthly_partitions

# NYC Central Park Coordinates
LAT = 40.7831
LON = -73.9712


@asset(group_name='ingestion', partitions_def=monthly_partitions, compute_kind='python')
def raw_weather_data(context: AssetExecutionContext, database: PostgresResource):
    """
    Ingests hourly weather data for the specific partition month.
    Uses 'Delete-Write' pattern for idempotency.
    """
    # 1. Get Partition Window (Start/End of the month)
    # Dagster provides these as datetime objects
    time_window = context.partition_time_window
    start_dt = time_window.start
    end_dt = time_window.end

    # Open-Meteo requires YYYY-MM-DD.
    # Note: end_dt in Dagster is exclusive (2024-02-01), but API usually wants inclusive range.
    # Open-Meteo handles ranges well, but let's be precise.
    # We subtract 1 second to get the last day of the previous month
    api_start = start_dt.strftime('%Y-%m-%d')
    api_end = (end_dt).strftime(
        '%Y-%m-%d'
    )  # Open-Meteo is inclusive, fetching overlap is fine as we dedup/delete

    context.log.info(f'Fetching weather for: {api_start} to {api_end}')

    # 2. Fetch Data (Using httpx)
    url = 'https://archive-api.open-meteo.com/v1/archive'
    params = {
        'latitude': LAT,
        'longitude': LON,
        'start_date': api_start,
        'end_date': api_end,
        'hourly': 'temperature_2m,precipitation,rain,snowfall,windspeed_10m',
        'timezone': 'America/New_York',
    }

    # Synchronous httpx request (Async not strictly needed inside a sync asset)
    with httpx.Client() as client:
        response = client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    # 3. Parse to Polars
    hourly = data['hourly']
    df = pl.DataFrame(
        {
            'time': hourly['time'],
            'temp_c': hourly['temperature_2m'],
            'precip_mm': hourly['precipitation'],
            'snow_cm': hourly['snowfall'],
            'wind_kmh': hourly['windspeed_10m'],
        }
    )

    # Convert string ISO time to Timestamp
    df = df.with_columns(pl.col('time').str.to_datetime().alias('timestamp'))
    df = df.drop('time')

    # Filter to strictly match the partition window (to clean up API overlap)
    # Fix: Convert Dagster's aware datetimes to naive to match Polars (which is naive from API)
    start_dt_naive = start_dt.replace(tzinfo=None)
    end_dt_naive = end_dt.replace(tzinfo=None)
    df = df.filter(
        (pl.col('timestamp') >= start_dt_naive) & (pl.col('timestamp') < end_dt_naive)
    )

    context.log.info(f'Retrieved {df.height} hourly weather records.')

    # 4. Database Load (Idempotent Delete-Write)
    connection_string = database.get_connection_string()
    engine = create_engine(connection_string)

    with engine.connect() as conn:
        # Create table if not exists (One-time setup, or manage via dbt)
        conn.execute(
            text("""
            CREATE TABLE IF NOT EXISTS raw_weather (
                timestamp TIMESTAMP PRIMARY KEY,
                temp_c FLOAT,
                precip_mm FLOAT,
                snow_cm FLOAT,
                wind_kmh FLOAT
            )
        """)
        )

        # DELETE existing data for this month
        delete_query = text(
            'DELETE FROM raw_weather WHERE timestamp >= :start AND timestamp < :end'
        )
        conn.execute(delete_query, {'start': start_dt_naive, 'end': end_dt_naive})
        conn.commit()

    # INSERT new data
    # We use 'append' because we just manually cleared the conflict range
    df.write_database(
        table_name='raw_weather',
        connection=connection_string,
        if_table_exists='append',
        engine='sqlalchemy',
    )

    return f'Loaded weather for {api_start}'

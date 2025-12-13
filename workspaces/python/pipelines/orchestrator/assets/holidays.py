import holidays
import polars as pl
from dagster import AssetExecutionContext, asset

from ..resources.database import PostgresResource


@asset(
    group_name='ingestion',
    compute_kind='python',
    description='Loads NY Holidays for 2020-2027 (Full Refresh)',
)
def raw_holidays_data(context: AssetExecutionContext, database: PostgresResource):
    # 1. Generate Data
    years = [year for year in range(2020, 2028)]
    ny_holidays = holidays.US(subdiv='NY', years=years)

    data = [
        {'date': date, 'holiday_name': name, 'is_workday': False}
        for date, name in ny_holidays.items()
    ]

    df = pl.DataFrame(data)

    # 2. Write to DB (Truncate + Append)
    # We use Truncate + Append instead of Replace to preserve downstream dependencies (views)
    from sqlalchemy import create_engine, inspect, text

    conn_str = database.get_connection_string()
    engine = create_engine(conn_str)

    if inspect(engine).has_table('raw_holidays'):
        with engine.connect() as conn:
            with conn.begin():
                conn.execute(text('TRUNCATE TABLE raw_holidays'))

    df.write_database(
        table_name='raw_holidays',
        connection=conn_str,
        if_table_exists='append',
        engine='sqlalchemy',
    )

    return 'Holidays Refreshed'

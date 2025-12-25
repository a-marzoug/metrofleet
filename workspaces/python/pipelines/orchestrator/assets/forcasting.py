import pandas as pd
import polars as pl
from dagster import AssetExecutionContext, AssetKey, asset
from prophet import Prophet
from sqlalchemy import create_engine

from ..resources.database import PostgresResource


@asset(
    group_name='analytics',
    deps=[AssetKey('dm_daily_revenue')],  # Wait for data to be ready
    compute_kind='python',
    description='Generates 7-day hourly demand forecasts per Borough',
)
def borough_demand_forecast(context: AssetExecutionContext, database: PostgresResource):
    # 1. Fetch Data
    conn_str = database.get_connection_string()

    query = """
    SELECT 
        date_trunc('hour', pickup_datetime) as ds,
        pickup_borough,
        count(*) as y
    FROM dbt_dev.fct_trips
    WHERE pickup_borough IS NOT NULL 
      AND pickup_borough != 'Unknown'
    GROUP BY 1, 2
    """

    df_pl = pl.read_database_uri(query, conn_str, engine='connectorx')
    boroughs = df_pl['pickup_borough'].unique().to_list()

    all_forecasts = []

    # 2. Loop & Train
    for borough in boroughs:
        context.log.info(f'Forecasting for {borough}...')

        # Prep Data
        df_b = df_pl.filter(pl.col('pickup_borough') == borough).to_pandas()
        if len(df_b) < 48:  # Skip if not enough data
            continue

        df_b['ds'] = df_b['ds'].dt.tz_localize(None)

        # Train
        m = Prophet(
            yearly_seasonality=False, weekly_seasonality=True, daily_seasonality=True
        )
        m.add_country_holidays(country_name='US')
        m.fit(df_b)

        # Predict (Next 7 days)
        future = m.make_future_dataframe(periods=24 * 7, freq='H')
        forecast = m.predict(future)

        # Cleanup Result
        result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].copy()
        result['pickup_borough'] = borough

        # We only care about future data or recent data (e.g., last 30 days + future)
        # For this table, let's store everything so we can see historical fit
        all_forecasts.append(result)

    # 3. Combine
    final_df = pd.concat(all_forecasts)

    # Rename for DB
    final_df.rename(
        columns={
            'ds': 'forecast_timestamp',
            'yhat': 'predicted_demand',
            'yhat_lower': 'conf_lower',
            'yhat_upper': 'conf_upper',
        },
        inplace=True,
    )

    # 4. Save to Postgres
    engine = create_engine(conn_str)

    # We use Replace to overwrite the forecast table daily
    final_df.to_sql(
        'demand_forecasts', engine, if_exists='replace', index=False, chunksize=1000
    )

    return f'Generated forecasts for {len(boroughs)} boroughs.'

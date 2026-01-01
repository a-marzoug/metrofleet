"""Database connection and data loading utilities."""

import pandas as pd
import streamlit as st
from sqlalchemy import create_engine
from src.config.settings import DASHBOARD_CONFIG, DB_CONFIG


@st.cache_resource
def get_db_connection():
    """Create and cache database connection."""
    db_url = f'postgresql://{DB_CONFIG["user"]}:{DB_CONFIG["password"]}@{DB_CONFIG["host"]}:{DB_CONFIG["port"]}/{DB_CONFIG["database"]}'
    return create_engine(db_url)


@st.cache_data(ttl=DASHBOARD_CONFIG['cache_ttl'])
def load_revenue_data():
    """Load revenue data from data warehouse."""
    engine = get_db_connection()
    query = 'SELECT * FROM dbt_dev.dm_daily_revenue ORDER BY revenue_date DESC'
    try:
        return pd.read_sql(query, engine)
    except Exception:
        return pd.DataFrame()


@st.cache_data(ttl=DASHBOARD_CONFIG['cache_ttl'])
def load_forecast_data():
    """Load demand forecast data from data warehouse.

    Returns forecasts for timestamps greater than the latest historical data.
    """
    engine = get_db_connection()
    query = """
    WITH latest_historical AS (
        SELECT MAX(forecast_timestamp) as max_ts
        FROM demand_forecasts
        WHERE predicted_demand IS NOT NULL
    )
    SELECT 
        forecast_timestamp,
        predicted_demand,
        conf_lower,
        conf_upper,
        pickup_borough
    FROM demand_forecasts, latest_historical
    WHERE forecast_timestamp > (
        SELECT MAX(forecast_timestamp) - INTERVAL '7 days'
        FROM demand_forecasts
    )
    ORDER BY pickup_borough, forecast_timestamp
    """
    try:
        return pd.read_sql(query, engine)
    except Exception:
        return pd.DataFrame()

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

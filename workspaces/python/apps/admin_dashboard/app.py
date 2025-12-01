import os

import pandas as pd
import plotly.express as px
import streamlit as st
from sqlalchemy import create_engine

# 1. Config & Connection
st.set_page_config(page_title='MetroFleet Ops', layout='wide')


@st.cache_resource
def get_db_connection():
    # Connects to the warehouse service defined in docker-compose
    db_url = f'postgresql://{os.getenv("POSTGRES_USER")}:{os.getenv("POSTGRES_PASSWORD")}@{os.getenv("POSTGRES_HOST")}:5432/{os.getenv("POSTGRES_DB")}'
    return create_engine(db_url)


# 2. Load Data
@st.cache_data(ttl=3600)
def load_revenue_data():
    engine = get_db_connection()
    # We query the Mart table created by dbt
    query = 'SELECT * FROM dbt_dev.dm_daily_revenue ORDER BY revenue_date DESC'
    try:
        return pd.read_sql(query, engine)
    except Exception:
        return pd.DataFrame()


# 3. UI Layout
st.title('🚖 MetroFleet Operational Dashboard')

df = load_revenue_data()

if df.empty:
    st.warning(
        "No data found in 'dm_daily_revenue'. Please run the Dagster pipeline first."
    )
else:
    # Top KPIs
    kpi1, kpi2, kpi3 = st.columns(3)
    kpi1.metric('Total Revenue', f'${df["total_revenue"].sum():,.0f}')
    kpi2.metric('Total Trips', f'{df["total_trips"].sum():,.0f}')
    kpi3.metric('Avg Tip', f'${df["total_tips"].mean():.2f}')

    # Charts
    col1, col2 = st.columns(2)

    with col1:
        st.subheader('Daily Revenue Trend')
        fig_rev = px.line(df, x='revenue_date', y='total_revenue')
        st.plotly_chart(fig_rev, use_container_width=True)

    with col2:
        st.subheader('Trips by Borough')
        # Simple aggregation for the pie chart
        df_borough = df.groupby('pickup_borough')['total_trips'].sum().reset_index()
        fig_pie = px.pie(df_borough, values='total_trips', names='pickup_borough')
        st.plotly_chart(fig_pie, use_container_width=True)

    st.subheader('Raw Mart Data')
    st.dataframe(df)

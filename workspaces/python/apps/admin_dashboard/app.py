"""Metrofleet Analytics Dashboard - Main Application."""

import streamlit as st
from src.components.charts import (
    create_borough_pie_chart,
    create_revenue_by_borough_chart,
    create_revenue_trend_chart,
    create_trip_volume_chart,
)
from src.components.data_table import render_data_table
from src.components.header import render_header
from src.components.metrics import display_kpi_metrics
from src.components.sidebar import render_sidebar
from src.config.settings import DASHBOARD_CONFIG, TIME_PERIODS
from src.config.styles import CUSTOM_CSS
from src.utils.data_processing import (
    aggregate_by_borough,
    calculate_metrics,
    filter_by_time_period,
)
from src.utils.database import load_revenue_data

# Page Configuration
st.set_page_config(
    page_title=DASHBOARD_CONFIG['title'],
    page_icon=DASHBOARD_CONFIG['page_icon'],
    layout=DASHBOARD_CONFIG['layout'],
    initial_sidebar_state='expanded',
)

# Apply Custom Styles
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# Render Sidebar and Get Controls
date_range = render_sidebar()

# Render Header
render_header()

# Load Data
df = load_revenue_data()

if df.empty:
    st.error('⚠️ No data available. Please run the Dagster pipeline.')
    st.info(
        '💡 **Next Steps:**\n1. Ensure the data pipeline is running\n2. Check database connectivity\n3. Verify dbt models are built'
    )
else:
    # Apply Time Filter
    days = TIME_PERIODS[date_range]
    df_filtered = filter_by_time_period(df, days)

    # Calculate Metrics
    metrics = calculate_metrics(df_filtered)

    # Display KPIs
    st.markdown(
        '<div class="section-header">📊 Key Performance Indicators</div>',
        unsafe_allow_html=True,
    )
    display_kpi_metrics(metrics)

    st.markdown('---')

    # Revenue Analytics Section
    st.markdown(
        '<div class="section-header">📈 Revenue Analytics</div>', unsafe_allow_html=True
    )

    col1, col2 = st.columns(2)

    with col1:
        fig_rev = create_revenue_trend_chart(df_filtered)
        st.plotly_chart(fig_rev, use_container_width=True)

    with col2:
        fig_trips = create_trip_volume_chart(df_filtered)
        st.plotly_chart(fig_trips, use_container_width=True)

    st.markdown('---')

    # Geographic Analysis Section
    st.markdown(
        '<div class="section-header">🗺️ Geographic Distribution</div>',
        unsafe_allow_html=True,
    )

    df_borough = aggregate_by_borough(df_filtered)

    col1, col2 = st.columns(2)

    with col1:
        fig_pie = create_borough_pie_chart(df_borough)
        st.plotly_chart(fig_pie, use_container_width=True)

    with col2:
        fig_bar = create_revenue_by_borough_chart(df_borough)
        st.plotly_chart(fig_bar, use_container_width=True)

    st.markdown('---')

    # Data Table Section
    render_data_table(df_filtered)

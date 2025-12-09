"""KPI metrics display components."""

import streamlit as st


def display_kpi_metrics(metrics: dict):
    """Display KPI metrics in columns."""
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            label='💰 Total Revenue',
            value=f'${metrics["total_revenue"]:,.0f}',
            delta=f'{metrics["revenue_trend"]:.1f}%'
            if metrics['revenue_trend']
            else None,
        )

    with col2:
        st.metric(
            label='🚖 Total Trips',
            value=f'{metrics["total_trips"]:,.0f}',
            delta=f'{metrics["trips_trend"]:.1f}%' if metrics['trips_trend'] else None,
        )

    with col3:
        st.metric(label='💵 Avg Fare', value=f'${metrics["avg_fare"]:.2f}')

    with col4:
        st.metric(label='⭐ Avg Tip', value=f'${metrics["avg_tip"]:.2f}')

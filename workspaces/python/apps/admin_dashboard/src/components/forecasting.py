"""Forecasting visualization components."""

import pandas as pd
import plotly.graph_objects as go
import streamlit as st


def create_forecast_chart(df: pd.DataFrame, borough: str) -> go.Figure:
    """Create demand forecast line chart with confidence interval.

    Args:
        df: Forecast DataFrame with columns: forecast_timestamp, predicted_demand,
            conf_lower, conf_upper, pickup_borough
        borough: Borough name to filter and display

    Returns:
        Plotly Figure with forecast visualization
    """
    df_borough = df[df['pickup_borough'] == borough].copy()

    fig = go.Figure()

    # Confidence interval (filled area)
    fig.add_trace(
        go.Scatter(
            x=df_borough['forecast_timestamp'],
            y=df_borough['conf_upper'],
            mode='lines',
            line=dict(width=0),
            showlegend=False,
            hoverinfo='skip',
        )
    )

    fig.add_trace(
        go.Scatter(
            x=df_borough['forecast_timestamp'],
            y=df_borough['conf_lower'],
            mode='lines',
            line=dict(width=0),
            fill='tonexty',
            fillcolor='rgba(102, 126, 234, 0.2)',
            name='Confidence Interval',
            hoverinfo='skip',
        )
    )

    # Main prediction line
    fig.add_trace(
        go.Scatter(
            x=df_borough['forecast_timestamp'],
            y=df_borough['predicted_demand'],
            mode='lines',
            name='Predicted Demand',
            line=dict(color='#667eea', width=3),
            hovertemplate='%{y:.0f} trips<extra></extra>',
        )
    )

    fig.update_layout(
        title=f'Demand Forecast - {borough}',
        xaxis_title='Date & Time',
        yaxis_title='Predicted Trips',
        template='plotly_dark',
        hovermode='x unified',
        height=400,
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=1.02,
            xanchor='right',
            x=1,
        ),
    )

    return fig


def render_forecast_section(df_forecast: pd.DataFrame):
    """Render the demand forecasting section.

    Args:
        df_forecast: Forecast DataFrame from load_forecast_data()
    """
    if df_forecast.empty:
        st.info(
            '🔮 **Forecast data not available.**\n\n'
            'Run the Dagster pipeline to generate demand forecasts.'
        )
        return

    boroughs = sorted(df_forecast['pickup_borough'].unique().tolist())

    col1, col2 = st.columns([1, 3])

    with col1:
        selected_borough = st.selectbox(
            'Select Borough',
            options=boroughs,
            key='forecast_borough_selector',
        )

        # Display forecast summary
        df_borough = df_forecast[df_forecast['pickup_borough'] == selected_borough]
        if not df_borough.empty:
            avg_demand = df_borough['predicted_demand'].mean()
            max_demand = df_borough['predicted_demand'].max()
            st.metric('📊 Avg Hourly Demand', f'{avg_demand:.0f}')
            st.metric('📈 Peak Demand', f'{max_demand:.0f}')

    with col2:
        fig = create_forecast_chart(df_forecast, selected_borough)
        st.plotly_chart(fig, use_container_width=True)

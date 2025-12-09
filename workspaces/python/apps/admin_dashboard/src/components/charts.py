"""Chart visualization components."""

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


def create_revenue_trend_chart(df: pd.DataFrame) -> go.Figure:
    """Create revenue trend line chart."""
    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=df['revenue_date'],
            y=df['total_revenue'],
            mode='lines+markers',
            name='Revenue',
            line=dict(color='#667eea', width=3),
            marker=dict(size=8, color='#764ba2'),
            fill='tozeroy',
            fillcolor='rgba(102, 126, 234, 0.1)',
        )
    )

    fig.update_layout(
        title='Daily Revenue Trend',
        xaxis_title='Date',
        yaxis_title='Revenue ($)',
        template='plotly_dark',
        hovermode='x unified',
        height=400,
    )
    return fig


def create_trip_volume_chart(df: pd.DataFrame) -> go.Figure:
    """Create trip volume bar chart."""
    fig = go.Figure()
    fig.add_trace(
        go.Bar(
            x=df['revenue_date'],
            y=df['total_trips'],
            name='Trips',
            marker=dict(
                color=df['total_trips'],
                colorscale='Viridis',
                showscale=True,
                colorbar=dict(title='Trips'),
            ),
        )
    )

    fig.update_layout(
        title='Daily Trip Volume',
        xaxis_title='Date',
        yaxis_title='Number of Trips',
        template='plotly_dark',
        height=400,
    )
    return fig


def create_borough_pie_chart(df_borough: pd.DataFrame) -> go.Figure:
    """Create borough distribution donut chart."""
    fig = go.Figure(
        data=[
            go.Pie(
                labels=df_borough['pickup_borough'],
                values=df_borough['total_trips'],
                hole=0.4,
                marker=dict(colors=px.colors.qualitative.Set3),
                textinfo='label+percent',
                textfont_size=12,
            )
        ]
    )

    fig.update_layout(
        title='Trips by Borough', template='plotly_dark', height=400, showlegend=True
    )
    return fig


def create_revenue_by_borough_chart(df_borough: pd.DataFrame) -> go.Figure:
    """Create revenue by borough bar chart."""
    fig = go.Figure(
        data=[
            go.Bar(
                x=df_borough['pickup_borough'],
                y=df_borough['total_revenue'],
                marker=dict(
                    color=df_borough['total_revenue'],
                    colorscale='Blues',
                    showscale=True,
                    colorbar=dict(title='Revenue ($)'),
                ),
                text=df_borough['total_revenue'].apply(lambda x: f'${x:,.0f}'),
                textposition='outside',
            )
        ]
    )

    fig.update_layout(
        title='Revenue by Borough',
        xaxis_title='Borough',
        yaxis_title='Revenue ($)',
        template='plotly_dark',
        height=400,
    )
    return fig

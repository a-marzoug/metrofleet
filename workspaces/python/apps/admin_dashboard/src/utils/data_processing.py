"""Data processing and transformation utilities."""

import pandas as pd


def filter_by_time_period(df: pd.DataFrame, days: int = None) -> pd.DataFrame:
    """Filter dataframe by number of days."""
    if days is None:
        return df
    return df.head(days)


def calculate_metrics(df: pd.DataFrame) -> dict:
    """Calculate key performance metrics."""
    total_revenue = df['total_revenue'].sum()
    total_trips = df['total_trips'].sum()
    avg_fare = total_revenue / total_trips if total_trips > 0 else 0
    avg_tip = df['total_tips'].mean()

    # Calculate trends
    revenue_trend = None
    trips_trend = None
    if len(df) > 1:
        revenue_trend = (
            df['total_revenue'].iloc[0] / df['total_revenue'].iloc[-1] - 1
        ) * 100
        trips_trend = (df['total_trips'].iloc[0] / df['total_trips'].iloc[-1] - 1) * 100

    return {
        'total_revenue': total_revenue,
        'total_trips': total_trips,
        'avg_fare': avg_fare,
        'avg_tip': avg_tip,
        'revenue_trend': revenue_trend,
        'trips_trend': trips_trend,
    }


def aggregate_by_borough(df: pd.DataFrame) -> pd.DataFrame:
    """Aggregate data by borough."""
    return (
        df.groupby('pickup_borough')
        .agg({'total_trips': 'sum', 'total_revenue': 'sum'})
        .reset_index()
    )

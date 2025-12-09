"""Data table display component."""

from datetime import datetime

import pandas as pd
import streamlit as st
from src.config.settings import DISPLAY_ROWS


def render_data_table(df: pd.DataFrame):
    """Render searchable and exportable data table."""
    st.markdown(
        '<div class="section-header">📋 Detailed Data</div>', unsafe_allow_html=True
    )

    col1, col2 = st.columns([3, 1])
    with col1:
        search = st.text_input('🔍 Search by borough', '')
    with col2:
        show_rows = st.selectbox('Rows to display', DISPLAY_ROWS, index=1)

    # Filter data
    filtered_df = df
    if search:
        filtered_df = df[
            df['pickup_borough'].str.contains(search, case=False, na=False)
        ]

    # Display formatted table
    st.dataframe(
        filtered_df.head(show_rows).style.format(
            {
                'total_revenue': '${:,.2f}',
                'total_trips': '{:,.0f}',
                'total_tips': '${:,.2f}',
                'avg_trip_distance': '{:.2f} mi',
            }
        ),
        use_container_width=True,
        height=400,
    )

    # Export button
    csv = filtered_df.to_csv(index=False)
    st.download_button(
        label='📥 Download Data as CSV',
        data=csv,
        file_name=f'metrofleet_data_{datetime.now().strftime("%Y%m%d")}.csv',
        mime='text/csv',
    )

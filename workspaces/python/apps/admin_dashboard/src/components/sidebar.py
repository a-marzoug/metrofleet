"""Sidebar navigation and controls."""

from datetime import datetime

import streamlit as st
from src.config.settings import TIME_PERIODS


def render_sidebar() -> str:
    """Render sidebar with controls and return selected time period."""
    with st.sidebar:
        st.markdown('### 🚕 Metrofleet')
        st.markdown('---')

        st.markdown('### 📊 Dashboard Controls')

        date_range = st.selectbox('Time Period', list(TIME_PERIODS.keys()), index=1)

        if st.button('🔄 Refresh Data', use_container_width=True):
            st.cache_data.clear()
            st.rerun()

        st.markdown('---')
        st.markdown('### ℹ️ About')
        st.markdown("""
        **Metrofleet Analytics**
        
        Real-time operational insights for fleet management.
        
        📈 Data updated hourly  
        ⚡ Powered by dbt & Dagster
        """)

        st.markdown('---')
        st.caption(f'Last updated: {datetime.now().strftime("%Y-%m-%d %H:%M")}')

    return date_range

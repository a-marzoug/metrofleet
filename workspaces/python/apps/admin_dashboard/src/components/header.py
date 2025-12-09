"""Dashboard header component."""

import streamlit as st


def render_header():
    """Render dashboard header."""
    st.markdown(
        """
    <div class="dashboard-header">
        <h1 class="dashboard-title">🚕 Metrofleet Analytics</h1>
        <p class="dashboard-subtitle">Operational Intelligence & Revenue Insights</p>
    </div>
    """,
        unsafe_allow_html=True,
    )

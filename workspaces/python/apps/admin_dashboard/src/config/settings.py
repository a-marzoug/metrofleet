"""Dashboard configuration settings."""

import os

# Database Configuration
DB_CONFIG = {
    'user': os.getenv('POSTGRES_USER'),
    'password': os.getenv('POSTGRES_PASSWORD'),
    'host': os.getenv('POSTGRES_HOST'),
    'port': '5432',
    'database': os.getenv('POSTGRES_DB'),
}

# Dashboard Configuration
DASHBOARD_CONFIG = {
    'title': 'Metrofleet Analytics',
    'page_icon': '🚕',
    'layout': 'wide',
    'cache_ttl': 3600,
}

# Time Period Options
TIME_PERIODS = {
    'Last 7 Days': 7,
    'Last 30 Days': 30,
    'Last 90 Days': 90,
    'All Time': None,
}

# Display Options
DISPLAY_ROWS = [10, 25, 50, 100]

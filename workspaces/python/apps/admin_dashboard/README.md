# Metrofleet Analytics Dashboard

Professional operational intelligence dashboard with modular architecture.

## Project Structure

```
admin_dashboard/
├── app.py                      # Main application (90 lines)
├── src/
│   ├── components/             # UI Components
│   │   ├── charts.py          # Chart visualizations
│   │   ├── data_table.py      # Data table display
│   │   ├── header.py          # Dashboard header
│   │   ├── metrics.py         # KPI metrics
│   │   └── sidebar.py         # Sidebar controls
│   ├── config/                 # Configuration
│   │   ├── settings.py        # App settings
│   │   └── styles.py          # CSS styles
│   └── utils/                  # Utilities
│       ├── database.py        # Database operations
│       └── data_processing.py # Data transformations
└── docs/
    ├── ARCHITECTURE.md         # Architecture details
    ├── QUICKSTART.md          # Quick start guide
    └── IMPROVEMENTS.md        # Change history
```

## Features

### 🎨 Professional Design

- Custom CSS with gradient headers
- Dark theme with modern colors
- Responsive layout
- Clean, branded interface

### 📊 Analytics

- **KPI Metrics**: Revenue, trips, fares, tips with trends
- **Revenue Analytics**: Daily trends and volume charts
- **Geographic Analysis**: Borough distribution and revenue
- **Data Table**: Searchable, filterable, exportable

### 🎛️ Interactive Controls

- Time period filtering (7/30/90 days, all-time)
- Search by borough
- Adjustable row display
- CSV export
- Manual refresh

### 🏗️ Modular Architecture

- **Components**: Reusable UI elements
- **Utils**: Business logic and data processing
- **Config**: Centralized settings
- **Clean separation**: Easy to maintain and extend

## Quick Start

```bash
# Run the dashboard
docker compose up -d dashboard

# Access at
http://localhost:8501
```

## Environment Variables

```bash
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_DB=metrofleet
```

## Architecture Benefits

### Modular Design

- **90-line main file** (down from 280)
- **13 focused modules** (30-100 lines each)
- **Clear responsibilities** per module
- **Easy to test** and maintain

### Code Organization

```python
# Components (UI)
from src.components.charts import create_revenue_trend_chart
from src.components.metrics import display_kpi_metrics

# Utils (Logic)
from src.utils.database import load_revenue_data
from src.utils.data_processing import calculate_metrics

# Config (Settings)
from src.config.settings import DASHBOARD_CONFIG
from src.config.styles import CUSTOM_CSS
```

## Adding Features

### New Chart

```python
# src/components/charts.py
def create_new_chart(df: pd.DataFrame) -> go.Figure:
    # Chart logic
    return fig

# app.py
fig = create_new_chart(df)
st.plotly_chart(fig)
```

### New Metric

```python
# src/utils/data_processing.py
def calculate_metrics(df: pd.DataFrame) -> dict:
    new_metric = df["column"].calculation()
    return {..., "new_metric": new_metric}

# src/components/metrics.py
st.metric("New Metric", metrics["new_metric"])
```

## Testing

```python
# Test data processing
from src.utils.data_processing import calculate_metrics

def test_metrics():
    df = create_sample_data()
    metrics = calculate_metrics(df)
    assert metrics["total_revenue"] > 0

# Test charts
from src.components.charts import create_revenue_trend_chart

def test_chart():
    df = create_sample_data()
    fig = create_revenue_trend_chart(df)
    assert fig is not None
```

## Performance

- **Caching**: Database connection and data cached
- **Efficient**: Single query, in-memory filtering
- **Fast**: Charts render in <500ms

## Documentation

- **ARCHITECTURE.md**: Detailed architecture guide
- **QUICKSTART.md**: Getting started guide

## Dependencies

```bash
streamlit>=1.50.0
plotly>=6.5.0
pandas>=2.3.3
psycopg2-binary>=2.9.11
sqlalchemy>=2.0.44
```

## Comparison

| Aspect | Before | After |
|--------|--------|-------|
| Main file | 280 lines | 90 lines |
| Files | 1 monolithic | 13 modular |
| Testability | Low | High |
| Maintainability | Difficult | Easy |
| Reusability | None | High |

## Best Practices

✅ Separation of concerns

✅ Single responsibility principle

✅ Reusable components

✅ Type hints and docstrings

✅ Efficient caching

✅ Clear naming conventions

✅ Minimal dependencies

✅ Easy to extend

# Metrofleet API Gateway

FastAPI-based ML model serving API for fare prediction.

## Project Structure

```
api_gateway/
├── app/
│   ├── __init__.py
│   ├── main.py               # Application entry point
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py   # API router aggregation
│   │       ├── health.py     # Health check endpoints
│   │       └── prediction.py # Prediction endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py         # Configuration settings
│   ├── models/
│   │   ├── __init__.py
│   │   └── loader.py         # ML model management
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── trip.py           # Pydantic models
│   └── services/
│       ├── __init__.py
│       ├── features.py       # Feature engineering
│       └── prediction.py     # Business logic
├── main.py                   # Backward compatibility
└── pyproject.toml
```

## Architecture

### Layers

1. **API Layer** (`app/api/`): HTTP endpoints and routing
2. **Service Layer** (`app/services/`): Business logic and orchestration
3. **Model Layer** (`app/models/`): ML model loading and management
4. **Schema Layer** (`app/schemas/`): Request/response validation
5. **Core Layer** (`app/core/`): Configuration and utilities

### Design Principles

- **Separation of Concerns**: Each module has a single responsibility
- **Dependency Injection**: Services receive dependencies explicitly
- **Versioned APIs**: `/v1/` prefix allows future API versions
- **Type Safety**: Pydantic models for validation
- **Testability**: Pure functions and dependency injection

## Running the API

```bash
# Development
uvicorn app.main:app --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /health` - Health check and model status
- `POST /predict/fare` - Fare prediction

## Configuration

Environment variables (optional):

- `MODEL_PATH`: Path to model file (default: `/app/data/models/price_model_prod.pkl`)
- `MIN_FARE`: Minimum fare threshold (default: `2.50`)

## Adding New Features

### New Endpoint

1. Create router in `app/api/v1/`
2. Register in `app/api/v1/__init__.py`

### New Model

1. Add loading logic in `app/models/loader.py`
2. Create service in `app/services/`
3. Create endpoint in `app/api/v1/`

### New Configuration

Add to `app/core/config.py` Settings class

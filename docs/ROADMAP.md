# Project Roadmap

## Phase 1: Operational Visibility (✅ Completed)

**Goal:** Establish the Data Foundation and Reporting.

- [x] **Infrastructure:** Dockerized Postgres & Dagster.
- [x] **Ingestion:** High-performance Rust CLI for TLC data.
- [x] **Transformation:** dbt project (Staging -> Core -> Marts).
- [x] **UI:** Streamlit Admin Dashboard.

## Phase 2: Dynamic Pricing Engine (✅ Completed)

**Goal:** Predict fare costs using Machine Learning.

- [x] **Feature Eng:** Weather (Open-Meteo) & Holiday data enrichment.
- [x] **Modeling:** XGBoost Regression trained via Polars.
- [x] **MLOps:** MLflow 3.x for experiment tracking.

## Phase 3: The Consumer App (✅ Completed)

**Goal:** Allow users to get quotes via an API and Web App.

- [x] **Backend:** FastAPI Microservice serving `.pkl` models.
- [x] **SDK:** TypeScript Client (`@metrofleet/sdk`).
- [x] **Frontend:** Next.js 15 + Shadcn UI + Leaflet Maps.

## Phase 4: Fleet Optimization (✅ Completed)

**Goal:** Predict future demand to reduce driver idle time.

- [x] **Forecasting:** Prophet Time-Series model (7-day hourly forecast).
- [x] **Pipeline:** Dagster asset to generating forecasts per Borough.
- [x] **Viz:** Forecast tab in Admin Dashboard.

## Phase 5: Revenue Protection & AI (✅ Completed)

**Goal:** Automated compliance and self-service analytics.

- [x] **Anomaly Detection:** Isolation Forest model to flag fraudulent trips.
- [x] **AI Analyst:** Generative UI Chatbot (Next.js + Vercel AI SDK + Gemini) for natural language SQL querying.

# Project Roadmap

## Phase 1: Operational Visibility (✅ Completed)

**Goal:** Establish the Data Foundation and Reporting.

- [x] **Infrastructure:** Dockerized Postgres & Dagster.
- [x] **Ingestion:** High-performance Rust CLI for TLC data.
- [x] **Transformation:** dbt project (Staging -> Core -> Marts).
- [x] **UI:** Streamlit Admin Dashboard for Revenue Analytics.

## Phase 2: Dynamic Pricing Engine (✅ Completed)

**Goal:** Predict fare costs to reduce customer abandonment.

- [x] **EDA:** Jupyter Notebooks (Polars) to correlate Distance/Time with Price.
- [x] **Modeling:** Train XGBoost Regression model.
- [x] **MLOps:** MLflow 3.x for Experiment Tracking.
- [x] **Automation:** Dagster pipeline to retrain model on new data.

## Phase 3: The Consumer App (✅ Completed)

**Goal:** Allow users to get quotes via an API and Web App.

- [x] **Backend:** FastAPI Microservice to serve `.pkl` model.
- [x] **Contract:** Open API (Swagger) definition.
- [x] **SDK:** TypeScript Client Library (`@metrofleet/sdk`).
- [x] **Frontend:** Next.js + Tailwind React App (Metrohail).
- [x] **Visualization:** Interactive Map using Leaflet/OpenStreetMap.
- [x] **Integration:** Full end-to-end flow (UI -> SDK -> API -> Model).

## Phase 3.5: AI Analyst (✅ Completed)

**Goal:** Enable conversational analytics for non-technical users.

- [x] **UI:** Chat Interface (Next.js + Vercel AI SDK).
- [x] **Intelligence:** Google Gemini integration for natural language understanding.
- [x] **Tooling:** Read-only SQL tool for safe database querying.
- [x] **Safety:** Query validation and row limits.

## Phase 4: Fleet Optimization (Planned)

**Goal:** Reduce driver idle time.

- [ ] **Forecasting:** Time-Series model (Prophet) for demand prediction.
- [ ] **Visualization:** Heatmap of future demand in Admin Dashboard.

## Phase 5: Driver Experience & Safety (Planned)

**Goal:** Increase driver retention and reduce fraud.

- [ ] **Tipping Insights:** Classification model for high-value zones.
- [ ] **Anomaly Detection:** Isolation Forest for fraud detection.

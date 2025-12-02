# Project Roadmap

## Phase 1: Operational Visibility (✅ Completed)

**Goal:** Establish the Data Foundation and Reporting.

- [x] **Infrastructure:** Dockerized Postgres & Dagster.
- [x] **Ingestion:** High-performance Rust CLI for TLC data.
- [x] **Warehousing:** "Delete-Write" idempotent loading pattern.
- [x] **Transformation:** dbt project (Staging -> Core -> Marts).
- [x] **UI:** Streamlit Admin Dashboard for Revenue Analytics.

## Phase 2: Dynamic Pricing Engine (🚧 In Progress)

**Goal:** Predict fare costs to reduce customer abandonment.

- [ ] **EDA:** Jupyter Notebooks to correlate Distance/Time with Price.
- [ ] **Modeling:** Train XGBoost Regression model.
- [ ] **MLOps:** Pipeline to serialize and version the model artifact.

## Phase 3: The Consumer App (Planned)

**Goal:** Allow users to get quotes via an API.

- [ ] **Backend:** FastAPI Gateway to serve predictions.
- [ ] **Frontend:** Next.js + Tailwind React App.
- [ ] **Integration:** Connect App to Pricing API.

## Phase 4: Fleet Optimization (Planned)

**Goal:** Reduce driver idle time.

- [ ] **Forecasting:** Time-Series model (Prophet) for demand prediction.
- [ ] **Visualization:** Heatmap of future demand in Admin Dashboard.

## Phase 5: Driver Experience & Safety (Planned)

**Goal:** Increase driver retention and reduce fraud.

- [ ] **Tipping Insights:** Classification model for high-value zones.
- [ ] **Anomaly Detection:** Isolation Forest for fraud detection.

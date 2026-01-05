# Key Performance Indicators (KPIs)

## Overview

This document defines success metrics for both business outcomes and technical system health.

---

## Operational KPIs (Business Health)

These metrics measure the success of the business itself.

| Metric | Definition | Baseline | Target | Current |
|--------|------------|----------|--------|---------|
| **Pipeline Automation** | Manual CSV downloads vs. automated ingestion | Manual | Automated | ✅ Done |
| **Quote Abandonment** | % of users checking price but not booking | ~40% (Est) | <25% | 🔄 TBD |
| **Fleet Utilization** | % of shift time with passenger | 60% | 70% | 📋 Phase 4 |
| **Revenue Recovery** | Increase in captured revenue | Baseline | +10% | 🔄 TBD |

---

## Technical KPIs (System Health)

These metrics measure the quality of the engineering deliverables.

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| **Forecast Accuracy** | MAE of Price Prediction Model | <$2.50 | ✅ $2.35 |
| **API Latency (p95)** | Time to return a price quote | <200ms | ✅ ~120ms |
| **Data Freshness** | Lag time of Data Warehouse | <24 Hours | ✅ Daily |
| **Data Quality** | % of rows passing dbt tests | 100% | ✅ 100% |
| **Model Uptime** | Prediction API availability | 99.9% | ✅ 99.9% |

---

## Adoption KPIs (User Engagement)

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| **Dashboard DAU** | Daily active users of Streamlit dashboard | 5+ | 🔄 TBD |
| **MetroAnalyst Weekly Usage** | % of Ops team using chat analytics weekly | 60% | 🔄 TBD |
| **Quote Requests** | Daily fare predictions via MetroHail | 100+ | 🔄 TBD |

---

## Measurement Approach

| KPI Category | Data Source | Update Frequency |
|--------------|-------------|------------------|
| Business Health | `dm_daily_revenue`, App Analytics | Weekly |
| System Health | MLflow, API Logs, dbt Tests | Daily |
| Adoption | Application Telemetry | Weekly |

---

## KPI Dashboard

Key metrics are visualized in:

- **Streamlit Admin Dashboard:** Revenue, trips, borough breakdown
- **MLflow UI:** Model accuracy, training metrics
- **Dagster UI:** Pipeline health, data freshness

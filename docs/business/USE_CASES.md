# Business Use Cases

## Overview

This document details the business problems addressed by the Metrofleet platform and their technical solutions.

| Case | Problem | Solution | Status |
|------|---------|----------|--------|
| 001 | Operational Visibility | ELT Pipeline + Dashboard | ✅ Complete |
| 002 | Dynamic Pricing | ML API + Consumer App | ✅ Complete |
| 003 | Conversational Analytics | AI-Powered Chat | ✅ Complete |
| 004 | Fleet Optimization | Demand Forecasting | ✅ Complete |
| 005 | Revenue Protection | Anomaly Detection | ✅ Complete |

---

## Case 001: Operational Visibility & Data Foundation

### The Situation

| Aspect | Details |
|--------|---------|
| **Context** | Management relies on monthly CSV dumps for fleet performance analysis |
| **Pain Point** | 30-day lag between operations and reporting; data contains errors |
| **Impact** | VP of Ops cannot make tactical decisions in time — estimated **15% loss in revenue efficiency** |

### The Solution

**Technical Deliverable:** Automated ELT Data Pipeline (Rust + Dagster + dbt) + Executive Dashboard (Streamlit)

**User Story:**
> "As the VP of Operations, I want to see yesterday's revenue and trip volume by Borough, so that I can adjust fleet distribution for the rest of the week."

### Success Metrics

| Type | Metric | Target | Achieved |
|------|--------|--------|----------|
| Business | Pipeline Automation | Manual → Automated | ✅ Yes |
| Technical | Data Quality Tests | 100% pass rate | ✅ Yes |

### Artifacts

- `dm_daily_revenue` data mart
- Streamlit Admin Dashboard
- MetroAnalyst (conversational queries)

---

## Case 002: Dynamic Price Estimation

### The Situation

| Aspect | Details |
|--------|---------|
| **Context** | Metrofleet taxis run on meters; passengers don't know final price until trip ends |
| **Pain Point** | Competitors (Uber/Lyft) offer upfront pricing |
| **Impact** | **30% of potential customers** abandon taxi queue due to "Meter Anxiety" |

### The Solution

**Technical Deliverable:** Machine Learning API + Consumer Web Application (MetroHail)

**Feature Engineering:**

- Weather data (rain/snow impact on traffic)
- Holiday calendar (demand surge patterns)
- Time-of-day and day-of-week features

**User Story:**
> "As a Passenger, I want to visually select my route on a map and get an instant quote."

### Success Metrics

| Type | Metric | Target | Achieved |
|------|--------|--------|----------|
| Technical | Model MAE | <$2.50 | ✅ Yes |
| Technical | API Latency (p95) | <200ms | ✅ Yes |
| Business | Quote Abandonment | <25% | 🔄 Measuring |

### Artifacts

- MetroHail Web App (`apps/web`)
- TypeScript SDK (`@metrofleet/sdk`)
- FastAPI Prediction Service (`apps/api_gateway`)
- Trip History with Drizzle ORM

---

## Case 003: Conversational Analytics & Rapid Insight

### The Situation

| Aspect | Details |
|--------|---------|
| **Context** | Analysts need faster ways to ask ad-hoc queries |
| **Pain Point** | SQL requires domain knowledge; analyst queues increase time-to-insight |
| **Impact** | Operational decisions delayed by hours/days |

### The Solution

**Technical Deliverable:** MetroAnalyst — chat-driven interface translating natural language to SQL

**Safety Controls:**

- Read-only SQL execution
- Blocked destructive keywords
- Result row limits (50 max)

**User Story:**
> "As an Operations Analyst, I want to ask natural language questions about revenue and trip patterns and receive immediate, verifiable results."

### Success Metrics

| Type | Metric | Target | Status |
|------|--------|--------|--------|
| Business | Query turnaround | 2 hours → <15 min | ✅ Achieved |
| Adoption | Weekly active users | 60% of Ops team | 🔄 Measuring |

### Artifacts

- MetroAnalyst App (`apps/analyst`)
- Read-only SQL tool
- Streaming chat UI

---

## Case 004: Fleet Optimization (In Progress)

### The Situation

| Aspect | Details |
|--------|---------|
| **Context** | Drivers spend significant time idle between fares |
| **Pain Point** | No visibility into future demand patterns |
| **Impact** | Fleet utilization at 60% vs. 70%+ target |

### The Solution

**Technical Deliverable:** Prophet time-series forecasting integrated into Admin Dashboard

**User Story:**
> "As a Fleet Manager, I want to see predicted demand by zone for the next 24 hours, so I can pre-position drivers."

### Success Metrics

| Type | Metric | Target | Status |
|------|--------|--------|--------|
| Business | Fleet Utilization | 70% | ✅ Achieved |
| Technical | Forecast Accuracy | MAPE <15% | ✅ Achieved |

### Artifacts

- Prophet forecasting model
- Dashboard heatmap visualization

---

## Case 005: Revenue Protection

### The Situation

| Aspect | Details |
|--------|---------|
| **Context** | We process thousands of trips daily with complex surcharges |
| **Pain Point** | No automated way to detect meter fraud or outliers |
| **Impact** | Potential revenue leakage and compliance risks |

### The Solution

**Technical Deliverable:** Automated "Watchdog" job using Isolation Forest (Unsupervised Learning)

**User Story:**
> "As a Compliance Officer, I want to review flagged trips where the price/distance ratio is suspicious."

### Success Metrics

| Type | Metric | Target | Status |
|------|--------|--------|--------|
| Business | Fraud Detection | Auto-flag outliers | ✅ Achieved |
| Technical | False Positive Rate | < 2% | 🔄 Tuning |

### Artifacts

- `compliance_flags` table
- Anomaly Detection Pipeline

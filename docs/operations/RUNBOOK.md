# Operational Runbook

## Overview

This document provides operational procedures for maintaining the Metrofleet platform.

---

## 1. Data Backfilling

### Loading Historical Data

To load historical TLC data (e.g., all of 2025):

1. Navigate to **Dagster UI** → <http://localhost:3000>
2. Go to **Assets** → `raw_taxi_file`
3. Click **Partitions**
4. Shift-click to select date range (e.g., `2025-01` through `2025-12`)
5. Click **Materialize Selected**

### Weather Data Backfill

Weather data is partitioned monthly to align with taxi data:

1. Go to **Assets** → `raw_weather`
2. Select matching partitions
3. **Materialize Selected**

---

## 2. Database Management

### Connection Details

| Parameter | Value |
|-----------|-------|
| Host | `localhost` (or `warehouse` from containers) |
| Port | `5432` |
| User | `admin` |
| Password | `password` |
| Database | `metrofleet` |

### Reset Database

> **⚠️ WARNING:** This will destroy all data!

```bash
docker compose down -v
docker compose up -d
```

### Database Backup

```bash
docker exec metrofleet_warehouse pg_dump -U admin metrofleet > backup.sql
```

### Database Restore

```bash
cat backup.sql | docker exec -i metrofleet_warehouse psql -U admin metrofleet
```

---

## 3. Machine Learning Operations

### Retraining the Model

The model does not auto-retrain on a schedule. To force a retrain:

1. Go to **Dagster UI** (<http://localhost:3000>)
2. Find asset `price_model_training`
3. Click **Materialize**
4. Monitor the run until completion (green status)

**Output:** `data/models/price_model_prod.pkl`

### Restarting the API After Retraining

The API loads the model **only on startup**. After retraining:

```bash
docker compose restart api
```

### Viewing Experiments

- **MLflow UI:** <http://localhost:5000>
- Compare MAE scores across training runs
- View feature importance and hyperparameters

---

## 4. MetroAnalyst Operations

### Local Development

```bash
cd workspaces/typescript/apps/analyst
DATABASE_URL=postgres://admin:password@localhost:5432/metrofleet bun dev --port 3002
```

### Container Deployment

```bash
docker compose up -d analyst
# Available at http://localhost:3002
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Postgres connection string |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | API key for Gemini |
| `POSTGRES_HOST` | ❌ | Alternative: host for warehouse |
| `POSTGRES_USER` | ❌ | Alternative: DB username |
| `POSTGRES_PASSWORD` | ❌ | Alternative: DB password |
| `POSTGRES_DB` | ❌ | Alternative: DB name |

### Troubleshooting

| Issue | Solution |
|-------|----------|
| DB Connection errors | Verify `DATABASE_URL` and Postgres is running |
| Model/API errors | Check AI provider credentials and quotas |
| Query rejections | SQL contains blocked keywords (INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE) |
| Large result warnings | Results truncated to 50 rows (by design) |

---

## 5. Service Management

### Start Full Stack

```bash
docker compose up -d
# or
make infra-up
```

### Stop All Services

```bash
docker compose down
# or
make infra-down
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f orchestrator
docker compose logs -f api
docker compose logs -f analyst
```

### Restart Individual Services

```bash
docker compose restart <service-name>
# Examples: warehouse, orchestrator, dashboard, api, web, analyst, mlflow, notebook
```

---

## 6. Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Dagster shows no assets | Workspace not loaded | Check `PYTHONPATH` and restart orchestrator |
| Model returns 503 | Model file missing | Run `price_model_training` asset |
| dbt tests failing | Data quality issues | Check `raw_yellow_trips` for negative fares/distances |
| Slow ingestion | Large partition | Expected for multi-GB files; be patient |
| Port conflicts | Service already running | Stop conflicting process or change ports in `docker-compose.yml` |

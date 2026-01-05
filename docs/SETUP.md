# Local Development Setup

## Prerequisites

| Tool | Required | Purpose |
|------|----------|---------|
| Docker Desktop | ✅ | Container runtime (or Docker Engine + Compose) |
| Git | ✅ | Version control |
| Rust Toolchain | ❌ | Optional for local CLI development |
| Python 3.11+ | ❌ | Optional for local script development |
| Node.js 20+ | ❌ | Optional for local TypeScript development |
| Bun | ❌ | Optional for faster TypeScript builds |

---

## Quick Start (Docker)

The entire platform runs in Docker containers. This is the **recommended** way to run the stack.

### 1. Clone the Repository

```bash
git clone https://github.com/a-marzoug/metrofleet.git
cd metrofleet
```

### 2. Environment Variables

The project defaults to development values in `docker-compose.yml`. Copy the example `.env` file:

```bash
cp .env.example .env
```

Or set manually:

```bash
export POSTGRES_USER=admin
export POSTGRES_PASSWORD=password
export POSTGRES_DB=metrofleet
export GOOGLE_GENERATIVE_AI_API_KEY=your-key-here  # For MetroAnalyst
export METROHAIL_DB_URI=your-neondb-connection-string  # For trip history
```

### 3. Build and Run

```bash
# Full stack
docker compose up -d --build

# Or use Make
make infra-up
```

> **Note:** First build may take several minutes as it compiles the Rust CLI inside the container.

### 4. Access the Services

| Service | URL | Description |
|---------|-----|-------------|
| Dagster UI | <http://localhost:3000> | Data pipeline orchestration |
| Streamlit Dashboard | <http://localhost:8501> | Admin analytics dashboard |
| MetroHail | <http://localhost:3001> | Consumer fare prediction app |
| MetroAnalyst | <http://localhost:3002> | Conversational analytics |
| Prediction API | <http://localhost:8000/docs> | ML model API (Swagger) |
| MLflow UI | <http://localhost:5000> | Experiment tracking |
| JupyterLab | <http://localhost:8888> | Data science notebooks |
| PostgreSQL | localhost:5432 | Data warehouse |

---

## Data Ingestion (First Run)

The database is empty on startup. To populate it:

1. Go to **Dagster UI** (<http://localhost:3000>)
2. Navigate to **Assets**
3. Select `raw_taxi_file` and click **Materialize**
   - Use the Partitions tab to select a specific month (e.g., `2024-01`)
4. Wait for the pipeline to complete (green status)
5. Refresh the Streamlit Dashboard to see data

---

## Running Services Individually

### Start Specific Services

```bash
# Just the data warehouse
docker compose up -d warehouse

# Data pipeline only
docker compose up -d warehouse orchestrator

# Consumer app stack
docker compose up -d warehouse api web

# Analytics stack
docker compose up -d warehouse analyst dashboard
```

### Local Development (Without Docker)

#### Python (Dagster/dbt)

```bash
cd workspaces/python
uv sync
uv run dagster dev -w workspace.yaml
```

#### TypeScript (Web Apps)

```bash
cd workspaces/typescript
bun install
cd apps/web && bun dev
```

#### Rust (CLI)

```bash
cd workspaces/rust
cargo build --release
cargo run -- --help
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change ports in `docker-compose.yml` or stop conflicting services |
| Rust compilation fails | Ensure Docker has sufficient memory (4GB+) |
| DB connection errors | Verify `POSTGRES_*` env vars and that warehouse container is running |
| Model not found | Run the `price_model_training` asset in Dagster first |
| MetroAnalyst errors | Check `GOOGLE_GENERATIVE_AI_API_KEY` is set |

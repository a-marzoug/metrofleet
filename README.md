<p align="center">
  <img src="assets/logo.svg" alt="Metrofleet Logo" width="200">
</p>

<h1 align="center">Metrofleet</h1>

**A modern data platform for taxi fleet operations, fare prediction, and conversational analytics.**

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg?logo=python)](https://python.org)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg?logo=rust)](https://rust-lang.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?logo=typescript)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker)](https://docker.com)
[![Dagster](https://img.shields.io/badge/Dagster-Orchestration-4F43DD.svg?logo=dagster)](https://dagster.io)
[![dbt](https://img.shields.io/badge/dbt-Transformations-FF694B.svg?logo=dbt)](https://getdbt.com)
[![MLflow](https://img.shields.io/badge/MLflow-Tracking-0194E2.svg?logo=mlflow)](https://mlflow.org)

---

## Disclaimer

> **📌 This is a portfolio project with a fictional business scenario.**

### Why Product-Like Projects?

I believe the best way to learn and demonstrate engineering skills is to build **end-to-end, product-like projects** rather than isolated tutorials or notebooks. This project was created to explore modern technologies in a realistic context.

#### ✅ Pros of This Approach

- **Integration challenges**: Real systems require connecting multiple languages (Rust, Python, TypeScript), tools, and services—something you don't experience in single-layer projects
- **Product thinking**: Forces you to consider UX, error handling, configuration, and deployment—not just algorithms
- **Realistic complexity**: Deals with the "messy middle" of engineering: Docker configs, environment variables, service communication
- **Demonstrable skills**: Shows employers you can build complete systems, not just run notebooks

#### ⚠️ Cons of This Approach

- **Time investment**: Takes significantly longer than focused tutorials
- **Breadth vs. depth**: Covers many technologies at a functional level rather than mastering one deeply
- **Maintenance burden**: More components means more things that can break or become outdated

### Technologies Explored

This project was specifically designed to test and learn:

| Technology | Why I Wanted to Learn It |
|------------|--------------------------|
| **Dagster** | Asset-based orchestration vs. traditional DAGs |
| **dbt** | SQL-first transformations with testing and documentation |
| **MLflow 3.x** | Modern experiment tracking and model registry |
| **Vercel AI SDK** | Streaming AI responses with tool calling |
| **Drizzle ORM** | Lightweight TypeScript ORM alternative to Prisma |
| **Rust for Data** | High-performance data ingestion patterns |

### The Scenario

The "Metrofleet" company and its business problems are **entirely fictional**. The data comes from the real NYC Taxi & Limousine Commission (TLC) public dataset, but all business context, stakeholders, and KPIs are simulated for learning purposes.

---

## Overview

Metrofleet is a full-stack data platform that transforms taxi fleet operations through:

- **📊 Real-time Analytics** — Daily revenue dashboards replacing 30-day reporting lag
- **💰 Guaranteed Pricing** — ML-powered fare predictions with weather/holiday enrichment
- **💬 AI Analyst** — Natural language queries against your data warehouse
- **📈 Demand Forecasting** — Time-series predictions for fleet optimization

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/a-marzoug/metrofleet.git
cd metrofleet

# Start all services
docker-compose up -d --build

# Or use Make
make infra-up
```

**Access the services:**

| Service | URL | Description |
|---------|-----|-------------|
| 🎯 Dagster | <http://localhost:3000> | Data pipeline orchestration |
| 📊 Dashboard | <http://localhost:8501> | Admin analytics (Streamlit) |
| 🚕 MetroHail | <http://localhost:3001> | Consumer fare prediction app |
| 💬 MetroAnalyst | <http://localhost:3002> | AI-powered analytics chat |
| 🔮 Prediction API | <http://localhost:8000/docs> | ML model endpoint (Swagger) |
| 🧪 MLflow | <http://localhost:5000> | Experiment tracking |
| 📓 JupyterLab | <http://localhost:8888> | Data science notebooks |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         METROFLEET PLATFORM                         │
├─────────────────────────────────────────────────────────────────────┤
│  INGESTION          WAREHOUSE           ML                APPS      │
│  ┌─────────┐        ┌─────────┐        ┌─────────┐      ┌─────────┐ │
│  │Rust CLI │───────▶│Postgres │───────▶│XGBoost  │─────▶│MetroHail│ │
│  │(TLC)    │        │  +dbt   │        │+Prophet │      │   App   │ │
│  └─────────┘        └─────────┘        └─────────┘      └─────────┘ │
│  ┌─────────┐              │                             ┌─────────┐ │
│  │Weather  │──────────────┘                             │Analyst  │ │
│  │+Holidays│                                            │  Chat   │ │
│  └─────────┘                                            └─────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│  Dagster (Orchestration) │ MLflow (Experiments) │ Docker (Infra)    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
metrofleet/
├── workspaces/
│   ├── python/                 # Data engineering & ML
│   │   ├── pipelines/          # Dagster assets + dbt
│   │   ├── apps/               # Streamlit dashboard, FastAPI
│   │   └── analytics/          # Jupyter notebooks
│   ├── rust/                   # High-performance data ingestion
│   │   └── tlc-cli/            # NYC TLC data loader
│   └── typescript/             # Frontend applications
│       ├── apps/web/           # MetroHail (consumer app)
│       ├── apps/analyst/       # MetroAnalyst (AI chat)
│       └── packages/sdk/       # @metrofleet/sdk
├── infra/docker/               # Dockerfiles
├── data/                       # Models, artifacts
├── docs/                       # Documentation
└── docker-compose.yml          # Full stack orchestration
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Ingestion** | Rust (tlc-cli), Python (httpx) |
| **Orchestration** | Dagster |
| **Warehouse** | PostgreSQL 15 |
| **Transformation** | dbt |
| **ML Training** | XGBoost, Prophet, Polars |
| **ML Tracking** | MLflow 3.x |
| **API** | FastAPI |
| **Frontend** | Next.js 15, React, Tailwind, Shadcn |
| **SDK** | TypeScript (@metrofleet/sdk) |
| **AI** | Vercel AI SDK, Google Gemini |
| **Maps** | Leaflet, OpenStreetMap |
| **ORM** | Drizzle (NeonDB) |

---

## Documentation

📚 **[Full Documentation](docs/README.md)**

| Document | Description |
|----------|-------------|
| [Setup Guide](docs/SETUP.md) | Local development environment |
| [Architecture](docs/technical/ARCHITECTURE.md) | System design and data flow |
| [API Specs](docs/technical/API_SPECS.md) | Endpoint documentation |
| [Data Dictionary](docs/technical/DATA_DICTIONARY.md) | Schema definitions |
| [Runbook](docs/operations/RUNBOOK.md) | Operational procedures |
| [Roadmap](docs/ROADMAP.md) | Project phases and status |

---

## Development

```bash
# Python development
cd workspaces/python && uv sync
make dagster-local

# TypeScript development
cd workspaces/typescript && bun install
cd apps/web && bun dev

# Rust development
cd workspaces/rust && cargo build --release

# Run all tests
make rust-test
make py-fmt
```

See `make help` for all available commands.

---

## License

MIT License — See [LICENSE](LICENSE) for details.

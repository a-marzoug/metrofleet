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

MetroFleet is a full-stack, AI-powered platform for modernizing NYC Taxi operations.

### 🚀 Key Features

1. **Smart Pricing:** Machine Learning (XGBoost) fare estimation enriched with Live Weather & Holiday data.
2. **Fleet Intelligence:** Hourly demand forecasting (Prophet) to optimize driver positioning.
3. **Consumer App:** A Next.js 15 Web App with interactive maps and instant quotes.
4. **AI Analyst:** A Generative UI Chatbot that lets Ops ask questions like *"Show me revenue trends for rainy days."*
5. **Robust Data Ops:** Automated Rust/Python pipelines managed by Dagster & dbt.

### 🛠 Tech Stack

- **Data Engineering:** Rust (CLI), Python (Polars), Dagster, dbt, Postgres.
- **Data Science:** XGBoost, Prophet, Isolation Forest, MLflow 3.
- **Application:** Next.js 15 (App Router), Tailwind, Shadcn UI, FastAPI.
- **AI:** Vercel AI SDK, Google Gemini 1.5 Flash.

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

## Documentation

| Document | Description |
|----------|-------------|
| [Roadmap](docs/ROADMAP.md) | Project phases and status |
| [Architecture](docs/technical/ARCHITECTURE.md) | System design and data flow |
| [Data Dictionary](docs/technical/DATA_DICTIONARY.md) | Schema definitions |
| [Decision Log](docs/technical/DECISION_LOG.md) | Architecture Decision Records (ADR) |
| [Use Cases](docs/business/USE_CASES.md) | Business problems and solutions |

## License

MIT License — See [LICENSE](LICENSE) for details.

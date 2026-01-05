# Architecture Decision Records (ADR)

## ADR-001: Hybrid Rust/Python Pipeline

* **Status:** Accepted
* **Date:** 2025-12-01
* **Context:** We process large Parquet files (GBs). Python's Pandas is memory-intensive for raw ingestion.
* **Decision:** Use **Rust** for the network I/O and parsing. Use **Python (Dagster)** for orchestration.
* **Consequences:** faster ingestion, type safety during parsing, complex build process (multi-stage Docker).

## ADR-002: Monorepo Structure

* **Status:** Accepted
* **Date:** 2025-12-01
* **Context:** The project spans Data Eng, Data Science, and Frontend.
* **Decision:** Single Repo with `workspaces/python`, `workspaces/rust`, `workspaces/typescript`.
* **Consequences:** Simplified dependency management; CI/CD runs on one repo.

## ADR-003: "Delete-Write" Ingestion Pattern

* **Status:** Accepted
* **Date:** 2025-12-02
* **Context:** Pipeline re-runs must be idempotent.
* **Decision:** Use Transactional Delete on the Partition Key (Month) before Insert.
* **Consequences:** Ensures consistency; prevents duplicate data without complex UPSERT logic.

## ADR-004: Tool Selection (Modern Data Stack)

* **Status:** Accepted
* **Date:** 2025-12-03
* **Decision:**
  * **Orchestration:** Dagster (Asset-based lineage).
  * **Transformation:** dbt (SQL-based logic).
  * **Visualization:** Streamlit (Python-native speed).
  * **Package Management:** `uv` (Performance).

## ADR-005: MLflow 3 & Gunicorn

* **Status:** Accepted
* **Date:** 2025-12-04
* **Context:** MLflow's development server blocks external container requests (Host Header 403 error).
* **Decision:** Run MLflow behind **Gunicorn** in the container and explicitly bind to `0.0.0.0`.
* **Consequences:** Requires a custom Dockerfile for MLflow but ensures production-grade security and connectivity.

## ADR-006: FastAPI for Model Serving

* **Status:** Accepted
* **Date:** 2025-12-05
* **Context:** Next.js (Node.js) cannot natively load Python `.pkl` files, and ONNX conversion proved unstable for specific XGBoost versions.
* **Decision:** Wrap the Python model in a **FastAPI** microservice.
* **Consequences:** Increases infrastructure footprint (one extra container) but guarantees 100% parity between training and inference logic using Python libraries.

## ADR-007: External Data Enrichment strategy

* **Status:** Accepted
* **Date:** 2025-12-10
* **Context:** Basic Price Prediction models based solely on distance/time fail to account for environmental factors (Rain/Snow) which significantly impact traffic and pricing.
* **Decision:** Ingest **Open-Meteo** (Weather) and **Python Holidays** data.
* **Implementation:**
  * Weather is **Partitioned** (Monthly) to align with Taxi Data backfills.
  * Holidays are **Full Refresh** (Reference Data).
* **Consequences:** significantly improves model robustness but adds an external API dependency to the ingestion pipeline.

## ADR-008: TypeScript SDK for API Communication

* **Status:** Accepted
* **Date:** 2025-12-13
* **Context:** The Next.js frontend needs to communicate with the FastAPI backend. Writing raw `fetch` calls inside React components leads to code duplication, lack of type safety, and scattered error handling.
* **Decision:** Create a dedicated **TypeScript SDK** (Service Layer) that abstracts the HTTP logic.
* **Consequences:**
  * **Pros:** Centralized API logic, strict typing (interfaces shared between Frontend/SDK), easier testing/mocking.
  * **Cons:** One extra layer of abstraction to maintain.

## ADR-009: SDK Build Configuration for Monorepo Consumption

* **Status:** Accepted
* **Date:** 2025-12-17
* **Context:** The `@metrofleet/sdk` package needed to be consumable by the Next.js web app within the monorepo.
* **Decision:** Configure SDK with `tsc` build script, emit declarations to `dist/`, and use `workspace:*` protocol in package.json.
* **Consequences:** Enables type-safe imports; requires SDK build before web app build.

## ADR-010: Frontend Tech Stack (Next.js & Shadcn)

* **Status:** Accepted
* **Date:** 2025-12-17
* **Context:** We need a modern, responsive UI that can be easily extended.
* **Decision:** Use **Next.js (App Router)** for the framework and **Shadcn UI** for components.
* **Consequences:**
  * **Pros:** Shadcn provides accessible, unstyled components that we fully own (code copy) rather than a heavy library dependency. Tailwind integration speeds up styling.
  * **Cons:** Requires more setup boilerplate than a pre-built library like Bootstrap.

## ADR-011: Map Visualization (Leaflet vs Google Maps)

* **Status:** Accepted
* **Date:** 2025-12-17
* **Context:** The app requires geospatial visualization of Pickup/Dropoff zones.
* **Decision:** Use **Leaflet.js** with OpenStreetMap tiles.
* **Consequences:**
  * **Pros:** Free, open-source, no API keys required for development.
  * **Cons:** Less detailed POI data than Google Maps; requires Client-Side Rendering (CSR) hacks in Next.js.

## ADR-012: Backend-for-Frontend (BFF) Pattern

* **Status:** Accepted
* **Date:** 2025-12-17
* **Context:** The frontend needs to save trip history to a transactional database *and* get predictions from the Python ML service. Calling the Python API directly from the browser exposes internal endpoints and complicates CORS.
* **Decision:** Use **Next.js API Routes** (`/api/predict`) as a BFF layer.
* **Consequences:**
  * **Security:** API keys and internal URLs are hidden from the client.
  * **Logic:** We can combine "Get Prediction" and "Save to DB" into a single server-side flow.
  * **Latency:** Adds a small hop (Browser -> Next.js -> FastAPI), but negligible for this use case.

## ADR-013: Drizzle ORM & NeonDB for Trip History Persistence

* **Status:** Accepted
* **Date:** 2025-12-17
* **Context:** We need a lightweight, type-safe way to persist user trip history in a Postgres-compatible database (NeonDB).
* **Decision:** Use **Drizzle ORM**.
* **Consequences:**
  * **Pros:** Extremely lightweight (compared to Prisma), zero-runtime overhead, and excellent TypeScript inference.
  * **Cons:** Migration management requires manual SQL understanding (which is a pro for us).

## ADR-014: LLM-Driven Analytics with Read-Only SQL Tool

* **Status:** Accepted
* **Date:** 2025-12-20
* **Context:** Analysts need an easy interface to pose natural-language queries against the warehouse. Exposing SQL execution to an LLM presents safety and resource concerns.
* **Decision:** Introduce **MetroAnalyst** with a server-side chat route that exposes a **read-only SQL tool** to the model. The tool enforces a blacklist of destructive SQL keywords and truncates results to a safe row limit.
* **Consequences:**
  * **Pros:** Enables rapid, ad-hoc analysis for non-technical stakeholders with minimal operational burden.
  * **Cons:** Requires operational monitoring (query patterns, rate limiting) and careful handling of LLM behavior; must document and enforce safety checks.

## ADR-015: AI Provider & Model Selection (Preview)

* **Status:** Accepted (Prototype)
* **Date:** 2025-12-20
* **Context:** The team evaluated available LLM providers and required a model capable of tool-use with streaming responses.
* **Decision:** Use the `@ai-sdk/google` provider (e.g., `google('gemini-3-flash-preview')`) for the prototype, exposing model calls via `app/api/chat/route.ts`.
* **Consequences:**
  * **Pros:** Model supports streaming and tooling integration, enabling fluid UX and database tool execution.
  * **Cons:** Prototype uses a preview model; production deployment requires evaluation of cost, stability, and enterprise access (change the model/provider in code when moving to production).

## ADR-016: Time-Series Forecasting Strategy

* **Status:** Accepted
* **Date:** 2025-12-26
* **Context:** Operations needs to know where to position drivers *tomorrow*.
* **Decision:** Use **Meta Prophet** instead of ARIMA or Deep Learning (LSTM).
* **Reasoning:** Prophet natively handles multiple seasonality (daily/weekly) and Holiday effects, which are dominant factors in taxi demand. It is also robust to missing data.

## ADR-017: Unsupervised Anomaly Detection

* **Status:** Accepted
* **Date:** 2026-01-01
* **Context:** We need to find fraud, but we have no labeled dataset of "Confirmed Fraud".
* **Decision:** Use **Isolation Forest** (Unsupervised Learning).
* **Reasoning:** Instead of looking for known fraud patterns (Supervised), we look for statistical outliers in the multi-dimensional space of `Distance` vs `Fare` vs `Duration`.

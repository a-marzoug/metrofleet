# ==============================================================================
# METROFLEET MONOREPO MAKEFILE
# ==============================================================================

.PHONY: help infra-up infra-down infra-build infra-logs \
        rust-build rust-run rust-test rust-fmt \
        py-setup py-fmt dagster-local \
        dbt-debug dbt-run dbt-docs \
        ts-install ts-build ts-dev web-dev analyst-dev sdk-build \
        notebook \
        up-all down-all logs-all restart-all \
        clean

# ==============================================================================
# GLOBAL HELPERS
# ==============================================================================

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ==============================================================================
# INFRASTRUCTURE (Docker)
# ==============================================================================

infra-up: ## Start the full stack (Postgres + all services) in background
	docker-compose up -d

infra-down: ## Stop and remove containers
	docker-compose down

infra-build: ## Rebuild all containers (needed if dependencies change)
	docker-compose build

infra-logs: ## Tail logs from all services
	docker-compose logs -f

# ==============================================================================
# RUST (Data Ingestion CLI)
# ==============================================================================

rust-build: ## Build the CLI tool in release mode
	cd workspaces/rust && cargo build --release

rust-run: ## Run the CLI help command
	cd workspaces/rust && cargo run -- --help

rust-test: ## Run Rust unit tests
	cd workspaces/rust && cargo test

rust-fmt: ## Format Rust code
	cd workspaces/rust && cargo fmt

# ==============================================================================
# PYTHON & DATA ENGINEERING (Dagster + dbt + uv)
# ==============================================================================

py-setup: ## Install Python dependencies using uv
	cd workspaces/python && uv sync

py-fmt: ## Format Python code using ruff
	cd workspaces/python && uv run ruff format .

py-lint: ## Lint Python code using ruff
	cd workspaces/python && uv run ruff check .

dagster-local: ## Run Dagster locally (requires Postgres to be up via infra-up)
	cd workspaces/python && \
	export POSTGRES_HOST=localhost && \
	export POSTGRES_USER=admin && \
	export POSTGRES_PASSWORD=password && \
	export POSTGRES_DB=metrofleet && \
	uv run dagster dev -w workspace.yaml

# ==============================================================================
# DBT (Data Transformations)
# ==============================================================================

dbt-debug: ## Check dbt connection
	cd workspaces/python/pipelines/transformations && \
	uv run dbt debug --profiles-dir .

dbt-run: ## Run all dbt models
	cd workspaces/python/pipelines/transformations && \
	uv run dbt run --profiles-dir .

dbt-test: ## Run dbt tests
	cd workspaces/python/pipelines/transformations && \
	uv run dbt test --profiles-dir .

dbt-docs: ## Generate and serve dbt documentation
	cd workspaces/python/pipelines/transformations && \
	uv run dbt docs generate --profiles-dir . && \
	uv run dbt docs serve --profiles-dir .

# ==============================================================================
# TYPESCRIPT (Web Apps & SDK)
# ==============================================================================

ts-install: ## Install TypeScript dependencies using bun
	cd workspaces/typescript && bun install

ts-build: ## Build all TypeScript packages
	cd workspaces/typescript/packages/sdk && bun run build
	cd workspaces/typescript/apps/web && bun run build
	cd workspaces/typescript/apps/analyst && bun run build

sdk-build: ## Build the @metrofleet/sdk package
	cd workspaces/typescript/packages/sdk && bun run build

web-dev: ## Run MetroHail web app in development mode
	cd workspaces/typescript/apps/web && bun dev

analyst-dev: ## Run MetroAnalyst app in development mode
	cd workspaces/typescript/apps/analyst && bun dev --port 3002

ts-fmt: ## Format TypeScript code
	cd workspaces/typescript && bun run prettier --write .

ts-lint: ## Lint TypeScript code
	cd workspaces/typescript && bun run eslint .

# ==============================================================================
# NOTEBOOKS
# ==============================================================================

notebook: ## Start JupyterLab for data analysis
	docker-compose up -d notebook
	@echo "JupyterLab available at http://localhost:8888"

# ==============================================================================
# FULL STACK COMMANDS
# ==============================================================================

up-all: ## Start all services with build
	docker-compose up -d --build

down-all: ## Stop all services and remove volumes (WARNING: destroys data)
	docker-compose down -v

logs-all: ## Tail logs from all services
	docker-compose logs -f

restart-all: ## Restart all services
	docker-compose restart

restart-api: ## Restart the prediction API (after model retrain)
	docker-compose restart api

# ==============================================================================
# INDIVIDUAL SERVICE COMMANDS
# ==============================================================================

up-warehouse: ## Start only the database
	docker-compose up -d warehouse

up-pipeline: ## Start warehouse + orchestrator
	docker-compose up -d warehouse orchestrator

up-dashboard: ## Start warehouse + dashboard
	docker-compose up -d warehouse dashboard

up-api: ## Start the prediction API stack
	docker-compose up -d warehouse api

up-web: ## Start the consumer app stack
	docker-compose up -d warehouse api web

up-analyst: ## Start the analyst app stack
	docker-compose up -d warehouse analyst

up-mlflow: ## Start MLflow tracking server
	docker-compose up -d warehouse mlflow

# ==============================================================================
# MAINTENANCE
# ==============================================================================

clean: ## Clean up build artifacts and temporary files
	cd workspaces/rust && cargo clean
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".dbt" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".next" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true

clean-docker: ## Remove all Docker containers and volumes
	docker-compose down -v --rmi local
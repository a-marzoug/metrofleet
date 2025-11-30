# ==============================================================================
# METROFLEET MONOREPO MAKEFILE
# ==============================================================================

.PHONY: help infra-up infra-down infra-build rust-build rust-run rust-test py-setup py-fmt dagster-local dbt-debug dbt-run clean

# --- Global Helpers ---
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# --- Infrastructure (Docker) ---
infra-up: ## Start the full stack (Postgres + Dagster) in background
	docker-compose up -d

infra-down: ## Stop and remove containers
	docker-compose down

infra-build: ## Rebuild the Dagster/Python container (needed if dependencies change)
	docker-compose build

infra-logs: ## Tail logs from the orchestrator
	docker-compose logs -f orchestrator

# --- Rust (Data Ingestion CLI) ---
rust-build: ## Build the CLI tool in release mode
	cd workspaces/rust && cargo build --release

rust-run: ## Run the CLI help command
	cd workspaces/rust && cargo run -- --help

rust-test: ## Run Rust unit tests
	cd workspaces/rust && cargo test

rust-fmt: ## Format Rust code
	cd workspaces/rust && cargo fmt

# --- Python & Data Engineering (Dagster + dbt + uv) ---
py-setup: ## Install Python dependencies using uv
	cd workspaces/python && uv sync

py-fmt: ## Format Python code using ruff (if installed) or black
	cd workspaces/python && uv run ruff format .

dagster-local: ## Run Dagster locally (requires Postgres to be up via infra-up)
	cd workspaces/python && \
	export POSTGRES_HOST=localhost && \
	export POSTGRES_USER=admin && \
	export POSTGRES_PASSWORD=password && \
	export POSTGRES_DB=metrofleet && \
	uv run dagster dev -w workspace.yaml

# --- dbt (Data Transformations) ---
# Note: These commands assume you are running dbt locally against the Docker Postgres
dbt-debug: ## Check dbt connection
	cd workspaces/python/pipelines/transformations && \
	uv run dbt debug --profiles-dir .

dbt-run: ## Run all dbt models
	cd workspaces/python/pipelines/transformations && \
	uv run dbt run --profiles-dir .

dbt-docs: ## Generate and serve dbt documentation
	cd workspaces/python/pipelines/transformations && \
	uv run dbt docs generate --profiles-dir . && \
	uv run dbt docs serve --profiles-dir .

# --- Maintenance ---
clean: ## Clean up build artifacts and temporary files
	cd workspaces/rust && cargo clean
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	find . -type d -name ".dbt" -exec rm -rf {} +
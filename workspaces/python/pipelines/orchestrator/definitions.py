from dagster import Definitions, load_assets_from_modules, EnvVar
from .assets import ingestion
from .resources.database import PostgresResource

# Load assets
ingestion_assets = load_assets_from_modules([ingestion])

# Define the connection using Environment Variables
# EnvVar("VAR_NAME") tells Dagster to look for this in the system environment
database_resource = PostgresResource(
    host=EnvVar("POSTGRES_HOST"),
    port=5432,
    user=EnvVar("POSTGRES_USER"),
    password=EnvVar("POSTGRES_PASSWORD"),
    database=EnvVar("POSTGRES_DB"),
)

defs = Definitions(
    assets=[*ingestion_assets],
    resources={
        "database": database_resource,
    },
)

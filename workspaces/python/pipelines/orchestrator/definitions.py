import os

from dagster import Definitions, EnvVar, load_assets_from_modules
from dagster_dbt import DbtCliResource

from .assets import compliance, dbt, forcasting, holidays, ingestion, training, weather
from .resources.database import PostgresResource

# Load assets
ingestion_assets = load_assets_from_modules([ingestion])
dbt_assets = load_assets_from_modules([dbt], group_name='transformation')
training_assets = load_assets_from_modules([training])
holidays_assets = load_assets_from_modules([holidays])
weather_assets = load_assets_from_modules([weather])
forcasting_assets = load_assets_from_modules([forcasting])
compliance_assets = load_assets_from_modules([compliance])

# Define the connection using Environment Variables
# EnvVar("VAR_NAME") tells Dagster to look for this in the system environment
database_resource = PostgresResource(
    host=EnvVar('POSTGRES_HOST'),
    port=5432,
    user=EnvVar('POSTGRES_USER'),
    password=EnvVar('POSTGRES_PASSWORD'),
    database=EnvVar('POSTGRES_DB'),
)


defs = Definitions(
    assets=[
        *ingestion_assets,
        *dbt_assets,
        *training_assets,
        *holidays_assets,
        *weather_assets,
        *forcasting_assets,
        *compliance_assets,
    ],
    resources={
        'database': database_resource,
        'dbt': DbtCliResource(
            project_dir=os.getenv(
                'DBT_PROJECT_DIR',
                '/opt/dagster/app/workspaces/python/pipelines/transformations',
            ),
            profiles_dir=os.getenv(
                'DBT_PROJECT_DIR',
                '/opt/dagster/app/workspaces/python/pipelines/transformations',
            ),
        ),
    },
)

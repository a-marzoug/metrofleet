import os

from dagster import AssetExecutionContext, AssetKey
from dagster_dbt import (
    DagsterDbtTranslator,
    DagsterDbtTranslatorSettings,
    DbtCliResource,
    dbt_assets,
)

DBT_PROJECT_DIR = os.getenv(
    'DBT_PROJECT_DIR', '/opt/dagster/app/workspaces/python/pipelines/transformations'
)

# 1. Define the specific target path variable
DBT_TARGET_DIR = os.getenv('DBT_TARGET_PATH', '/tmp/dbt_target')
os.environ['DBT_TARGET_PATH'] = DBT_TARGET_DIR
os.environ['DBT_LOG_PATH'] = os.getenv('DBT_LOG_PATH', '/tmp/dbt_logs')

# 2. Define the path where the manifest WILL be
MANIFEST_PATH = os.path.join(DBT_TARGET_DIR, 'manifest.json')

# If the manifest doesn't exist in /tmp, generate it there
if not os.path.exists(MANIFEST_PATH):
    from dbt.cli.main import dbtRunner

    dbtRunner().invoke(
        ['parse', '--project-dir', DBT_PROJECT_DIR, '--profiles-dir', DBT_PROJECT_DIR]
    )


class MetrofleetDbtTranslator(DagsterDbtTranslator):
    def get_asset_key(self, dbt_resource_props):
        """
        Custom logic to map dbt nodes to Dagster Asset Keys.
        """
        node_type = dbt_resource_props['resource_type']
        name = dbt_resource_props['name']

        if node_type == 'source':
            # --- 1. Weather & Holidays Mapping (New) ---
            # In dbt sources.yml, the table is named "raw_weather"
            # In weather.py, the function is named "raw_weather_data"
            if name == 'raw_weather':
                return AssetKey('raw_weather_data')

            # In dbt sources.yml, the table is named "raw_holidays"
            # In holidays.py, the function is named "raw_holidays_data"
            if name == 'raw_holidays':
                return AssetKey('raw_holidays_data')

            # --- 2. Existing Taxi Logic (Keep as fallback) ---
            # Matches 'raw_yellow_trips' -> AssetKey(['public', 'raw_yellow_trips'])
            return AssetKey(['public', name])

        # 3. Map dbt Models to Asset Keys
        return AssetKey(name)


@dbt_assets(
    # 3. Point Dagster to the /tmp location
    manifest=MANIFEST_PATH,
    dagster_dbt_translator=MetrofleetDbtTranslator(
        settings=DagsterDbtTranslatorSettings(enable_asset_checks=True)
    ),
)
def metrofleet_dbt_assets(context: AssetExecutionContext, dbt: DbtCliResource):
    yield from dbt.cli(
        ['build', '--profiles-dir', DBT_PROJECT_DIR], context=context
    ).stream()

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


class MetroFleetDbtTranslator(DagsterDbtTranslator):
    def get_asset_key(self, dbt_resource_props):
        """
        Custom logic to map dbt nodes to Dagster Asset Keys.
        """
        node_type = dbt_resource_props['resource_type']
        name = dbt_resource_props['name']

        # 1. Map dbt Sources to Upstream Assets
        if node_type == 'source':
            # If dbt says "source('staging', 'raw_yellow_trips')",
            # we tell Dagster to look for an asset named "raw_yellow_trips"
            # (If you used key_prefix=["public"] in ingestion, use AssetKey(["public", name]))
            return AssetKey(['public', name])

        # 2. Map dbt Models to Asset Keys (removes the project name prefix)
        return AssetKey(name)


@dbt_assets(
    # 3. Point Dagster to the /tmp location
    manifest=MANIFEST_PATH,
    dagster_dbt_translator=MetroFleetDbtTranslator(
        settings=DagsterDbtTranslatorSettings(enable_asset_checks=True)
    ),
)
def metrofleet_dbt_assets(context: AssetExecutionContext, dbt: DbtCliResource):
    yield from dbt.cli(
        ['build', '--profiles-dir', DBT_PROJECT_DIR], context=context
    ).stream()

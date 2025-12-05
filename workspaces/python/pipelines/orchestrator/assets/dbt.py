import os

from dagster import AssetExecutionContext
from dagster_dbt import (
    DagsterDbtTranslator,
    DagsterDbtTranslatorSettings,
    DbtCliResource,
    dbt_assets,
)
from dotenv import load_dotenv

load_dotenv()

# This path matches the internal structure of the container, but can be overridden
DBT_PROJECT_DIR = os.getenv(
    'DBT_PROJECT_DIR', '/opt/dagster/app/workspaces/python/pipelines/transformations'
)

# Fix PermissionError: The container runs as non-root 'dagster' user, but the volume mount
# might be owned by root or the host user. We set the target path to a writable location.
os.environ['DBT_TARGET_PATH'] = os.getenv('DBT_TARGET_PATH', '/tmp/dbt_target')

# If the manifest doesn't exist (fresh container), parse it on load
if not os.path.exists(os.path.join(DBT_PROJECT_DIR, 'target', 'manifest.json')):
    from dbt.cli.main import dbtRunner

    # We explicitly tell dbt to look for profiles.yml in the project dir
    dbtRunner().invoke(
        ['parse', '--project-dir', DBT_PROJECT_DIR, '--profiles-dir', DBT_PROJECT_DIR]
    )


@dbt_assets(
    manifest=os.path.join(DBT_PROJECT_DIR, 'target', 'manifest.json'),
    dagster_dbt_translator=DagsterDbtTranslator(
        settings=DagsterDbtTranslatorSettings(enable_asset_checks=True)
    ),
)
def metrofleet_dbt_assets(context: AssetExecutionContext, dbt: DbtCliResource):
    # When running dbt build, we also pass the profiles-dir flag
    yield from dbt.cli(
        ['build', '--profiles-dir', DBT_PROJECT_DIR], context=context
    ).stream()

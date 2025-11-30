from dagster import ConfigurableResource
from pydantic import Field


class PostgresResource(ConfigurableResource):
    """
    A resource that manages the connection details to the Postgres Warehouse.
    """

    host: str = Field(description="Database host (e.g., localhost or warehouse)")
    port: int = Field(default=5432, description="Database port")
    user: str = Field(description="Database username")
    password: str = Field(description="Database password")
    database: str = Field(description="Database name")

    def get_connection_string(self) -> str:
        """
        Returns a SQLAlchemy-style connection string:
        postgresql://user:password@host:port/database
        """
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"

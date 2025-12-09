"""Application configuration."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = 'Metrofleet API'
    version: str = 'v1'
    model_path: str = '/app/data/models/price_model_prod.pkl'
    min_fare: float = 2.50


settings = Settings()

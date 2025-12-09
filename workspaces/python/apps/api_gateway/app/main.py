"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1 import api_router
from app.core import settings
from app.models import model_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle."""
    model_manager.load_model('price_model', settings.model_path)
    yield
    model_manager.clear()


app = FastAPI(title=settings.app_name, version=settings.version, lifespan=lifespan)
app.include_router(api_router)

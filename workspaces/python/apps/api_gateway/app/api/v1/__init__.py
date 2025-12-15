"""API v1 routes."""

from fastapi import APIRouter, Depends

from app.core.security import get_api_key

from .health import router as health_router
from .prediction import router as prediction_router

api_router = APIRouter(dependencies=[Depends(get_api_key)])
api_router.include_router(health_router, tags=['health'])
api_router.include_router(prediction_router, prefix='/predict', tags=['predictions'])

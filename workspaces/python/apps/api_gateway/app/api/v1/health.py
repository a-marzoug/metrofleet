"""Health check endpoints."""

from fastapi import APIRouter

from app.models import model_manager

router = APIRouter()


@router.get('/health')
def health_check():
    """Check API health and model status."""
    return {'status': 'ok', 'model_loaded': model_manager.is_loaded('price_model')}

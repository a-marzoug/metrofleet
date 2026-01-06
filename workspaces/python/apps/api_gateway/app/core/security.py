from fastapi import HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader

from app.core.config import settings

api_key_header = APIKeyHeader(
    name='X-API-Key',
    scheme_name="API Key",
    description="API Key for authentication",
    auto_error=True
)


async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == settings.api_key:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail='Could not validate credentials'
    )

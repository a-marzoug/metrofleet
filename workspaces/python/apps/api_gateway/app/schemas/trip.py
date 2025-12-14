"""Trip-related schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,  # Auto-convert snake_to_camel for JSON
        populate_by_name=True,  # Allow constructing with snake_case inside Python
        from_attributes=True,  # Useful if loading from ORM objects
    )


class TripRequest(CamelModel):
    pickup_location_id: int = Field(..., description='TLC Zone ID (1-263)')
    dropoff_location_id: int = Field(..., description='TLC Zone ID (1-263)')
    pickup_datetime: datetime = Field(..., description='ISO 8601 Datetime')
    trip_distance: float = Field(..., description='Distance in miles')
    precip_mm: float = Field(0.0, description='Predicted precipitation (mm)')
    temp_c: float = Field(15.0, description='Predicted temperature (Celsius)')


class TripPrediction(CamelModel):
    estimated_fare: float = Field(..., description='Estimated fare')
    currency: str = Field('USD', description='Currency')
    model_version: str = Field('v2', description='Model version')

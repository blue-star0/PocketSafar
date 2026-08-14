"""Trip request/response schemas."""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import date, datetime


class TripStopRequest(BaseModel):
    name: str
    latitude: float
    longitude: float
    order: int = 0
    transport_mode: Literal["car", "train", "bus", "flight", "bike", "ship", "walk"] = "car"
    estimated_cost: Optional[float] = None
    notes: Optional[str] = None


class TripCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    start_date: date
    end_date: date
    budget: Optional[float] = None
    status: Optional[Literal["planned", "active", "completed"]] = "planned"
    stops: Optional[List[TripStopRequest]] = None
    notes: Optional[str] = None


class TripUpdateRequest(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    status: Optional[Literal["planned", "active", "completed"]] = None
    stops: Optional[List[TripStopRequest]] = None
    notes: Optional[str] = None


class TripResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    budget: Optional[float] = None
    status: str
    stops: List[dict] = []
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_trip(cls, trip) -> "TripResponse":
        return cls(
            id=str(trip.id),
            user_id=str(trip.user_id),
            title=trip.title,
            description=trip.description,
            start_date=trip.start_date,
            end_date=trip.end_date,
            budget=trip.budget,
            status=trip.status,
            stops=trip.stops,
            notes=trip.notes,
            created_at=trip.created_at,
            updated_at=trip.updated_at,
        )

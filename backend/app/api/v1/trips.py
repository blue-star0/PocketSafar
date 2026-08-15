"""Trip planner CRUD endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from beanie import PydanticObjectId
from datetime import datetime, timezone
from typing import List

from app.models.user import User
from app.models.trip import Trip
from app.schemas.trip import (
    TripCreateRequest,
    TripUpdateRequest,
    TripResponse,
    TripStopRequest,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("/", response_model=List[TripResponse])
async def list_trips(current_user: User = Depends(get_current_user)):
    """List all trips for the current user."""
    trips = await Trip.find({"user_id": current_user.id}).sort("-created_at").to_list()
    return [TripResponse.from_trip(t) for t in trips]


@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    data: TripCreateRequest,
    current_user: User = Depends(get_current_user),
):
    """Create a new trip."""
    trip = Trip(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        start_date=data.start_date,
        end_date=data.end_date,
        budget=data.budget,
        status=data.status or "planned",
        stops=[s.model_dump() for s in data.stops] if data.stops else [],
        notes=data.notes,
    )
    await trip.insert()
    return TripResponse.from_trip(trip)


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(
    trip_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
):
    """Get a specific trip."""
    trip = await Trip.get(trip_id)
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return TripResponse.from_trip(trip)


@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: PydanticObjectId,
    data: TripUpdateRequest,
    current_user: User = Depends(get_current_user),
):
    """Update a trip."""
    trip = await Trip.get(trip_id)
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    update_data = data.model_dump(exclude_unset=True)
    if "stops" in update_data and update_data["stops"] is not None:
        update_data["stops"] = [s if isinstance(s, dict) else s.model_dump() for s in update_data["stops"]]
    for field, value in update_data.items():
        setattr(trip, field, value)
    trip.updated_at = datetime.now(timezone.utc)
    await trip.save()
    return TripResponse.from_trip(trip)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(
    trip_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
):
    """Delete a trip."""
    trip = await Trip.get(trip_id)
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    await trip.delete()


@router.post("/{trip_id}/stops", response_model=TripResponse)
async def add_stop(
    trip_id: PydanticObjectId,
    stop: TripStopRequest,
    current_user: User = Depends(get_current_user),
):
    """Add a stop to a trip."""
    trip = await Trip.get(trip_id)
    if not trip or trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    stop_data = stop.model_dump()
    stop_data["order"] = len(trip.stops)
    trip.stops.append(stop_data)
    trip.updated_at = datetime.now(timezone.utc)
    await trip.save()
    return TripResponse.from_trip(trip)

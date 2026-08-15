"""Travel diary CRUD endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from beanie import PydanticObjectId
from datetime import datetime, timezone
from typing import List

from app.models.user import User
from app.models.diary import DiaryEntry
from app.schemas.diary import (
    DiaryCreateRequest,
    DiaryUpdateRequest,
    DiaryResponse,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/diary", tags=["diary"])


@router.get("/", response_model=List[DiaryResponse])
async def list_entries(current_user: User = Depends(get_current_user)):
    """List all diary entries for the current user."""
    entries = await DiaryEntry.find({"user_id": current_user.id}).sort("-entry_date").to_list()
    return [DiaryResponse.from_entry(e) for e in entries]


@router.post("/", response_model=DiaryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    data: DiaryCreateRequest,
    current_user: User = Depends(get_current_user),
):
    """Create a new diary entry."""
    entry = DiaryEntry(
        user_id=current_user.id,
        title=data.title,
        content=data.content,
        location_name=data.location_name,
        latitude=data.latitude,
        longitude=data.longitude,
        mood=data.mood,
        rating=data.rating,
        entry_date=data.entry_date,
        is_public=data.is_public or False,
    )
    await entry.insert()

    # Award points
    current_user.total_points += 50
    await current_user.save()

    return DiaryResponse.from_entry(entry)


@router.get("/{entry_id}", response_model=DiaryResponse)
async def get_entry(
    entry_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
):
    """Get a specific diary entry."""
    entry = await DiaryEntry.get(entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return DiaryResponse.from_entry(entry)


@router.put("/{entry_id}", response_model=DiaryResponse)
async def update_entry(
    entry_id: PydanticObjectId,
    data: DiaryUpdateRequest,
    current_user: User = Depends(get_current_user),
):
    """Update a diary entry."""
    entry = await DiaryEntry.get(entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
    entry.updated_at = datetime.now(timezone.utc)
    await entry.save()
    return DiaryResponse.from_entry(entry)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
):
    """Delete a diary entry."""
    entry = await DiaryEntry.get(entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    await entry.delete()

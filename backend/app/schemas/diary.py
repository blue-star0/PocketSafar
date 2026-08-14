"""Diary request/response schemas."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class DiaryCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = ""
    location_name: str = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    mood: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    entry_date: date
    is_public: Optional[bool] = False


class DiaryUpdateRequest(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    content: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    mood: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    entry_date: Optional[date] = None
    is_public: Optional[bool] = None


class DiaryPhotoResponse(BaseModel):
    storage_path: str
    url: str
    caption: Optional[str] = None
    order: int = 0


class DiaryResponse(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    mood: Optional[str] = None
    rating: Optional[int] = None
    photos: List[dict] = []
    entry_date: date
    is_public: bool
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entry(cls, entry) -> "DiaryResponse":
        return cls(
            id=str(entry.id),
            user_id=str(entry.user_id),
            title=entry.title,
            content=entry.content,
            location_name=entry.location_name,
            latitude=entry.latitude,
            longitude=entry.longitude,
            mood=entry.mood,
            rating=entry.rating,
            photos=entry.photos,
            entry_date=entry.entry_date,
            is_public=entry.is_public,
            created_at=entry.created_at,
            updated_at=entry.updated_at,
        )

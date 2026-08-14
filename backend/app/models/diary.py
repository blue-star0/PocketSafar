"""Diary entry document model."""

from beanie import Document, PydanticObjectId
from pydantic import Field
from typing import Optional, List
from datetime import datetime, date, timezone


class DiaryPhoto(dict):
    """Embedded photo schema for diary entries."""
    pass


class DiaryEntry(Document):
    """Travel diary entry document."""

    user_id: PydanticObjectId
    title: str
    content: str = ""
    location_name: str = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    mood: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    photos: List[dict] = Field(default_factory=list)
    entry_date: date = Field(default_factory=date.today)
    is_public: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "diary_entries"
        indexes = ["user_id", "entry_date"]

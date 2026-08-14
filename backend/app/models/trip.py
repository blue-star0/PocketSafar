"""Trip document model."""

from beanie import Document, PydanticObjectId
from pydantic import Field
from typing import Optional, List, Literal
from datetime import datetime, date, timezone


class Trip(Document):
    """Trip planning document."""

    user_id: PydanticObjectId
    title: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    budget: Optional[float] = None
    status: Literal["planned", "active", "completed"] = Field(default="planned")
    stops: List[dict] = Field(default_factory=list)
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "trips"
        indexes = ["user_id", "status"]

"""User document model."""

from beanie import Document
from pydantic import EmailStr, Field
from typing import Optional, List
from datetime import datetime, timezone


class User(Document):
    """User account document."""

    email: EmailStr
    username: str
    password_hash: Optional[str] = None
    name: str = ""
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    google_id: Optional[str] = None
    phone: Optional[str] = None
    total_points: int = Field(default=0)
    badges: List[str] = Field(default_factory=list)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        indexes = ["email", "username", "google_id"]

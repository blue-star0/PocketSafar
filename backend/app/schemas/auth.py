"""Auth request/response schemas."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=8, max_length=100)
    name: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    total_points: int = 0
    badges: List[str] = []
    created_at: datetime

    @classmethod
    def from_user(cls, user) -> "UserResponse":
        return cls(
            id=str(user.id),
            email=user.email,
            username=user.username,
            name=user.name,
            avatar_url=user.avatar_url,
            bio=user.bio,
            total_points=user.total_points,
            badges=user.badges,
            created_at=user.created_at,
        )


class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

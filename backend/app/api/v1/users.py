"""User profile endpoints."""

from fastapi import APIRouter, Depends
from datetime import datetime, timezone

from app.models.user import User
from app.schemas.auth import UserResponse, UserUpdateRequest
from app.api.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return UserResponse.from_user(current_user)


@router.put("/me", response_model=UserResponse)
async def update_profile(
    data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
):
    """Update current user's profile."""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    current_user.updated_at = datetime.now(timezone.utc)
    await current_user.save()
    return UserResponse.from_user(current_user)

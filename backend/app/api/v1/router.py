"""Central API v1 router — includes all sub-routers."""

from fastapi import APIRouter
from datetime import datetime, timezone

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.diary import router as diary_router
from app.api.v1.trips import router as trips_router

api_v1_router = APIRouter(prefix="/api/v1")


@api_v1_router.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(diary_router)
api_v1_router.include_router(trips_router)

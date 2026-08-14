"""MongoDB connection and Beanie ODM initialization."""

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import logging

from app.config import settings

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient | None = None


async def init_db() -> None:
    """Initialize MongoDB connection and Beanie ODM."""
    global client
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        db = client[settings.MONGODB_DB_NAME]

        # Import all Beanie Document models here
        from app.models.user import User
        from app.models.diary import DiaryEntry
        from app.models.trip import Trip

        await init_beanie(
            database=db,
            document_models=[User, DiaryEntry, Trip],
        )
        logger.info("MongoDB connected: %s", settings.MONGODB_DB_NAME)
    except Exception as exc:
        logger.error("MongoDB connection failed: %s", exc)
        raise


async def close_db() -> None:
    """Close MongoDB connection."""
    global client
    if client is not None:
        client.close()
        logger.info("MongoDB connection closed.")

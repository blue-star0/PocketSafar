"""Supabase Storage service for file uploads."""

import logging
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)

# Supabase client will be initialized when keys are configured
_supabase_client = None


def get_supabase_client():
    """Get or create Supabase client."""
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            logger.warning("Supabase not configured. File uploads disabled.")
            return None
        try:
            from supabase import create_client
            _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        except ImportError:
            logger.warning("supabase package not installed. Run: pip install supabase")
            return None
    return _supabase_client


async def upload_file(
    file_bytes: bytes,
    file_path: str,
    content_type: str = "image/jpeg",
) -> Optional[str]:
    """Upload a file to Supabase Storage and return the public URL."""
    client = get_supabase_client()
    if client is None:
        return None

    try:
        bucket = settings.SUPABASE_STORAGE_BUCKET
        client.storage.from_(bucket).upload(
            path=file_path,
            file=file_bytes,
            file_options={"content-type": content_type},
        )
        public_url = client.storage.from_(bucket).get_public_url(file_path)
        logger.info("File uploaded: %s", file_path)
        return public_url
    except Exception as exc:
        logger.error("Upload failed: %s", exc)
        return None


async def delete_file(file_path: str) -> bool:
    """Delete a file from Supabase Storage."""
    client = get_supabase_client()
    if client is None:
        return False

    try:
        bucket = settings.SUPABASE_STORAGE_BUCKET
        client.storage.from_(bucket).remove([file_path])
        logger.info("File deleted: %s", file_path)
        return True
    except Exception as exc:
        logger.error("Delete failed: %s", exc)
        return False

"""Security utilities — JWT tokens, password hashing."""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt, JWTError
import bcrypt

from app.config import settings


def _truncate_password(password: str) -> bytes:
    """Truncate password to 72 bytes (bcrypt limit) and return as bytes."""
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    """Hash a plain-text password (truncated to bcrypt 72-byte limit)."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(_truncate_password(password), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(
        _truncate_password(plain_password),
        hashed_password.encode("utf-8")
    )


def create_access_token(
    subject: str,
    extra_data: Optional[Dict[str, Any]] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a JWT access token."""
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode = {"sub": subject, "exp": expire}
    if extra_data:
        to_encode.update(extra_data)
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT token. Returns payload or None."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None

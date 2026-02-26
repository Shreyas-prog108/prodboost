from datetime import datetime, timedelta, timezone
from typing import Any
import logging
from passlib.context import CryptContext
from jwt import encode, decode, PyJWTError
from cryptography.fernet import Fernet
import base64
import hashlib
import uuid
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.token import TokenData

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# tokenUrl is used only for OpenAPI docs; actual token extraction is handled manually below.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
COOKIE_NAME = "access_token"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str | Any, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    jti = str(uuid.uuid4())  # unique token ID — used for revocation
    to_encode = {"exp": expire, "sub": str(subject), "role": role, "jti": jti}
    encoded_jwt = encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


# ── Token revocation (Redis blocklist) ──────────────────────────────────────

def _get_blocklist_client():
    """Lazy-import to avoid circular dependencies."""
    from app.core.redis import redis_client as upstash_client
    return upstash_client


def revoke_token(jti: str, exp: int) -> None:
    """Add a token JTI to the Redis blocklist until its natural expiry."""
    now = int(datetime.now(timezone.utc).timestamp())
    ttl = max(exp - now, 1)
    try:
        _get_blocklist_client().set(f"blocklist:{jti}", "1", ex=ttl)
    except Exception as e:
        logger.error(f"Failed to revoke token JTI {jti}: {e}")


def is_token_revoked(jti: str) -> bool:
    """Return True if the token has been revoked."""
    try:
        return bool(_get_blocklist_client().get(f"blocklist:{jti}"))
    except Exception as e:
        # Fail closed: if Redis is down we cannot verify revocation, deny access.
        logger.error(f"Blocklist check failed for JTI {jti}: {e}")
        return True


# ── Auth dependency ──────────────────────────────────────────────────────────

def _extract_raw_token(request: Request, bearer_token: str | None) -> str | None:
    """
    Extract the raw JWT string from either:
    1. The HttpOnly cookie (preferred for browser clients), or
    2. The Authorization: Bearer header (for API / mobile clients).
    """
    cookie_token = request.cookies.get(COOKIE_NAME)
    if cookie_token:
        return cookie_token
    return bearer_token  # may be None


async def get_current_user(
    request: Request,
    bearer_token: str | None = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = _extract_raw_token(request, bearer_token)
    if not token:
        raise credentials_exception

    try:
        payload = decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        jti: str = payload.get("jti")
        if user_id is None or jti is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except PyJWTError:
        raise credentials_exception

    # Revocation check
    if is_token_revoked(jti):
        raise credentials_exception

    stmt = select(User).where(User.id == token_data.user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    return user


# ── Token Encryption Methods ─────────────────────────────────────────────────

def _get_fernet() -> Fernet:
    """
    Generate a deterministic 32-byte url-safe base64-encoded key from the ENCRYPTION_SECRET
    to initialize Fernet symmetrically.
    """
    secret_bytes = settings.ENCRYPTION_SECRET.encode()
    key = base64.urlsafe_b64encode(hashlib.sha256(secret_bytes).digest())
    return Fernet(key)

def encrypt_token(token: str) -> str:
    """Encrypts a plaintext string (e.g. an OAuth access token) symmetrically."""
    if not token:
        logger.warning(
            "encrypt_token called with an empty token value — this may indicate a bug in the caller."
        )
        return ""
    fernet = _get_fernet()
    encrypted_bytes = fernet.encrypt(token.encode())
    return encrypted_bytes.decode()

def decrypt_token(encrypted_token: str) -> str:
    """Decrypts strings previously encrypted via encrypt_token."""
    if not encrypted_token:
        logger.warning(
            "decrypt_token called with an empty encrypted_token — this may indicate a bug in the caller."
        )
        return ""
    fernet = _get_fernet()
    decrypted_bytes = fernet.decrypt(encrypted_token.encode())
    return decrypted_bytes.decode()

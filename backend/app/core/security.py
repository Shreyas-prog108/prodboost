from datetime import datetime, timedelta, timezone
from typing import Any
from passlib.context import CryptContext
from jwt import encode, decode, PyJWTError
from cryptography.fernet import Fernet
import base64
import hashlib
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.token import TokenData

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str | Any, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    encoded_jwt = encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except PyJWTError:
        raise credentials_exception
        
    stmt = select(User).where(User.id == token_data.user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
        
    return user


# --- Token Encryption Methods ---

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
        import logging
        logging.getLogger(__name__).warning(
            "encrypt_token called with an empty token value — this may indicate a bug in the caller."
        )
        return ""
    fernet = _get_fernet()
    encrypted_bytes = fernet.encrypt(token.encode())
    return encrypted_bytes.decode()

def decrypt_token(encrypted_token: str) -> str:
    """Decrypts strings previously encrypted via encrypt_token."""
    if not encrypted_token:
        import logging
        logging.getLogger(__name__).warning(
            "decrypt_token called with an empty encrypted_token — this may indicate a bug in the caller."
        )
        return ""
    fernet = _get_fernet()
    decrypted_bytes = fernet.decrypt(encrypted_token.encode())
    return decrypted_bytes.decode()

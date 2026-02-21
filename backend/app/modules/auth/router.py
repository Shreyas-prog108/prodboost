from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.redis import check_rate_limit
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.token import Token
from app.schemas.response import APIResponse
from app.modules.auth.service import register_user_service, authenticate_user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=APIResponse[UserResponse])
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    user = await register_user_service(user_in, db)
    return APIResponse(data=user)


@router.post("/login", response_model=APIResponse[Token])
async def login(
    request: Request,
    user_credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    # Get client IP for rate limiting
    client_ip = request.client.host if request.client else "unknown"
    rate_limit_key = f"rl:auth:login:{client_ip}"
    
    # Check rate limit (e.g. 5 attempts per minute)
    check_rate_limit(key=rate_limit_key, limit=5, window=60)
    
    access_token, user = await authenticate_user_service(user_credentials, db)
    
    return APIResponse(data=Token(
        access_token=access_token,
        token_type="bearer"
    ))

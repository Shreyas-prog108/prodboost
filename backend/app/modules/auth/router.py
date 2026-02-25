from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.redis import check_rate_limit
from app.core.security import (
    get_current_user,
    revoke_token,
    COOKIE_NAME,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.token import Token
from app.schemas.response import APIResponse
from app.modules.auth.service import register_user_service, authenticate_user_service
from app.models.user import User

import jwt as pyjwt
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=APIResponse[UserResponse])
async def register(
    request: Request,
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    # Rate-limit registration to prevent account-creation abuse (5 per 5 min per IP)
    client_ip = request.client.host if request.client else "unknown"
    check_rate_limit(key=f"rl:auth:register:{client_ip}", limit=5, window=300)

    user = await register_user_service(user_in, db)
    return APIResponse(data=user)


@router.post("/login", response_model=APIResponse[Token])
async def login(
    request: Request,
    response: Response,
    user_credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    # Rate-limit by client IP (5 attempts / 60 s)
    client_ip = request.client.host if request.client else "unknown"
    check_rate_limit(key=f"rl:auth:login:{client_ip}", limit=5, window=60)

    access_token, user = await authenticate_user_service(user_credentials, db)

    # Set HttpOnly cookie so browsers never expose the token to JavaScript.
    # secure=True enforces HTTPS-only in production; SameSite=Lax protects against CSRF.
    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=(settings.ENVIRONMENT == "production"),
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return APIResponse(data=Token(
        access_token=access_token,
        token_type="bearer"
    ))


@router.get("/me", response_model=APIResponse[UserResponse])
async def me(
    current_user: User = Depends(get_current_user),
):
    """Return the currently authenticated user. Used by the frontend to verify
    the cookie session on page load."""
    return APIResponse(data=current_user)


@router.post("/logout", response_model=APIResponse[None])
async def logout(
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
):
    """
    Invalidate the current session by:
    1. Adding the token's JTI to a Redis blocklist (server-side revocation).
    2. Clearing the HttpOnly auth cookie on the client.
    """
    # Extract the raw token from cookie or header to get the JTI
    raw_token = request.cookies.get(COOKIE_NAME)
    if not raw_token:
        from fastapi.security.utils import get_authorization_scheme_param
        auth_header = request.headers.get("Authorization")
        if auth_header:
            _, raw_token = get_authorization_scheme_param(auth_header)

    if raw_token:
        try:
            payload = pyjwt.decode(raw_token, settings.JWT_SECRET, algorithms=["HS256"])
            jti = payload.get("jti")
            exp = payload.get("exp")
            if jti and exp:
                revoke_token(jti, exp)
        except Exception:
            pass  # Expired/invalid tokens don't need blocklisting

    # Clear the cookie regardless
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return APIResponse(data=None)

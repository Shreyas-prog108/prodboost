from pydantic import BaseModel, EmailStr, Field
from typing import Annotated
from datetime import datetime
from uuid import UUID

from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    # Min 12 chars (NIST SP 800-63B), max 72 to avoid bcrypt silent truncation
    password: Annotated[str, Field(
        min_length=12,
        max_length=72,
        description="Password must be 12–72 characters long"
    )]


class UserLogin(UserBase):
    # Use the same bounds on login so error messages are consistent
    password: Annotated[str, Field(
        min_length=12,
        max_length=72,
        description="Password must be 12–72 characters long"
    )]


class UserResponse(UserBase):
    id: UUID
    role: UserRole
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

from pydantic import BaseModel, EmailStr, Field
from typing import Annotated
from datetime import datetime
from uuid import UUID

from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: Annotated[str, Field(min_length=8, description="Password must be at least 8 characters long")]


class UserLogin(UserBase):
    password: Annotated[str, Field(min_length=8, description="Password must be at least 8 characters long")]


class UserResponse(UserBase):
    id: UUID
    role: UserRole
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

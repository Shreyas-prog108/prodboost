from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID
    role: UserRole
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

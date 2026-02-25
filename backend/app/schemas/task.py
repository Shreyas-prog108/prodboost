from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from app.models.task import TaskStatus, TaskSource

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: str | None = Field(None, max_length=10_000)
    due_date: datetime | None = None
    source: TaskSource = TaskSource.MANUAL


class TaskUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=500)
    description: str | None = Field(None, max_length=10_000)
    due_date: datetime | None = None
    status: TaskStatus | None = None


class TaskResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: str | None = None
    due_date: datetime | None = None
    status: TaskStatus
    source: TaskSource
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

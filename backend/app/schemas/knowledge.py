from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import List

class TeamCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2_000)

class TeamResponse(BaseModel):
    id: UUID
    name: str
    description: str | None = None
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

class KnowledgeEntryCreate(BaseModel):
    team_id: str
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1, max_length=500_000)
    tags: List[str] = []

class KnowledgeEntryUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=500)
    content: str | None = Field(None, min_length=1, max_length=500_000)
    tags: List[str] | None = None

class KnowledgeEntryResponse(BaseModel):
    id: UUID
    team_id: UUID
    title: str
    content: str
    tags: List[str]
    version: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "from_attributes": True
    }

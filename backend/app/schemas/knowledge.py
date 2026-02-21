from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List

class TeamCreate(BaseModel):
    name: str
    description: str | None = None

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
    title: str
    content: str
    tags: List[str] = []

class KnowledgeEntryUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
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

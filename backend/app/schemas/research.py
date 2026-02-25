from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from uuid import UUID

# Project Schemas
class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: str | None = Field(None, max_length=5_000)

class ProjectResponse(ProjectCreate):
    id: UUID
    user_id: UUID
    created_at: datetime
    model_config = {"from_attributes": True}

# Source Schemas
class SourceCreate(BaseModel):
    url: HttpUrl
    title: str | None = Field(None, max_length=500)
    metadata_json: dict | None = None
    extracted_text: str | None = Field(None, max_length=200_000)
    citation_data: dict | None = None

class SourceResponse(BaseModel):
    id: UUID
    project_id: UUID
    url: str  # serialised as string in responses
    title: str | None = None
    metadata_json: dict | None = None
    extracted_text: str | None = None
    citation_data: dict | None = None
    model_config = {"from_attributes": True}

# Note Schemas
class NoteCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=50_000)
    tags: list | dict | None = None
    linked_source_id: str | None = None

class NoteResponse(NoteCreate):
    id: UUID
    project_id: UUID
    model_config = {"from_attributes": True}

# Draft Schemas
class DraftCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=200_000)
    citations: dict | None = None

class DraftResponse(DraftCreate):
    id: UUID
    project_id: UUID
    version: int
    created_at: datetime
    model_config = {"from_attributes": True}

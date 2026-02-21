from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

# Project Schemas
class ProjectCreate(BaseModel):
    title: str
    description: str | None = None

class ProjectResponse(ProjectCreate):
    id: UUID
    user_id: UUID
    created_at: datetime
    model_config = {"from_attributes": True}

# Source Schemas
class SourceCreate(BaseModel):
    url: str
    title: str | None = None
    metadata_json: dict | None = None
    extracted_text: str | None = None
    citation_data: dict | None = None

class SourceResponse(SourceCreate):
    id: UUID
    project_id: UUID
    model_config = {"from_attributes": True}

# Note Schemas
class NoteCreate(BaseModel):
    content: str
    tags: list | dict | None = None
    linked_source_id: str | None = None

class NoteResponse(NoteCreate):
    id: UUID
    project_id: UUID
    model_config = {"from_attributes": True}

# Draft Schemas
class DraftCreate(BaseModel):
    content: str
    citations: dict | None = None

class DraftResponse(DraftCreate):
    id: UUID
    project_id: UUID
    version: int
    created_at: datetime
    model_config = {"from_attributes": True}

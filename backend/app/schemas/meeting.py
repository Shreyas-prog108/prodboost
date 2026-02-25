from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from app.models.meeting import MeetingStatus, PrivacyLevel

class MeetingUpload(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    # Transcripts can be long but cap at 500 KB of text to prevent AI cost abuse
    transcript: str = Field(..., min_length=1, max_length=500_000)
    privacy_level: PrivacyLevel = PrivacyLevel.PRIVATE


class MeetingResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    transcript: str
    summary: str | None = None
    action_items: dict | None = None
    status: MeetingStatus
    privacy_level: PrivacyLevel
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

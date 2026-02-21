from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from app.models.meeting import MeetingStatus, PrivacyLevel

class MeetingUpload(BaseModel):
    title: str
    transcript: str
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

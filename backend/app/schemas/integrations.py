from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Any, Dict
from app.models.integrations import IntegrationType

class IntegrationCreate(BaseModel):
    type: IntegrationType
    access_token: str
    refresh_token: str
    expiry: datetime | None = None

class IntegrationResponse(BaseModel):
    """Note: Never exposes raw access or refresh tokens to the frontend."""
    id: UUID
    user_id: UUID
    type: IntegrationType
    expiry: datetime | None = None
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

class OrchestrationEventResponse(BaseModel):
    id: UUID
    user_id: UUID
    source: str
    type: str
    payload: Dict[str, Any]
    processed: bool
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

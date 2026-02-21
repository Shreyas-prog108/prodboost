from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Dict, Any

from app.models.automation import TriggerType

class RuleCreate(BaseModel):
    trigger_type: TriggerType
    condition_json: Dict[str, Any] = {}
    action_json: Dict[str, Any] = {}
    is_active: bool = True

class RuleResponse(BaseModel):
    id: UUID
    user_id: UUID
    trigger_type: TriggerType
    condition_json: Dict[str, Any]
    action_json: Dict[str, Any]
    is_active: bool
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

class EventExecutionRequest(BaseModel):
    trigger_type: TriggerType
    payload: Dict[str, Any]

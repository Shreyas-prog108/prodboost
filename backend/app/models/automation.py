import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

class TriggerType(str, enum.Enum):
    NEW_MEETING_SUMMARY = "NEW_MEETING_SUMMARY"
    KEYWORD_IN_EVENT = "KEYWORD_IN_EVENT"
    DAILY_DIGEST = "DAILY_DIGEST"
    MANUAL = "MANUAL"

class AutomationRule(Base):
    __tablename__ = "automation_rules"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    trigger_type: Mapped[TriggerType] = mapped_column(Enum(TriggerType), nullable=False)
    # The condition block. E.g., {"keyword": "urgent"}, or {"source": "sales_call"}
    condition_json: Mapped[dict] = mapped_column(JSON, default=lambda: {}, nullable=False)
    # The action logic to execute. E.g., {"type": "CREATE_TASK", "assignee": "me"}
    action_json: Mapped[dict] = mapped_column(JSON, default=lambda: {}, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

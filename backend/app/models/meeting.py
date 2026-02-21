import uuid
import enum
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Text, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class MeetingStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUMMARIZED = "SUMMARIZED"
    FAILED = "FAILED"


class PrivacyLevel(str, enum.Enum):
    PRIVATE = "PRIVATE"
    TEAM = "TEAM"
    PUBLIC = "PUBLIC"

class MeetingSession(Base):
    __tablename__ = "meeting_sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    transcript: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    action_items: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    status: Mapped[MeetingStatus] = mapped_column(Enum(MeetingStatus), default=MeetingStatus.PENDING, nullable=False)
    privacy_level: Mapped[PrivacyLevel] = mapped_column(Enum(PrivacyLevel), default=PrivacyLevel.PRIVATE, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

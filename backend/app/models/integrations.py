import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

class IntegrationType(str, enum.Enum):
    GOOGLE_MAIL = "GOOGLE_MAIL"
    CALENDAR = "CALENDAR"
    DRIVE = "DRIVE"
    SLACK = "SLACK"

class Integration(Base):
    __tablename__ = "integrations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    type: Mapped[IntegrationType] = mapped_column(Enum(IntegrationType), nullable=False)
    access_token: Mapped[str] = mapped_column(String, nullable=False) # Encrypted
    refresh_token: Mapped[str] = mapped_column(String, nullable=False) # Encrypted
    expiry: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow(), nullable=False)

class OrchestrationEvent(Base):
    __tablename__ = "orchestration_events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    source: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)
    payload: Mapped[dict] = mapped_column(JSON, default=lambda: {}, nullable=False)
    processed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow(), nullable=False)

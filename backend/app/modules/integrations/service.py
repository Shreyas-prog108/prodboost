from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.integrations import Integration, OrchestrationEvent
from app.schemas.integrations import IntegrationCreate
from app.core.security import encrypt_token

async def connect_integration_service(user_id: str, integration_in: IntegrationCreate, db: AsyncSession) -> Integration:
    # Safely encrypt tokens at rest
    encrypted_access = encrypt_token(integration_in.access_token)
    encrypted_refresh = encrypt_token(integration_in.refresh_token)
    
    # Store softly
    new_integration = Integration(
        user_id=user_id,
        type=integration_in.type,
        access_token=encrypted_access,
        refresh_token=encrypted_refresh,
        expiry=integration_in.expiry
    )
    db.add(new_integration)
    await db.commit()
    await db.refresh(new_integration)
    
    # Exposing the integration (router will use Pydantic `IntegrationResponse` schema to scrub the keys)
    return new_integration


async def get_orchestration_feed_service(user_id: str, db: AsyncSession) -> list[OrchestrationEvent]:
    stmt = select(OrchestrationEvent).where(
        OrchestrationEvent.user_id == user_id
    ).order_by(OrchestrationEvent.created_at.desc()).limit(50)
    
    result = await db.execute(stmt)
    events = list(result.scalars().all())
    return events

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

from app.schemas.integrations import IntegrationCreate, IntegrationResponse, OrchestrationEventResponse
from app.schemas.response import APIResponse
from app.modules.integrations.service import connect_integration_service, get_orchestration_feed_service


router = APIRouter(prefix="", tags=["integrations"])


@router.post("/integrations/connect", response_model=APIResponse[IntegrationResponse])
async def connect_integration(
    integration_in: IntegrationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Exposes an endpoint allowing users to securely link their Google/Slack credentials.
    Access/Refresh tokens are symmetrically encrypted via Fernet before touching the DB.
    """
    integration = await connect_integration_service(current_user.id, integration_in, db)
    return APIResponse(data=integration)


@router.get("/orchestration/feed", response_model=APIResponse[list[OrchestrationEventResponse]])
async def orchestration_feed(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns recent metadata orchestration events spanning multiple platform integrations for the UI.
    """
    feed = await get_orchestration_feed_service(current_user.id, db)
    return APIResponse(data=feed)

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

from app.schemas.knowledge import (
    TeamCreate, TeamResponse,
    KnowledgeEntryCreate, KnowledgeEntryUpdate, KnowledgeEntryResponse
)
from app.schemas.response import APIResponse
from app.modules.knowledge.service import (
    create_team_service,
    create_knowledge_service,
    update_knowledge_service,
    get_knowledge_for_team_service
)


router = APIRouter(tags=["knowledge"])


@router.post("/teams", response_model=APIResponse[TeamResponse])
async def create_team(
    team_in: TeamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new team namespace for knowledge."""
    team = await create_team_service(team_in, db)
    return APIResponse(data=team)


@router.post("/knowledge", response_model=APIResponse[KnowledgeEntryResponse])
async def create_knowledge(
    entry_in: KnowledgeEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a markdown article to a Team's knowledge hub."""
    entry = await create_knowledge_service(entry_in, db)
    return APIResponse(data=entry)


@router.patch("/knowledge/{id}", response_model=APIResponse[KnowledgeEntryResponse])
async def update_knowledge(
    id: str,
    entry_in: KnowledgeEntryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a knowledge article. Automatically increments the internal version tracking number if there are changes.

    NOTE: Full team-membership authorization requires a TeamMember join table (not yet in schema).
    The service layer enforces 404 if the entry does not exist; access is gated by JWT authentication.
    """
    entry = await update_knowledge_service(id, entry_in, db)
    return APIResponse(data=entry)


@router.get("/knowledge/team/{team_id}", response_model=APIResponse[list[KnowledgeEntryResponse]])
async def list_knowledge_for_team(
    team_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all knowledge entries for a given team, sorted by most recently updated."""
    entries = await get_knowledge_for_team_service(team_id, db)
    return APIResponse(data=entries)

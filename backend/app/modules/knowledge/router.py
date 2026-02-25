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
    team = await create_team_service(team_in, current_user.id, db)
    return APIResponse(data=team)


@router.post("/knowledge", response_model=APIResponse[KnowledgeEntryResponse])
async def create_knowledge(
    entry_in: KnowledgeEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a markdown article to a Team's knowledge hub."""
    entry = await create_knowledge_service(entry_in, current_user.id, db)
    return APIResponse(data=entry)


@router.patch("/knowledge/{id}", response_model=APIResponse[KnowledgeEntryResponse])
async def update_knowledge(
    id: str,
    entry_in: KnowledgeEntryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a knowledge article. Automatically increments the version number on change.
    Only the team owner may update entries."""
    entry = await update_knowledge_service(id, entry_in, current_user.id, db)
    return APIResponse(data=entry)


@router.get("/knowledge/team/{team_id}", response_model=APIResponse[list[KnowledgeEntryResponse]])
async def list_knowledge_for_team(
    team_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all knowledge entries for a given team. Only the team owner may list entries."""
    entries = await get_knowledge_for_team_service(team_id, current_user.id, db)
    return APIResponse(data=entries)

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.knowledge import Team, KnowledgeEntry
from app.schemas.knowledge import TeamCreate, KnowledgeEntryCreate, KnowledgeEntryUpdate


async def _get_team_or_404(team_id: str, db: AsyncSession) -> Team:
    stmt = select(Team).where(Team.id == team_id)
    result = await db.execute(stmt)
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")
    return team


def _assert_team_owner(team: Team, user_id: str) -> None:
    """Raise 403 if the requesting user does not own the team.

    Rows with a NULL created_by (created before ownership tracking was added)
    are accessible by any authenticated user to preserve backwards compatibility.
    """
    if team.created_by is not None and team.created_by != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this team.",
        )


async def create_team_service(team_in: TeamCreate, user_id: str, db: AsyncSession) -> Team:
    new_team = Team(
        name=team_in.name,
        description=team_in.description,
        created_by=user_id,
    )
    db.add(new_team)
    await db.commit()
    await db.refresh(new_team)
    return new_team


async def create_knowledge_service(
    entry_in: KnowledgeEntryCreate, user_id: str, db: AsyncSession
) -> KnowledgeEntry:
    team = await _get_team_or_404(entry_in.team_id, db)
    _assert_team_owner(team, user_id)

    new_entry = KnowledgeEntry(
        team_id=entry_in.team_id,
        title=entry_in.title,
        content=entry_in.content,
        tags=entry_in.tags,
        version=1
    )
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    return new_entry


async def update_knowledge_service(
    entry_id: str, entry_in: KnowledgeEntryUpdate, user_id: str, db: AsyncSession
) -> KnowledgeEntry:
    stmt = select(KnowledgeEntry).where(KnowledgeEntry.id == entry_id)
    result = await db.execute(stmt)
    entry = result.scalar_one_or_none()

    if not entry:
        raise HTTPException(status_code=404, detail="Knowledge Entry not found.")

    # Check that the requesting user owns the parent team
    team = await _get_team_or_404(entry.team_id, db)
    _assert_team_owner(team, user_id)

    has_changes = False

    if entry_in.title is not None and entry_in.title != entry.title:
        entry.title = entry_in.title
        has_changes = True

    if entry_in.content is not None and entry_in.content != entry.content:
        entry.content = entry_in.content
        has_changes = True

    if entry_in.tags is not None and entry_in.tags != entry.tags:
        entry.tags = entry_in.tags
        has_changes = True

    if has_changes:
        # Crucial logic: Autoincrement version when document content changes
        entry.version += 1
        await db.commit()
        await db.refresh(entry)

    return entry


async def get_knowledge_for_team_service(
    team_id: str, user_id: str, db: AsyncSession
) -> list[KnowledgeEntry]:
    team = await _get_team_or_404(team_id, db)
    _assert_team_owner(team, user_id)

    stmt = select(KnowledgeEntry).where(
        KnowledgeEntry.team_id == team_id
    ).order_by(KnowledgeEntry.updated_at.desc())

    result = await db.execute(stmt)
    entries = list(result.scalars().all())
    return entries

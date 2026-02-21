from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.knowledge import Team, KnowledgeEntry
from app.schemas.knowledge import TeamCreate, KnowledgeEntryCreate, KnowledgeEntryUpdate

async def create_team_service(team_in: TeamCreate, db: AsyncSession) -> Team:
    new_team = Team(
        name=team_in.name,
        description=team_in.description
    )
    db.add(new_team)
    await db.commit()
    await db.refresh(new_team)
    return new_team


async def create_knowledge_service(entry_in: KnowledgeEntryCreate, db: AsyncSession) -> KnowledgeEntry:
    # Ensure team exists
    stmt = select(Team).where(Team.id == entry_in.team_id)
    result = await db.execute(stmt)
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")

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


async def update_knowledge_service(entry_id: str, entry_in: KnowledgeEntryUpdate, db: AsyncSession) -> KnowledgeEntry:
    stmt = select(KnowledgeEntry).where(KnowledgeEntry.id == entry_id)
    result = await db.execute(stmt)
    entry = result.scalar_one_or_none()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Knowledge Entry not found.")
        
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


async def get_knowledge_for_team_service(team_id: str, db: AsyncSession) -> list[KnowledgeEntry]:
    stmt = select(KnowledgeEntry).where(
        KnowledgeEntry.team_id == team_id
    ).order_by(KnowledgeEntry.updated_at.desc())
    
    result = await db.execute(stmt)
    entries = list(result.scalars().all())
    return entries

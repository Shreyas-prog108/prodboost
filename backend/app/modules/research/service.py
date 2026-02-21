from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.research import ResearchProject, Source, Note, Draft
from app.schemas.research import ProjectCreate, SourceCreate, NoteCreate


async def create_project_service(user_id: str, project_in: ProjectCreate, db: AsyncSession) -> ResearchProject:
    new_project = ResearchProject(
        user_id=user_id,
        title=project_in.title,
        description=project_in.description
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project


async def get_user_projects_service(user_id: str, db: AsyncSession) -> list[ResearchProject]:
    stmt = select(ResearchProject).where(ResearchProject.user_id == user_id)
    result = await db.execute(stmt)
    projects = list(result.scalars().all())
    return projects


async def add_source_to_project_service(project_id: str, source_in: SourceCreate, db: AsyncSession) -> Source:
    # Basic check to ensure project exists
    stmt = select(ResearchProject).where(ResearchProject.id == project_id)
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research project not found"
        )
        
    new_source = Source(
        project_id=project_id,
        url=source_in.url,
        title=source_in.title,
        metadata_json=source_in.metadata_json,
        extracted_text=source_in.extracted_text,
        citation_data=source_in.citation_data
    )
    db.add(new_source)
    await db.commit()
    await db.refresh(new_source)
    return new_source


async def add_note_to_project_service(project_id: str, note_in: NoteCreate, db: AsyncSession) -> Note:
    # Basic check to ensure project exists
    stmt = select(ResearchProject).where(ResearchProject.id == project_id)
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research project not found"
        )
        
    new_note = Note(
        project_id=project_id,
        content=note_in.content,
        tags=note_in.tags,
        linked_source_id=note_in.linked_source_id
    )
    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    return new_note


async def get_project_context(project_id: str, db: AsyncSession) -> dict:
    """Helper service to fetch sources and notes to be sent to AI Provider."""
    stmt_sources = select(Source).where(Source.project_id == project_id)
    res_sources = await db.execute(stmt_sources)
    sources = list(res_sources.scalars().all())
    
    stmt_notes = select(Note).where(Note.project_id == project_id)
    res_notes = await db.execute(stmt_notes)
    notes = list(res_notes.scalars().all())
    
    return {
        "sources_count": len(sources),
        "notes_count": len(notes),
        "sources_data": [{"id": s.id, "title": s.title} for s in sources],
        "notes_data": [{"id": n.id, "content": n.content} for n in notes]
    }

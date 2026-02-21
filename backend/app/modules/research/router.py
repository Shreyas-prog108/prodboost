from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

from app.schemas.research import (
    ProjectCreate, ProjectResponse,
    SourceCreate, SourceResponse,
    NoteCreate, NoteResponse
)
from app.schemas.response import APIResponse
from app.modules.research.service import (
    create_project_service, get_user_projects_service,
    add_source_to_project_service, add_note_to_project_service,
    get_project_context
)
from app.jobs.queue import enqueue_job

router = APIRouter(prefix="/research", tags=["research"])


@router.post("/projects", response_model=APIResponse[ProjectResponse])
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = await create_project_service(current_user.id, project_in, db)
    return APIResponse(data=project)


@router.get("/projects", response_model=APIResponse[list[ProjectResponse]])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = await get_user_projects_service(current_user.id, db)
    return APIResponse(data=projects)


@router.post("/{id}/sources", response_model=APIResponse[SourceResponse])
async def add_source(
    id: str,
    source_in: SourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In a full app, check if the current user actually owns project `id`
    source = await add_source_to_project_service(id, source_in, db)
    return APIResponse(data=source)


@router.post("/{id}/notes", response_model=APIResponse[NoteResponse])
async def add_note(
    id: str,
    note_in: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In a full app, check if the current user actually owns project `id`
    note = await add_note_to_project_service(id, note_in, db)
    return APIResponse(data=note)


@router.post("/{id}/generate-draft")
async def request_generate_draft(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch context to embed in the queued payload
    project_context = await get_project_context(id, db)
    
    # 2. Push job to Redis queue (serverless-compliant, no in-memory execution)
    job_id = await enqueue_job(
        queue_name="queue:research",
        job_name="process_generate_draft",
        payload={
            "project_id": id,
            "context": project_context
        }
    )
    
    return APIResponse(data={
        "message": "Draft generation job enqueued.",
        "project_id": id,
        "job_id": job_id
    })

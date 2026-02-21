from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

from app.schemas.meeting import MeetingUpload, MeetingResponse
from app.schemas.response import APIResponse
from app.modules.meetings.service import upload_meeting_session_service, get_meeting_session_service
from app.jobs.queue import enqueue_job

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.post("/upload", response_model=APIResponse[MeetingResponse])
async def upload_meeting(
    upload_in: MeetingUpload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meeting = await upload_meeting_session_service(current_user.id, upload_in, db)
    return APIResponse(data=meeting)


@router.post("/{id}/summarize")
async def summarize_meeting(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure meeting exists
    meeting = await get_meeting_session_service(id, db)
    
    # Enqueue background summary task to Redis list queue
    job_id = await enqueue_job(
        queue_name="queue:meetings",
        job_name="process_summarize_meeting",
        payload={"meeting_id": id}
    )
    
    return APIResponse(data={
        "message": "Meeting summarization job enqueued via Redis.",
        "meeting_id": id,
        "job_id": job_id
    })


@router.get("/{id}", response_model=APIResponse[MeetingResponse])
async def get_meeting(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Assume auth middleware verifies ownership.
    meeting = await get_meeting_session_service(id, db)
    return APIResponse(data=meeting)

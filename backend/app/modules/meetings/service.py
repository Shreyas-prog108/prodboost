from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.meeting import MeetingSession
from app.schemas.meeting import MeetingUpload


async def upload_meeting_session_service(user_id: str, upload_in: MeetingUpload, db: AsyncSession) -> MeetingSession:
    new_meeting = MeetingSession(
        user_id=user_id,
        title=upload_in.title,
        transcript=upload_in.transcript,
        privacy_level=upload_in.privacy_level
    )
    db.add(new_meeting)
    await db.commit()
    await db.refresh(new_meeting)
    return new_meeting


async def get_meeting_session_service(meeting_id: str, db: AsyncSession) -> MeetingSession:
    stmt = select(MeetingSession).where(MeetingSession.id == meeting_id)
    result = await db.execute(stmt)
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting session not found"
        )
        
    return meeting

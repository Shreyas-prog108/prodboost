import json
from redis.asyncio import Redis

from sqlalchemy.ext.asyncio import AsyncSession
from app.models.job import JobLog, JobStatus
from app.core.config import settings
from app.core.database import SessionLocal

redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)

async def enqueue_job(queue_name: str, job_name: str, payload: dict) -> str:
    """
    Creates a pending JobLog in SQLite and pushes the ID and payload into a Redis List acting as a queue.
    """
    async with SessionLocal() as db:
        new_job = JobLog(
            queue_name=queue_name,
            job_name=job_name,
            payload=payload,
            status=JobStatus.PENDING
        )
        db.add(new_job)
        await db.commit()
        await db.refresh(new_job)
        job_id = new_job.id

    # Redis BLPOP payloads usually just need the minimum reconstructable JSON
    job_msg = {
        "job_id": job_id,
        "job_name": job_name,
        "payload": payload
    }
    await redis_client.lpush(queue_name, json.dumps(job_msg))
    # Enforce data minimization: automatically expire queue list if worker dies (24 hours)
    await redis_client.expire(queue_name, 86400)
    return job_id

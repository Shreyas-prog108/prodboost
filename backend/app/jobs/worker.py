import asyncio
import json
import logging
from redis.asyncio import Redis

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.job import JobLog, JobStatus
from app.jobs.handlers import process_summarize_meeting, process_automation_event

logger = logging.getLogger(__name__)

redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)

# Define the queues we want our worker to listen to. BLPOP evaluates left-to-right.
QUEUES = ["queue:meetings", "queue:automation", "queue:research"]


async def route_job(job_name: str, payload: dict, db):
    """Routes the serialized job_name to the actual python Handler strictly."""
    if job_name == "process_summarize_meeting":
        await process_summarize_meeting(payload.get("meeting_id"), db)
    elif job_name == "process_automation_event":
        from app.models.automation import TriggerType
        ttype = payload.get("trigger_type")
        trigger_enum = TriggerType(ttype)
        await process_automation_event(
            user_id=payload.get("user_id"), 
            trigger_type=trigger_enum, 
            payload=payload.get("event_payload"), 
            db=db
        )
    elif job_name == "process_generate_draft":
        from app.jobs.handlers import process_generate_draft
        await process_generate_draft(
            project_id=payload.get("project_id"),
            context=payload.get("context", {})
        )
    else:
        raise ValueError(f"Unknown job_name: {job_name}")


async def worker_loop():
    """Infinite loop that blocks on Redis lists waiting for jobs to process."""
    logger.info(f"Worker booted. Polling queues: {QUEUES}")
    while True:
        try:
            # BLPOP blocks until a message is available in ANY of the given lists
            # Returns a tuple: (queue_name, popped_message_string)
            result = await redis_client.blpop(QUEUES, timeout=5)
            if not result:
                # No messages after 5 seconds, loop again
                continue
                
            queue_name, msg_str = result
            msg = json.loads(msg_str)
            job_id = msg.get("job_id")
            job_name = msg.get("job_name")
            payload = msg.get("payload", {})
            
            logger.info(f"Worker picked up Job {job_id} from {queue_name}")
            
            async with SessionLocal() as db:
                job_log = await db.get(JobLog, job_id)
                if not job_log:
                    logger.error(f"Job DB record {job_id} missing! Discarding.")
                    continue
                
                # Update DB state to RUNNING
                job_log.status = JobStatus.RUNNING
                await db.commit()
                
                try:
                    # Execute
                    await route_job(job_name, payload, db)
                    
                    # Success
                    job_log = await db.get(JobLog, job_id) # re-fetch just in case
                    job_log.status = JobStatus.COMPLETED
                    await db.commit()
                    logger.info(f"Job {job_id} ({job_name}) COMPLETED.")
                    
                except Exception as e:
                    logger.error(f"Job {job_id} FAILED: {str(e)}")
                    # Idempotent Retry Strategy
                    job_log = await db.get(JobLog, job_id)
                    job_log.error_log = str(e)
                    
                    if job_log.retries_count < 3:
                        job_log.retries_count += 1
                        job_log.status = JobStatus.PENDING
                        await db.commit()
                        logger.warning(f"Re-queueing Job {job_id} (Attempt {job_log.retries_count}/3)")
                        # Push back to the tail of the queue to preserve FIFO order (BLPOP reads from head)
                        await redis_client.rpush(queue_name, msg_str) 
                    else:
                        job_log.status = JobStatus.FAILED
                        await db.commit()
                        logger.error(f"Job {job_id} exhausted all retries and is permanently FAILED.")
                        
        except Exception as e:
            logger.error(f"Critical Worker Loop Error: {e}")
            await asyncio.sleep(2) # Prevent spamming on catastrophic redis drops

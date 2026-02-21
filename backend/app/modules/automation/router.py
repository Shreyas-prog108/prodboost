from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

from app.schemas.automation import RuleCreate, RuleResponse, EventExecutionRequest
from app.schemas.response import APIResponse
from app.modules.automation.service import create_rule_service, get_rules_service
from app.jobs.queue import enqueue_job


router = APIRouter(prefix="/automation", tags=["automation"])


@router.post("/rules", response_model=APIResponse[RuleResponse])
async def create_rule(
    rule_in: RuleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rule = await create_rule_service(current_user.id, rule_in, db)
    return APIResponse(data=rule)


@router.get("/rules", response_model=APIResponse[list[RuleResponse]])
async def list_rules(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rules = await get_rules_service(current_user.id, db)
    return APIResponse(data=rules)


@router.post("/execute")
async def execute_event(
    event_in: EventExecutionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Enqueue background processing for rule evaluation via Redis
    job_id = await enqueue_job(
        queue_name="queue:automation",
        job_name="process_automation_event",
        payload={
            "user_id": current_user.id,
            "trigger_type": event_in.trigger_type.value,
            "event_payload": event_in.payload
        }
    )
    
    return APIResponse(data={
        "job_id": job_id,
        "message": "Event queued for automation rule evaluation via Redis."
    })

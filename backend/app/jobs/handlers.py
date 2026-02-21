import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.research import Draft
from app.models.meeting import MeetingSession, MeetingStatus
from app.models.task import TaskSource
from app.models.automation import AutomationRule, TriggerType
from app.schemas.task import TaskCreate
from app.modules.tasks.service import create_task_service
from app.services.ai_provider import get_ai_provider
from app.core.config import settings

logger = logging.getLogger(__name__)

async def process_generate_draft(project_id: str, context: dict, db: AsyncSession = None):
    """
    Worker-compatible handler: generates a draft via AI and saves it to DB.
    If db is not provided, opens its own session (for Redis worker execution).
    """
    from app.core.database import SessionLocal

    async def _run(session: AsyncSession):
        logger.info(f"Draft generation starting for project {project_id}")
        provider = get_ai_provider(settings.AI_PROVIDER)
        try:
            draft_content = await provider.generate_draft(context)
            new_draft = Draft(
                project_id=project_id,
                content=draft_content,
                citations={"status": "mock_citations"},
                version=1
            )
            session.add(new_draft)
            await session.commit()
            await session.refresh(new_draft)
            logger.info(f"Draft saved with ID: {new_draft.id}")
        except Exception as e:
            logger.error(f"Error generating draft for project {project_id}: {e}")

    if db is not None:
        await _run(db)
    else:
        async with SessionLocal() as session:
            await _run(session)


async def process_summarize_meeting(meeting_id: str, db: AsyncSession):
    """
    Simulates a background worker task that extracts meeting actions from
    a transcript, generates a summary, and flags appropriately.
    """
    logger.info(f"Background task starting: Summarization for meeting {meeting_id}")
    
    # 1. Fetch meeting
    stmt = select(MeetingSession).where(MeetingSession.id == meeting_id)
    result = await db.execute(stmt)
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        logger.error(f"Meeting {meeting_id} not found for summarization.")
        return
        
    provider = get_ai_provider(settings.AI_PROVIDER)
    
    try:
        # 2. Call AI Provider for Summary & Extractions
        summary_text = await provider.generate_summary(meeting.transcript)
        actions = await provider.extract_meeting_actions(meeting.transcript)
        
        # 3. Auto-sync extracted AI tasks into the Task module
        extracted_tasks = actions.get("tasks", [])
        for t in extracted_tasks:
            # Safely create a new Task item
            title = t.get("title")
            assignee = t.get("assignee")
            
            if title:
                description = f"Auto-generated from meeting. Assignee: {assignee}"
                task_create = TaskCreate(
                    title=title,
                    description=description,
                    source=TaskSource.MEETING
                )
                await create_task_service(meeting.user_id, task_create, db)

        # 4. Save to database
        meeting.summary = summary_text
        meeting.action_items = actions
        meeting.status = MeetingStatus.SUMMARIZED
        
        await db.commit()
        logger.info(f"Meeting {meeting_id} summarized and synced successfully.")
        
    except Exception as e:
        logger.error(f"Error summarizing meeting {meeting_id}: {e}")
        meeting.status = MeetingStatus.FAILED
        await db.commit()


async def process_automation_event(user_id: str, trigger_type: TriggerType, payload: dict, db: AsyncSession):
    """
    Simulates a background worker tasked with evaluating automation rules anytime an event is triggered.
    """
    logger.info(f"Background generic event received via Automation engine: Trigger {trigger_type.value} for User {user_id}")
    
    # 1. Fetch matching active rules
    stmt = select(AutomationRule).where(
        AutomationRule.user_id == user_id,
        AutomationRule.trigger_type == trigger_type,
        AutomationRule.is_active == True # noqa
    )
    result = await db.execute(stmt)
    rules = list(result.scalars().all())
    
    if not rules:
        logger.info(f"No active automation rules found for user {user_id} and trigger {trigger_type.value}")
        return
        
    for rule in rules:
        # 2. Evaluate simplistic condition matches
        # If the rule has "condition_json", check if that metadata matches the payload
        condition = rule.condition_json
        matches = True
        
        for key, expected_val in condition.items():
            if payload.get(key) != expected_val:
                matches = False
                break
                
        if matches:
            action = rule.action_json
            action_type = action.get("type")
            
            logger.info(f"Rule {rule.id} matches! Firing action: {action_type}")
            
            if action_type == "CREATE_TASK":
                task_title = action.get("title", f"Automated Task from {trigger_type.value}")
                task_desc = action.get("description", str(payload))
                
                new_task = TaskCreate(
                    title=task_title,
                    description=task_desc,
                    source=TaskSource.AI
                )
                await create_task_service(user_id, new_task, db)
                logger.info(f"Dynamically spun up a new task via automation: {task_title}")
                
            elif action_type == "SEND_NOTIFICATION":
                logger.info(f"[MOCK PUSH NOTIFICATION] Sent: {action.get('message', 'Default Event!')}")
            else:
                logger.info(f"Unknown Action Logic format for rule {rule.id}")

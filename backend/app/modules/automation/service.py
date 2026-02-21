from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.automation import AutomationRule
from app.schemas.automation import RuleCreate


async def create_rule_service(user_id: str, rule_in: RuleCreate, db: AsyncSession) -> AutomationRule:
    new_rule = AutomationRule(
        user_id=user_id,
        trigger_type=rule_in.trigger_type,
        condition_json=rule_in.condition_json,
        action_json=rule_in.action_json,
        is_active=rule_in.is_active
    )
    db.add(new_rule)
    await db.commit()
    await db.refresh(new_rule)
    return new_rule


async def get_rules_service(user_id: str, db: AsyncSession) -> list[AutomationRule]:
    stmt = select(AutomationRule).where(
        AutomationRule.user_id == user_id
    ).order_by(AutomationRule.created_at.desc())
    
    result = await db.execute(stmt)
    rules = list(result.scalars().all())
    return rules

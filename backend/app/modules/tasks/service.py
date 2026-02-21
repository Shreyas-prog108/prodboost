from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


async def create_task_service(user_id: str, task_in: TaskCreate, db: AsyncSession) -> Task:
    new_task = Task(
        user_id=user_id,
        title=task_in.title,
        description=task_in.description,
        due_date=task_in.due_date,
        source=task_in.source
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task


async def get_tasks_service(user_id: str, db: AsyncSession) -> list[Task]:
    stmt = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    result = await db.execute(stmt)
    tasks = list(result.scalars().all())
    return tasks


async def update_task_service(task_id: str, task_in: TaskUpdate, db: AsyncSession) -> Task:
    stmt = select(Task).where(Task.id == task_id)
    result = await db.execute(stmt)
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
        
    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
        
    await db.commit()
    await db.refresh(task)
    return task

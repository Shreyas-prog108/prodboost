from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.task import Task

from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.schemas.response import APIResponse
from app.modules.tasks.service import create_task_service, get_tasks_service, update_task_service


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=APIResponse[TaskResponse])
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = await create_task_service(current_user.id, task_in, db)
    return APIResponse(data=task)


@router.get("/", response_model=APIResponse[list[TaskResponse]])
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tasks = await get_tasks_service(current_user.id, db)
    return APIResponse(data=tasks)


@router.patch("/{id}", response_model=APIResponse[TaskResponse])
async def update_task(
    id: str,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify task exists and belongs to the current user
    stmt = select(Task).where(Task.id == id)
    result = await db.execute(stmt)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this task"
        )

    task = await update_task_service(id, task_in, db)
    return APIResponse(data=task)

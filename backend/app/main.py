import asyncio
from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.modules.auth.router import router as auth_router
from app.modules.research.router import router as research_router
from app.modules.meetings.router import router as meetings_router
from app.modules.tasks.router import router as tasks_router
from app.modules.automation.router import router as automation_router
from app.modules.integrations.router import router as integrations_router
from app.modules.knowledge.router import router as knowledge_router
from app.jobs.worker import worker_loop
from app.core.logging import setup_logging
from app.core.config import settings
from app.core.database import get_db
from app.jobs.queue import redis_client

# Initialize structured JSON logging
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Kick off the Redis background worker loop
    task = asyncio.create_task(worker_loop())
    yield
    # Shutdown: cancel and await the Redis background worker loop
    if not task.done():
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass

app = FastAPI(
    title="ProdBoost API",
    description="Future of Work & Productivity Platform",
    version="1.0.0",
    lifespan=lifespan
)

if settings.ENVIRONMENT == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# Include modules
app.include_router(auth_router)
app.include_router(research_router)
app.include_router(meetings_router)
app.include_router(tasks_router)
app.include_router(automation_router)
app.include_router(integrations_router)
app.include_router(knowledge_router)

# --- Global Exception Handlers ---

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "data": None, "error": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"success": False, "data": None, "error": str(exc)},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import logging
    logging.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "error": "Internal server error"},
    )

@app.get("/health", tags=["health"])
async def health_check(db: AsyncSession = Depends(get_db)):
    health_status = {
        "status": "ok",
        "redis": "unknown",
        "database": "unknown"
    }
    
    # Ping database
    try:
        await db.execute(text("SELECT 1"))
        health_status["database"] = "ok"
    except Exception as e:
        health_status["database"] = "down"
        health_status["status"] = "degraded"
        import logging
        logging.error(f"Database health check failed: {e}")

    # Ping Redis
    try:
        await redis_client.ping()
        health_status["redis"] = "ok"
    except Exception as e:
        health_status["redis"] = "down"
        health_status["status"] = "degraded"
        import logging
        logging.error(f"Redis health check failed: {e}")
        
    if health_status["status"] != "ok":
        return JSONResponse(
            status_code=503,
            content={"success": False, "data": health_status, "error": "Service Degraded"}
        )

    return {"success": True, "data": health_status, "error": None}

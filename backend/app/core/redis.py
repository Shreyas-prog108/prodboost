from upstash_redis import Redis
from fastapi import HTTPException, status
from app.core.config import settings

redis_client = Redis(
    url=settings.UPSTASH_REDIS_REST_URL,
    token=settings.UPSTASH_REDIS_REST_TOKEN,
)

def check_rate_limit(key: str, limit: int = 5, window: int = 60):
    """
    Basic rate limiting using Upstash Redis.
    Allows `limit` requests per `window` seconds.
    """
    try:
        current = redis_client.get(key)
        if current and int(current) >= limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        
        pipe = redis_client.pipeline()
        pipe.incr(key)
        pipe.expire(key, window)
        pipe.exec()
    except HTTPException:
        raise
    except Exception as e:
        # In case Redis fails, we might want to allow the request to pass
        # or log the error. For now, we just pass.
        pass

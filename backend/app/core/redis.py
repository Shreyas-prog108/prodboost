from upstash_redis import Redis
import logging
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
        # Log the Redis error so it is visible in monitoring.
        # We allow the request to pass rather than blocking users during Redis outages,
        # but this should be investigated if it occurs frequently.
        logging.getLogger(__name__).error(
            f"Rate limit check failed (Redis error) for key '{key}': {e}"
        )

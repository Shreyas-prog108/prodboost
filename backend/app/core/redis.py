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

    Fail-closed: if Redis is unavailable, the request is rejected with 503
    rather than silently allowed. This prevents an outage from removing all
    rate-limit protection on auth endpoints.
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
        logging.getLogger(__name__).error(
            f"Rate limit check failed (Redis error) for key '{key}': {e}"
        )
        # Fail closed: block the request when we cannot verify the rate limit.
        # This prevents a Redis outage from silently disabling all auth protection.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service temporarily unavailable. Please try again shortly.",
        )

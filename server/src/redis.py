import json
from typing import Any, Optional

from upstash_redis import Redis

from src import logger
from src.config import secrets


# --- Redis Cache Configuration ---
# Caching is an optimisation, never a requirement. If Upstash is not configured
# (or is failing), every helper below degrades to a no-op / cache miss so that
# request handlers still serve from MongoDB instead of returning a 500.
redis: Optional[Redis] = None

if secrets.redis_enabled:
    try:
        redis = Redis(
            url=secrets.UPSTASH_REDIS_REST_URL,
            token=secrets.UPSTASH_REDIS_REST_TOKEN,
        )
    except Exception as exc:  # pragma: no cover - construction rarely fails
        logger.warning("Redis unavailable, continuing without cache: %s", exc)
else:
    logger.info("Upstash Redis not configured; caching disabled.")


def cache_set(key: str, value: Any, expire: int = 3600) -> None:
    """
    Set a key-value pair in Redis with an optional expiry time.

    Args:
        key (str): The Redis key.
        value: The value to store (will be serialized to JSON).
        expire (int, optional): Expiration time in seconds. Defaults to 3600.
    """
    if redis is None:
        return
    try:
        redis.set(key, json.dumps(value, default=str), ex=expire)
    except Exception as exc:
        logger.warning("cache_set failed for %s: %s", key, exc)


def cache_get(key: str) -> Any:
    """
    Retrieve a value from Redis by key.

    Args:
        key (str): The Redis key.

    Returns:
        The deserialized Python object if found, otherwise None.
    """
    if redis is None:
        return None
    try:
        val = redis.get(key)
    except Exception as exc:
        logger.warning("cache_get failed for %s: %s", key, exc)
        return None
    if val:
        try:
            return json.loads(val)
        except (TypeError, ValueError):
            logger.warning("Discarding corrupt cache entry for %s", key)
    return None


def cache_delete(key: str) -> None:
    """
    Delete a key from Redis.

    Args:
        key (str): The Redis key to delete.
    """
    if redis is None:
        return
    try:
        redis.delete(key)
    except Exception as exc:
        logger.warning("cache_delete failed for %s: %s", key, exc)

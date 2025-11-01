import json
from upstash_redis import Redis
from src.config import secrets


# --- Redis Cache Configuration ---
redis = Redis(
    url=secrets.UPSTASH_REDIS_REST_URL,
    token=secrets.UPSTASH_REDIS_REST_TOKEN,
)


def cache_set(key: str, value, expire: int = 3600) -> None:
    """
    Set a key-value pair in Redis with an optional expiry time.

    Args:
        key (str): The Redis key.
        value: The value to store (will be serialized to JSON).
        expire (int, optional): Expiration time in seconds. Defaults to 3600.
    """
    redis.set(key, json.dumps(value, default=str), ex=expire)


def cache_get(key: str):
    """
    Retrieve a value from Redis by key.

    Args:
        key (str): The Redis key.

    Returns:
        The deserialized Python object if found, otherwise None.
    """
    val = redis.get(key)
    if val:
        return json.loads(val)
    return None


def cache_delete(key: str) -> None:
    """
    Delete a key from Redis.

    Args:
        key (str): The Redis key to delete.
    """
    redis.delete(key)

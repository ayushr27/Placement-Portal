import json
from src.config import secrets
from celery import Celery
from upstash_redis import Redis
import ssl

redis = Redis(
    url=secrets.UPSTASH_REDIS_REST_URL,
    token=secrets.UPSTASH_REDIS_REST_TOKEN
)

celery = Celery(
    "worker",
    broker=secrets.CELERY_REDIS_URL,
    backend=secrets.CELERY_REDIS_URL,
)

celery.conf.update(
    broker_use_ssl={
        "ssl_cert_reqs": ssl.CERT_NONE,
    },
    redis_backend_use_ssl={
        "ssl_cert_reqs": ssl.CERT_NONE,
    },
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kolkata",
    enable_utc=True,
)


def cache_set(key: str, value, expire: int = 3600):
    """Set a key in Redis with optional expiry (default: 1 hour)."""
    redis.set(key, json.dumps(value, default=str), ex=expire)


    
def cache_get(key: str):
    """Get a key from Redis (returns Python dict if JSON)."""
    val = redis.get(key)
    if val:
        return json.loads(val)
    return None


def cache_delete(key: str):
    """Delete a cache key."""
    redis.delete(key)

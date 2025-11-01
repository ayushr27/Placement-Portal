from src.config import secrets
from celery import Celery
from upstash_redis import Redis

redis = Redis(
    url=secrets.UPSTASH_REDIS_REST_URL,
    token=secrets.UPSTASH_REDIS_REST_TOKEN
)

celery = Celery(
    "worker",
    broker=secrets.CELERY_REDIS_URL,
    backend=secrets.CELERY_REDIS_URL
)

celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kolkata",
    enable_utc=True,
)
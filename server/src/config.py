from pydantic_settings import BaseSettings


class Secrets(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "testdb"
    JWT_HASH_KEY: str = "test-secret"
    MAIL_USERNAME: str = "test@example.com"
    MAIL_PASSWORD: str = "password"
    UPSTASH_REDIS_REST_URL: str = "http://localhost:6379"
    UPSTASH_REDIS_REST_TOKEN: str = "dummy"
    CELERY_REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"


secrets = Secrets()
CACHING_EXPIRE_TIME_SEC = 60
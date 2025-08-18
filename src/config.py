from pydantic_settings import BaseSettings, SettingsConfigDict


class Secrets(BaseSettings):
    MONGODB_URL: str
    DATABASE_NAME: str
    JWT_HASH_KEY: str
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    UPSTASH_REDIS_REST_URL: str
    UPSTASH_REDIS_REST_TOKEN: str
    CELERY_REDIS_URL: str

    model_config = SettingsConfigDict(env_file=".env")


secrets = Secrets()
CACHING_EXPIRE_TIME_SEC = 60
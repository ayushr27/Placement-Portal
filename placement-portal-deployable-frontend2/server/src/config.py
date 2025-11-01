from pydantic_settings import BaseSettings


class Secrets(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "testdb"
    JWT_HASH_KEY: str = "test-secret"
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
    UPSTASH_REDIS_REST_URL: str = "http://localhost:6379"
    UPSTASH_REDIS_REST_TOKEN: str = "dummy"
    CELERY_REDIS_URL: str = "redis://localhost:6379/0"
    GOOGLE_CLIENT_ID: str = "abc.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET: str = "jhcbajb"
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"
    MAIL_PASSWORD: str = "password"
    MAIL_USERNAME: str = "test@example.com"
    APPS_SCRIPT_URL: str = "https://script.google.com/macros/s/abc/exec"
    PUSHER_APP_ID: str = "212345"
    PUSHER_KEY: str = "xbjcvjfcvjcbaxvbcjvb"
    PUSHER_SECRET: str = "bcjzvcjzvxcjvbsjhcbv"

    class Config:
        env_file = ".env"


secrets = Secrets()
CACHING_EXPIRE_TIME_SEC = 3600

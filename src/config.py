from pydantic_settings import BaseSettings

class Secrets(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "testdb"
    JWT_HASH_KEY: str = "test-secret"


    MAIL_USERNAME: str = "test@example.com"
    MAIL_PASSWORD: str = "password"
    MAIL_FROM: str = "test@example.com"
    MAIL_FROM_NAME: str = "Test Mailer"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.example.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    UPSTASH_REDIS_REST_URL: str = "http://localhost:6379"
    UPSTASH_REDIS_REST_TOKEN: str = "dummy"
    CELERY_REDIS_URL: str = "redis://localhost:6379/0"


    GOOGLE_CLIENT_ID: str = "fcish"
    GOOGLE_CLIENT_SECRET: str = "jhcbajb"
    GOOGLE_REDIRECT_URI: str = "https://jcgsdj"

    class Config:
        env_file = ".env"


secrets = Secrets()
CACHING_EXPIRE_TIME_SEC = 60

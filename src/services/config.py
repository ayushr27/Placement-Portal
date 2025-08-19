
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MONGODB_URL: str
    DATABASE_NAME: str 
    JWT_HASH_KEY: str  
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    USE_CREDENTIALS: bool
    VALIDATE_CERTS: bool
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str


    model_config = SettingsConfigDict(env_file=".env")
settings = Settings()
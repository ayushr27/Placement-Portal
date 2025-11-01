from pydantic_settings import BaseSettings, SettingsConfigDict


class Secrets(BaseSettings):
    MONGODB_URL: str
    DATABASE_NAME: str
    JWT_HASH_KEY: str
    MAIL_USERNAME: str
    MAIL_PASSWORD: str

    model_config = SettingsConfigDict(env_file=".env")


secrets = Secrets()


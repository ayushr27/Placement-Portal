from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Secrets(BaseSettings):
    """
    Application settings.

    Values marked required have no default on purpose: a missing one raises at
    import time instead of silently falling back to a localhost/placeholder
    value and failing later as an opaque 500 during login.
    """

    # --- Required: the app cannot work without these ---
    MONGODB_URL: str
    DATABASE_NAME: str
    JWT_HASH_KEY: str

    # --- Access control ---
    # Comma-separated list of allowed browser origins for CORS.
    CORS_ORIGINS: str = ""
    # Shared secret required to create the first admin via POST /register/admin.
    # Empty disables the endpoint entirely.
    BOOTSTRAP_SECRET: str = ""

    # --- Optional integrations: features degrade, app still boots ---
    UPSTASH_REDIS_REST_URL: str = ""
    UPSTASH_REDIS_REST_TOKEN: str = ""

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google-callback"

    APPS_SCRIPT_URL: str = ""
    # Shared secret sent to the Apps Script web app. The script must be deployed
    # with "Who has access: Anyone" for the backend to reach it without Google
    # credentials, so the URL alone is the only thing standing between a
    # stranger and creating spreadsheets in - or repointing forms belonging to -
    # the owner's Drive. This turns the URL into an authenticated endpoint.
    APPS_SCRIPT_TOKEN: str = ""

    # Swagger/ReDoc publish the whole admin API surface. Off unless asked for.
    ENABLE_DOCS: bool = False

    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    @field_validator("JWT_HASH_KEY")
    @classmethod
    def _reject_weak_jwt_key(cls, v: str) -> str:
        if v in {"secret", "test-secret", "changeme", ""}:
            raise ValueError(
                "JWT_HASH_KEY is a known placeholder. Generate a real one with: "
                "openssl rand -hex 32"
            )
        if len(v) < 32:
            raise ValueError("JWT_HASH_KEY must be at least 32 characters.")
        return v

    @property
    def cors_origin_list(self) -> List[str]:
        """CORS_ORIGINS parsed into a list, empty entries dropped."""
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def redis_enabled(self) -> bool:
        return bool(self.UPSTASH_REDIS_REST_URL and self.UPSTASH_REDIS_REST_TOKEN)

    @property
    def mail_enabled(self) -> bool:
        return bool(self.MAIL_USERNAME and self.MAIL_PASSWORD)

    class Config:
        env_file = ".env"


secrets = Secrets()
CACHING_EXPIRE_TIME_SEC = 3600

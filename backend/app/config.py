"""Read-only environment-bound application configuration."""
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    environment: str
    port: int
    frontend_origin: str
    database_url: str
    redis_url: str


def load_settings() -> Settings:
    port = int(os.getenv("PORT", "8000"))
    if port < 1 or port > 65535:
        raise ValueError("PORT must be between 1 and 65535")
    return Settings(
        environment=os.getenv("APP_ENV", "development"),
        port=port,
        frontend_origin=os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
        database_url=os.getenv("DATABASE_URL", ""),
        redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    )

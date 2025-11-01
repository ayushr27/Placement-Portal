from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from src.config import secrets  # Import from your config file

client = AsyncIOMotorClient(secrets.MONGODB_URL)
database = client[secrets.DATABASE_NAME]


def get_database() -> AsyncIOMotorDatabase:
    return database

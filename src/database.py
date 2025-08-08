from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from src.services.config import settings  # Import from your config file

client = AsyncIOMotorClient(settings.MONGODB_URL)
database = client[settings.DATABASE_NAME]

def get_database() -> AsyncIOMotorDatabase:
    return database
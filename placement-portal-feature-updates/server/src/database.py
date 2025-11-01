import json
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional, Any, Dict
from src.config import secrets, CACHING_EXPIRE_TIME_SEC
from src.redis import redis


client = AsyncIOMotorClient(
    secrets.MONGODB_URL,
    maxPoolSize=200,            # Allow up to 200 concurrent connections
    minPoolSize=10,             # Keep a few ready for quick access
    serverSelectionTimeoutMS=5000,  # Fast fail if MongoDB unavailable
    connectTimeoutMS=10000,     # Timeout for initial connection (10s)
    socketTimeoutMS=20000,      # Timeout for read/write (20s)
    retryWrites=True,           # Enable retryable writes
    appname="FastAPIApp"        # Helpful for MongoDB monitoring tools
)
database = client[secrets.DATABASE_NAME]


def get_database() -> AsyncIOMotorDatabase:
    return database


async def get_collection_cached(
    collection_name: str,
    query: Dict[str, Any],
    expire: int = CACHING_EXPIRE_TIME_SEC
) -> Optional[list]:
    """
    Get documents from MongoDB with Redis caching.
    """
    key = f"cache:{collection_name}:{json.dumps(query, sort_keys=True)}"

    cached = await redis.get(key)
    if cached:
        return json.loads(cached)

    collection = database[collection_name]
    docs = await collection.find(query).to_list(length=None)

    await redis.set(key, json.dumps(docs), ex=expire)

    return docs
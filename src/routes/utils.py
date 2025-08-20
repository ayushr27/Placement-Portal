import bcrypt
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from src.config import secrets
from src.routes.schemas import TokenRequest
from src.database import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")
ALGORITHM = "HS256"


from datetime import datetime
import pytz
ist = pytz.timezone('Asia/Kolkata')
async def get_user_from_collection(db: AsyncIOMotorDatabase, username: str, role: str):
    if role == "student":
        user = await db.students.find_one({"$or": [{"username": username}, {"email": username}]})
    elif role == "admin":
        user = await db.admins.find_one({"$or": [{"username": username}, {"email": username}]})
    else:
        user = None

        if user:
            user["id"] = str(user["_id"])
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )


async def get_user(
    username: str,
    db: AsyncIOMotorDatabase
) -> Optional[Dict[str, Any]]:
    try:
        user = await db.students.find_one({
            "$or": [{"username": username}, {"email": username}]
        })
        if user:
            user["id"] = str(user["_id"])
            user["role"] = "student"
            return user

        user = await db.admins.find_one({
            "$or": [{"username": username}, {"email": username}]
        })
        if user:
            user["id"] = str(user["_id"])
            user["role"] = "admin"
            return user

        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )


class Security:
    def __init__(self) -> None:
        self.secret_key = secrets.JWT_HASH_KEY
        self.algorithm = ALGORITHM

    def hash_password(self, password: str) -> str:
        try:
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
            return hashed.decode("utf-8")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Password hashing error: {str(e)}"
            )

    def verify_password(
        self,
        plain_password: str,
        hashed_password: str
    ) -> bool:
        try:
            return bcrypt.checkpw(
                plain_password.encode("utf-8"),
                hashed_password.encode("utf-8")
            )
        except Exception:
            return False

    def create_access_token(
        self,
        data: dict,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        try:
            to_encode = data.copy()
            expire = datetime.now(timezone.utc) + (
                expires_delta or timedelta(minutes=30)
            )
            to_encode.update({"exp": expire})
            return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Token creation error: {str(e)}"
            )

    def decode_token(self, token: str) -> Dict[str, Any]:
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

    async def authenticate_user(
        self,
        db: AsyncIOMotorDatabase,
        credentials: TokenRequest
    ) -> Optional[Dict[str, Any]]:
        try:
            user = await get_user(credentials.username, db)
            if not user:
                return None
            if not self.verify_password(credentials.password, user["hashed_password"]):
                return None
            return user
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Authentication error: {str(e)}"
            )

    async def get_current_user(
        self,
        token: str = Depends(oauth2_scheme),
        db: AsyncIOMotorDatabase = Depends(get_database)
    ) -> Dict[str, Any]:
        payload = self.decode_token(token)
        username: str = payload.get("sub")
        role: str = payload.get("role")

        if not username or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = await get_user_from_collection(db, username, role)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user


security = Security()

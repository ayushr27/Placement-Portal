from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from src.routes.utils import security

from src.database import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_database)):  # add db dependency
    payload = security.decode_token(token)
    username = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = await get_user_by_username(username=username, db=db)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.routes.schemas import TokenResponse, PasswordResetSchema
from src.routes.utils import get_user
from src.routes.utils import security
from src.database import get_database

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/token", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user = await get_user(form_data.username, db)
    if not user or not security.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = security.create_access_token(data={
        "sub": user["username"],  
        "role": user.get("role", "student")
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "is_first_login": user.get("is_first_login", True)
    }

@router.post("/reset-password")
async def reset_password(
    password_data: PasswordResetSchema,
    current_user: dict = Depends(security.get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    
    role = current_user.get("role", "student")
    username = current_user.get("username")

    collection_name = "students" if role == "student" else "admins"
    user = await db[collection_name].find_one({"username": username})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check old password
    if not security.verify_password(password_data.old_password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Old password incorrect")

    # Update new password
    hashed_new = security.hash_password(password_data.new_password)
    await db[collection_name].update_one(
        {"username": username},
        {"$set": {"hashed_password": hashed_new, "is_first_login": False}}
    )

    return {"status": "Password updated successfully"}

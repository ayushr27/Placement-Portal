# src/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase

from src.routes.schemas import TokenResponse, PasswordResetSchema
from src.database import get_database
from src.routes.utils import security
from src.services import auth as auth_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/token", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await auth_service.login_user(form_data.username, form_data.password, db)

@router.post("/reset-password")
async def reset_password(
    password_data: PasswordResetSchema,
    current_user: dict = Depends(security.get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await auth_service.reset_user_password(
        username=current_user.get("username"),
        role=current_user.get("role", "student"),
        old_password=password_data.old_password,
        new_password=password_data.new_password,
        db=db,
    )

@router.post("/forgot-password/request")
async def forgot_password_request(email: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    return await auth_service.forgot_password_request_service(email, db)

@router.post("/forgot-password/verify")
async def forgot_password_verify(email: str, otp: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    return await auth_service.forgot_password_verify_service(email, otp, db)

@router.post("/forgot-password/reset")
async def forgot_password_reset(new_password: str, token: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    return await auth_service.forgot_password_reset_service(new_password, token, db)

@router.get("/google-login")
async def google_login():
    return {"auth_url": auth_service.get_google_auth_url()}

@router.get("/google-callback")
async def google_callback(code: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    After Google redirects back with ?code=...
    """
    return await auth_service.handle_admin_google_callback(code, db)

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.routes.schemas import TokenResponse, PasswordResetSchema
from src.routes.utils import security
from src.database import get_database
from src.services import auth as auth_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/token", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    try:
        user = await auth_service.authenticate_user(
            form_data.username, form_data.password, db
        )
        token = security.create_access_token(
            data={"sub": user["username"], "role": user.get("role", "student")}
        )
        return {
            "access_token": token,
            "token_type": "bearer",
            "is_first_login": user.get("is_first_login", True),
        }
    except HTTPException:
        # service-layer(client-side) HTTPExceptions aane de
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred in /login route.",
        ) from e


@router.post("/reset-password")
async def reset_password(
    password_data: PasswordResetSchema,
    current_user: dict = Depends(security.get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    try:
        return await auth_service.reset_user_password(password_data, current_user, db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred in /reset-passowrd route.",
        ) from e

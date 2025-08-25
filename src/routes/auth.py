# src/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase

from src.routes.schemas import TokenResponse, PasswordResetSchema
from src.database import get_database
from src.routes.utils import security
from src.services import auth as auth_service
from src import logger

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/token", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    try:
        return await auth_service.login_user(
            form_data.username, form_data.password, db
        )
    except ValueError as e:
        logger.warning(f"Login failed for {form_data.username}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed due to server error",
        )


@router.post("/reset-password")
async def reset_password(
    password_data: PasswordResetSchema,
    current_user: dict = Depends(security.get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    try:
        return await auth_service.reset_user_password(
            username=current_user.get("username"),
            role=current_user.get("role", "student"),
            old_password=password_data.old_password,
            new_password=password_data.new_password,
            db=db,
        )
    except PermissionError as e:
        logger.warning(f"Permission denied for {current_user}: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except ValueError as e:
        logger.warning(f"Invalid password reset attempt for {current_user}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected error during password reset: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset failed due to server error",
        )


@router.post("/forgot-password/request")
async def forgot_password_request(
    email: str, db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        return await auth_service.forgot_password_request_service(email, db)
    except ValueError as e:
        logger.warning(f"Forgot password request failed for {email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected error during forgot password request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process forgot password request",
        )


@router.post("/forgot-password/verify")
async def forgot_password_verify(
    email: str, otp: str, db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        return await auth_service.forgot_password_verify_service(email, otp, db)
    except ValueError as e:
        logger.warning(f"OTP verification failed for {email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected error during OTP verification for {email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OTP verification failed",
        )


@router.post("/forgot-password/reset")
async def forgot_password_reset(
    new_password: str, token: str, db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        return await auth_service.forgot_password_reset_service(new_password, token, db)
    except ValueError as e:
        logger.warning(f"Password reset with token failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected error during password reset with token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset with token failed",
        )


@router.get("/google-login")
async def google_login():
    try:
        return {"auth_url": auth_service.get_google_auth_url()}
    except Exception as e:
        logger.error(f"Failed to generate Google login URL: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate Google login URL",
        )


@router.get("/google-callback")
async def google_callback(
    code: str, db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    After Google redirects back with ?code=...
    """
    try:
        return await auth_service.handle_admin_google_callback(code, db)
    except ValueError as e:
        logger.warning(f"Google callback failed with invalid code {code}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected error during Google callback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google callback handling failed",
        )

import hmac
from typing import Optional

from fastapi import (
    APIRouter, UploadFile, File, Depends, HTTPException, status, BackgroundTasks, Header
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.config import secrets as app_secrets
from src.services.register import process_student_csv, create_admin
from src.database import get_database
from src.routes.utils import security, get_user_from_collection
from src.services.schemas import AdminCreate
from src.redis import cache_delete  # import redis utils
router = APIRouter(prefix="/register", tags=["Registration"])


async def _authorize_admin_creation(
    db: AsyncIOMotorDatabase,
    bootstrap_secret: Optional[str],
    authorization: Optional[str],
) -> None:
    """
    Guard admin creation.

    This endpoint used to be completely unauthenticated, which let anyone grant
    themselves admin. Now: while no admin exists, a matching BOOTSTRAP_SECRET
    header is required to seed the first one; once one exists, only a logged-in
    admin may create more.
    """
    has_admin = await db.admins.count_documents({}, limit=1) > 0

    if not has_admin:
        if not app_secrets.BOOTSTRAP_SECRET:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin bootstrap is disabled. Set BOOTSTRAP_SECRET to seed "
                       "the first admin.",
            )
        if not bootstrap_secret or not hmac.compare_digest(
            bootstrap_secret, app_secrets.BOOTSTRAP_SECRET
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid bootstrap secret",
            )
        return

    # An admin already exists: require a valid admin bearer token.
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = security.decode_token(authorization.split(" ", 1)[1].strip())
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create admins",
        )

    caller = await get_user_from_collection(db, payload.get("sub"), "admin")
    if not caller:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/upload-csv")
async def upload_student_csv(
    background_tasks: BackgroundTasks,
    csv_file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    """
    Upload and process a student CSV file.

    Raises:
        HTTPException: 403 if user is not admin.
        HTTPException: 400 if file is not a CSV.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can upload CSV files"
        )

    if not csv_file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a valid CSV file"
        )

    file_bytes = await csv_file.read()
    result = await process_student_csv(db=db, file_bytes=file_bytes, background_tasks=background_tasks)
    cache_delete("students:all")
    return result


@router.post("/admin")
async def create_admin_user(
    admin_data: AdminCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    x_bootstrap_secret: Optional[str] = Header(None, alias="X-Bootstrap-Secret"),
    authorization: Optional[str] = Header(None),
):
    """
    Create a new admin user (password login still works)
    Google login can later be linked for Sheets access.

    Requires the X-Bootstrap-Secret header while no admin exists, and an admin
    bearer token thereafter.
    """
    await _authorize_admin_creation(db, x_bootstrap_secret, authorization)
    result = await create_admin(db, admin_data.model_dump())
    cache_delete("admins:all")
    return result

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

# A student row is ~100 bytes, so 5MB is roughly 50,000 students - far beyond
# any real intake, while still bounding what a single request can allocate.
MAX_CSV_BYTES = 5 * 1024 * 1024
CSV_CHUNK_SIZE = 64 * 1024


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

    if not (csv_file.filename or "").lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a valid CSV file"
        )

    # The whole file was read into memory with no ceiling, so a large upload
    # could exhaust the function's memory before any parsing happened. Read in
    # chunks and stop as soon as the limit is passed.
    chunks = []
    total = 0
    while chunk := await csv_file.read(CSV_CHUNK_SIZE):
        total += len(chunk)
        if total > MAX_CSV_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=(
                    f"CSV is larger than {MAX_CSV_BYTES // (1024 * 1024)}MB. "
                    f"Split it and upload in batches."
                ),
            )
        chunks.append(chunk)
    file_bytes = b"".join(chunks)

    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CSV is empty",
        )
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

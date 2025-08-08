from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.services.register import process_student_csv, create_admin
from src.database import get_database
from src.routes.utils import security
from src.services.schemas import AdminCreate


router = APIRouter(prefix="/register", tags=["Registration"])


@router.post("/upload-csv")
async def upload_student_csv(
    csv_file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user)
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
    result = await process_student_csv(db, file_bytes)
    return result


@router.post("/admin")
async def create_admin_user(
    admin_data: AdminCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Create a new admin user.
    """
    result = await create_admin(db, admin_data.dict())
    return result

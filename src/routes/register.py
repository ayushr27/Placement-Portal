from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.services.register import process_student_csv, create_admin
from src.database import get_database
from src.routes.utils import security
from src.services.schemas import AdminCreate
from src.services.register import  process_student_csv
import csv
import io


router = APIRouter(prefix="/register", tags=["Registration"])


@router.post("/upload-csv")
async def upload_student_csv(
    csv_file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user)
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can upload CSV files")

    if not csv_file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a valid CSV file")

    file_bytes = await csv_file.read()
    result = await process_student_csv(db, file_bytes)
    return result
@router.post("/admin")
async def create_admin_user(
    admin_data: AdminCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new admin user (for initial setup)"""
    result = await create_admin(db, admin_data.dict())
    return result

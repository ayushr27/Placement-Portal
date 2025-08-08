from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.routes.utils import security
from src.routes.schemas import TokenRequest, TokenResponse, UserResponseStudent , UserResponseAdmin
router = APIRouter(prefix="/profile", tags=["Profiles"])

@router.get("/student/me", response_model=UserResponseStudent)
async def get_student_profile(current_user: dict = Depends(security.get_current_user)):
    if current_user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Access denied: Only students can access this endpoint")
    return {
        "id": current_user.get("id"),
        "name": current_user.get("name"),
        "gender": current_user.get("gender"),
        "email": current_user.get("email"),
        "username": current_user.get("username", current_user.get("email")),
        "roll_number": current_user.get("roll_number"),
        "branch": current_user.get("branch"),
        "course": current_user.get("course"),
        "year": current_user.get("year"),
        "phone_no": current_user.get("phone_no"),
        "role": current_user.get("role", "student"),
    }

@router.get("/admin/me", response_model=UserResponseAdmin)
async def get_admin_profile(current_user: dict = Depends(security.get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied: Only admin can access this endpoint")
    return {
        "id": current_user.get("id"),
        "username": current_user.get("username", current_user.get("email")),
        "role": current_user.get("role", "admin"),
        "name": current_user.get("name"),
        "email": current_user.get("email"),
    }
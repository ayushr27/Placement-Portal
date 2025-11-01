
from bson.regex import Regex
from fastapi import APIRouter, Depends, HTTPException, Path, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from src.database import get_database
from src.redis import cache_delete, cache_get, cache_set
from src.routes.schemas import (
    StudentEditProfile,
    UserResponseAdmin,
    UserResponseStudent,
)
from src.routes.utils import security

router = APIRouter(prefix="/profile", tags=["Profiles"])


@router.get("/student/me", response_model=UserResponseStudent)
async def get_student_profile(current_user: dict = Depends(security.get_current_user)):
    """
    Retrieve the current student's profile.
    Uses Redis caching for faster repeated access.
    """
    if current_user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Only students can access this endpoint",
        )

    cache_key = f"profile:student:{current_user.get('_id')}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    profile = {
        "_id": str(current_user.get("_id")),
        "name": current_user.get("name"),
        "gender": current_user.get("gender"),
        "email": current_user.get("email"),
        "username": current_user.get("username", current_user.get("email")),
        "date_of_birth": current_user.get("date_of_birth"),
        "roll_number": current_user.get("roll_number"),
        "branch": current_user.get("branch"),
        "course": current_user.get("course"),
        "batch": current_user.get("batch"),
        "phone_no": current_user.get("phone_no"),
        "role": current_user.get("role", "student"),
        "career_path": current_user.get("career_path"),
        "resume_link": current_user.get("resume_link"),
        "aadhar_card_link": current_user.get("aadhar_card_link"),
        "pan_card_link": current_user.get("pan_card_link"),
        "github_link": current_user.get("github_link"),
        "linkedin_link": current_user.get("linkedin_link"),
        "current_address": current_user.get("current_address"),
        "permanent_address": current_user.get("permanent_address"),
        "ssc_cgpa": current_user.get("ssc_cgpa"),
        "hsc_cgpa": current_user.get("hsc_cgpa"),
        "btech_cgpa": current_user.get("btech_cgpa"),
        "mtech_cgpa": current_user.get("mtech_cgpa"),
        "backlogs": current_user.get("backlogs", 0),
        "has_edited_profile": current_user.get("has_edited_profile", False),
    }

    # Save to redis with TTL (1 hour)
    cache_set(cache_key, profile, expire=3600)
    return profile


@router.get("/admin/me", response_model=UserResponseAdmin)
async def get_admin_profile(current_user: dict = Depends(security.get_current_user)):
    """
    Retrieve the current admin's profile.
    Uses Redis caching for faster repeated access.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Only admin can access this endpoint",
        )

    cache_key = f"profile:admin:{current_user.get('id')}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    profile = {
        "id": current_user.get("id"),
        "username": current_user.get("username", current_user.get("email")),
        "role": current_user.get("role", "admin"),
        "name": current_user.get("name"),
        "email": current_user.get("email"),
    }

    cache_set(cache_key, profile, expire=3600)
    return profile


@router.put("/admin/student_update/{roll_number}", response_model=UserResponseStudent)
async def admin_update_student_profile(
    update: StudentEditProfile,
    roll_number: str = Path(..., description="Roll number of the student to update"),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    update_data = {
        k: v for k, v in update.model_dump(exclude_unset=True).items() if v is not None
    }
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    result = await db.students.update_one(
        {"roll_number": Regex(f"^{roll_number}$", "i")}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    cache_delete(f"profile:student:{roll_number}")

    updated_student = await db.students.find_one(
        {"roll_number": Regex(f"^{roll_number}$", "i")}
    )
    profile_response = {
        "_id": str(updated_student["_id"]),
        "name": updated_student.get("name"),
        "gender": updated_student.get("gender"),
        "email": updated_student.get("email"),
        "username": updated_student.get("username", updated_student.get("email")),
        "roll_number": updated_student.get("roll_number"),
        "date_of_birth": updated_student.get("date_of_birth"),
        "branch": updated_student.get("branch"),
        "course": updated_student.get("course"),
        "batch": updated_student.get("batch"),
        "phone_no": updated_student.get("phone_no"),
        "role": updated_student.get("role", "student"),
        "career_path": updated_student.get("career_path"),
        "resume_link": updated_student.get("resume_link"),
        "aadhar_card_link": updated_student.get("aadhar_card_link"),
        "pan_card_link": updated_student.get("pan_card_link"),
        "github_link": updated_student.get("github_link"),
        "linkedin_link": updated_student.get("linkedin_link"),
        "current_address": updated_student.get("current_address"),
        "permanent_address": updated_student.get("permanent_address"),
        "ssc_cgpa": updated_student.get("ssc_cgpa"),
        "hsc_cgpa": updated_student.get("hsc_cgpa"),
        "btech_cgpa": updated_student.get("btech_cgpa"),
        "mtech_cgpa": updated_student.get("mtech_cgpa"),
        "backlogs": updated_student.get("backlogs", 0),
        "has_edited_profile": updated_student.get("has_edited_profile", False),
    }
    return UserResponseStudent(**profile_response)


@router.put("/student/update", response_model=UserResponseStudent)
async def update_student_profile(
    update: StudentEditProfile = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    if current_user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    roll_number = current_user.get("roll_number")
    student = await db.students.find_one(
        {"roll_number": Regex(f"^{roll_number}$", "i")}
    )
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if student.get("has_edited_profile", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Profile can only be edited once. "
                "Contact Training and Placement Cell for further changes."
            ),
        )

    update_data = update.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    update_data["has_edited_profile"] = True
    result = await db.students.update_one(
        {"roll_number": Regex(f"^{roll_number}$", "i")}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    cache_delete(f"profile:student:{roll_number}")

    updated_student = await db.students.find_one(
        {"roll_number": Regex(f"^{roll_number}$", "i")}
    )
    profile_response = {
        "_id": str(updated_student["_id"]),
        "name": updated_student.get("name"),
        "gender": updated_student.get("gender"),
        "email": updated_student.get("email"),
        "username": updated_student.get("username", updated_student.get("email")),
        "roll_number": updated_student.get("roll_number"),
        "date_of_birth": updated_student.get("date_of_birth"),
        "branch": updated_student.get("branch"),
        "course": updated_student.get("course"),
        "batch": updated_student.get("batch"),
        "phone_no": updated_student.get("phone_no"),
        "role": updated_student.get("role", "student"),
        "career_path": updated_student.get("career_path"),
        "resume_link": updated_student.get("resume_link"),
        "aadhar_card_link": updated_student.get("aadhar_card_link"),
        "pan_card_link": updated_student.get("pan_card_link"),
        "github_link": updated_student.get("github_link"),
        "linkedin_link": updated_student.get("linkedin_link"),
        "current_address": updated_student.get("current_address"),
        "permanent_address": updated_student.get("permanent_address"),
        "ssc_cgpa": updated_student.get("ssc_cgpa"),
        "hsc_cgpa": updated_student.get("hsc_cgpa"),
        "btech_cgpa": updated_student.get("btech_cgpa"),
        "mtech_cgpa": updated_student.get("mtech_cgpa"),
        "backlogs": updated_student.get("backlogs", 0),
        "has_edited_profile": updated_student.get("has_edited_profile", True),
    }
    return UserResponseStudent(**profile_response)


@router.get("/admin/student/{roll_number}", response_model=UserResponseStudent)
async def get_student_profile_by_admin(
    roll_number: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    student = await db.students.find_one(
        {"roll_number": Regex(f"^{roll_number}$", "i")}
    )
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    profile_response = {
        "_id": str(student["_id"]),
        "name": student.get("name"),
        "gender": student.get("gender"),
        "email": student.get("email"),
        "username": student.get("username", student.get("email")),
        "roll_number": student.get("roll_number"),
        "date_of_birth": student.get("date_of_birth"),
        "branch": student.get("branch"),
        "course": student.get("course"),
        "batch": student.get("batch"),
        "phone_no": student.get("phone_no"),
        "role": student.get("role", "student"),
        "career_path": student.get("career_path"),
        "resume_link": student.get("resume_link"),
        "aadhar_card_link": student.get("aadhar_card_link"),
        "pan_card_link": student.get("pan_card_link"),
        "github_link": student.get("github_link"),
        "linkedin_link": student.get("linkedin_link"),
        "current_address": student.get("current_address"),
        "permanent_address": student.get("permanent_address"),
        "ssc_cgpa": student.get("ssc_cgpa"),
        "hsc_cgpa": student.get("hsc_cgpa"),
        "btech_cgpa": student.get("btech_cgpa"),
        "mtech_cgpa": student.get("mtech_cgpa"),
        "backlogs": student.get("backlogs", 0),
        "has_edited_profile": student.get("has_edited_profile", False),
    }
    return UserResponseStudent(**profile_response)

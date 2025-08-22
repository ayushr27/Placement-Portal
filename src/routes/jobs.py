from typing import List
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.database import get_database
from src.routes.utils import security
from src.services import jobs as jobs_service
from src.routes.schemas import JobCreate, JobResponse

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.post("/create", summary="Create a job with Google Form and Job Details", response_model=JobResponse)
async def create_job(
    payload: JobCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user)
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create jobs")

    
    form_id = await jobs_service.extract_form_id(str(payload.form_link))

    sheet_link = jobs_service.create_sheet_for_job(form_id=form_id, job_title=payload.title)

    result = await jobs_service.create_job_with_links(
        db=db,
        current_admin_username=current_user.get("username"),
        job_data=payload,
        responses_sheet_link=sheet_link
    )

    if not result:
        raise HTTPException(status_code=500, detail="Failed to create job")
    return result


@router.get("")
def get_all_jobs()->List[JobResponse]:
    pass
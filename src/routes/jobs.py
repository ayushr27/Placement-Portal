from typing import List
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.database import get_database
from src.routes.utils import security
from src.services import jobs as jobs_service
from src.routes.schemas import JobCreate, JobResponse , MasterSheetInDB, MasterSheetResponse
from src.services.jobs import check_and_update_jobs
from src.routes.schemas import JobInDB
from src.redis import cache_get, cache_set, cache_delete
from pydantic import BaseModel
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
    if result:
        cache_delete("jobs:all")
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create job")
    return result


@router.post("/sync-expired")
async def sync_expired_jobs(db: AsyncIOMotorDatabase = Depends(get_database)):
    await check_and_update_jobs(db)
    return {"status": "ok", "message": "Expired jobs synced successfully"}

@router.get("/get-jobs", response_model=List[JobResponse])
async def get_all_jobs(db: AsyncIOMotorDatabase = Depends(get_database)) -> List[JobResponse]:
    
    cached = cache_get("jobs:all")
    if cached:
        return [JobResponse(**j) for j in cached]   # already serialized

    #Otherwisefrom DB
    jobs_cursor = db.jobs.find({})
    jobs = []
    async for job in jobs_cursor:
        job["_id"] = str(job["_id"])
        jobs.append(JobInDB(**job))

    jobs_response = [JobResponse(**j.dict()) for j in jobs]

    #Save to Redis
    cache_set(
    "jobs:all",
    [j.model_dump(mode="json") for j in jobs_response],
    expire=3600
)

    return jobs_response




def serialize_for_cache(objects: List[BaseModel]):
    return [obj.model_dump(mode="json") for obj in objects]


@router.get("/master-sheets", response_model=List[MasterSheetResponse])
async def get_all_master_sheets(db: AsyncIOMotorDatabase = Depends(get_database)) -> List[MasterSheetResponse]:
    # Try cache
    cached = cache_get("master_sheets:all")
    if cached:
        return [MasterSheetResponse(**sheet) for sheet in cached]

    # Fetch from DB
    sheets_cursor = db.master_sheets.find({})
    sheets = []
    async for sheet in sheets_cursor:
        sheet["_id"] = str(sheet["_id"])
        if "admin_id" in sheet:
            sheet["admin_id"] = str(sheet["admin_id"])
        sheets.append(MasterSheetInDB(**sheet))
        print(sheets)
    if not sheets:
        raise HTTPException(status_code=404, detail="No master sheets found")

   
    sheets_response = [MasterSheetResponse(**s.model_dump(mode="json")) for s in sheets]

    # Store in Redis cache
    cache_set("master_sheets:all", serialize_for_cache(sheets_response), expire=3600)

    return sheets_response
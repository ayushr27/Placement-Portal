from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.concurrency import run_in_threadpool
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, ValidationError

from src import logger
from src.database import get_database
from src.redis import cache_get, cache_set, cache_delete
from src.routes.schemas import (
    JobCreate,
    JobResponse,
    MasterSheetInDB,
    MasterSheetResponse,
    JobInDB,
    JobUpdate,
)
from src.routes.utils import security
from src.services import jobs as jobs_service
from src.services.job_metrics import update_all_jobs_metrics
from src.services.jobs import check_and_update_jobs


router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

# Operational plumbing that students have no use for, and that identifies the
# admin and their Google Sheets. `form_link` is deliberately NOT here: students
# need it to apply.
ADMIN_ONLY_JOB_FIELDS = (
    "responses_sheet_link",
    "master_sheet_id",
    "master_sheet_link",
    "created_by",
)


def redact_job_for(current_user: dict, job: dict) -> dict:
    """Strip admin-only fields from a job unless the caller is an admin."""
    if current_user.get("role") == "admin":
        return job
    return {k: v for k, v in job.items() if k not in ADMIN_ONLY_JOB_FIELDS}


@router.post(
    "/create",
    summary="Create a job with Google Form and Job Details",
    response_model=JobResponse,
)
async def create_job(
    payload: JobCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    if current_user.get("role") != "admin":
        logger.warning(
            "Unauthorized job creation attempt by %s",
            current_user.get("username"),
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create jobs",
        )

    try:
        sheet_link = None
        sheet_warning = None

        # Creating the responses sheet is a convenience, not a prerequisite for
        # the posting itself. It only works for an EDIT link to a form this
        # admin's Google account can open, so treat every failure as a warning
        # and still save the job - otherwise an inaccessible form (or a share
        # link, which students actually need) blocked posting entirely.
        link = (payload.form_link or "").strip()
        if link:
            try:
                form_id = await jobs_service.extract_form_id(link)
            except ValueError as e:
                # A share link: perfect for students, unusable by Apps Script.
                form_id = None
                sheet_warning = str(e)

            if form_id:
                try:
                    # create_sheet_for_job makes a synchronous HTTPS call to the
                    # Apps Script web app. Called directly it blocked the event
                    # loop for the whole round trip, stalling every other
                    # request served by this instance.
                    sheet_link, published_url = await run_in_threadpool(
                        jobs_service.create_sheet_for_job,
                        form_id=form_id,
                        job_title=payload.job_designation,
                    )
                    # The admin pastes the EDIT link so Apps Script can open it,
                    # but students must receive the public link.
                    if published_url:
                        payload.form_link = published_url
                except Exception as e:
                    sheet_warning = (
                        f"The job was posted, but no responses sheet could be "
                        f"created: {e}"
                    )
                    logger.warning(
                        "Responses sheet skipped for %s: %s",
                        payload.company_name,
                        e,
                    )

        result = await jobs_service.create_job_with_links(
            db=db,
            current_admin_username=current_user.get("username"),
            job_data=payload,
            responses_sheet_link=sheet_link,
        )
        if result:
            cache_delete("jobs:all")
            if sheet_warning:
                # Returned, not just logged: the admin needs to know the posting
                # succeeded while the responses sheet did not get created.
                logger.info("Job posted with warning: %s", sheet_warning)
                result.sheet_warning = sheet_warning
            return result

        logger.error("Failed to create job (DB returned None)")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create job",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during job creation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error occurred while creating job",
        )


@router.post("/sync-expired")
async def sync_expired_jobs(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    # This had no authentication at all: anyone on the internet could POST it,
    # mutating jobs (synced=True) and driving Google Forms/Sheets calls on the
    # admin's OAuth credentials. The admin UI sends a bearer token, so the gate
    # looked present while being enforced only in the browser.
    if current_user.get("role") != "admin":
        logger.warning(
            "Unauthorized job sync attempt by %s", current_user.get("username")
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can sync jobs",
        )

    try:
        await check_and_update_jobs(db)
        return {"status": "ok", "message": "Expired jobs synced successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error syncing expired jobs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to sync expired jobs",
        )


@router.get("/get-jobs", response_model=List[JobResponse])
async def get_all_jobs(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
) -> List[JobResponse]:
    # Was unauthenticated, so anyone could enumerate every posting along with
    # the admin's email (created_by) and the internal sheet links.
    try:
        cached = cache_get("jobs:all")
        if cached:
            return [
                JobResponse(**redact_job_for(current_user, j)) for j in cached
            ]

        jobs_cursor = db.jobs.find({})
        jobs: List[JobInDB] = []
        async for job in jobs_cursor:
            job["_id"] = str(job["_id"])
            try:
                jobs.append(JobInDB(**job))
            except ValidationError as e:
                # One legacy document missing a required field used to make this
                # endpoint 500 for every user. Skip it and keep serving the rest.
                logger.warning(
                    "Skipping malformed job document %s: %s", job.get("_id"), e
                )

        # Cache the FULL documents under the shared key and redact per request.
        # Caching the redacted view would poison the shared entry with whichever
        # role happened to populate it first - a student's request would strip
        # the sheet links for admins, and an admin's would expose them to
        # students for the next hour.
        full_response = [JobResponse(**j.model_dump()) for j in jobs]
        cache_set(
            "jobs:all",
            [j.model_dump(mode="json") for j in full_response],
            expire=3600,
        )
        return [
            JobResponse(**redact_job_for(current_user, j.model_dump(mode="json")))
            for j in full_response
        ]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch jobs",
        )


def serialize_for_cache(objects: List[BaseModel]):
    return [obj.model_dump(mode="json") for obj in objects]


@router.get("/master-sheets", response_model=List[MasterSheetResponse])
async def get_all_master_sheets(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
) -> List[MasterSheetResponse]:
    # Was unauthenticated: an anonymous GET returned every Google spreadsheet_id
    # and admin_id. The sheets themselves are private, so this was ID disclosure
    # rather than a data leak - but only until one sheet gets link-shared.
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view master sheets",
        )

    try:
        cached = cache_get("master_sheets:all")
        if cached:
            return [MasterSheetResponse(**sheet) for sheet in cached]

        sheets_cursor = db.master_sheets.find({})
        sheets: List[MasterSheetInDB] = []
        async for sheet in sheets_cursor:
            sheet["_id"] = str(sheet["_id"])
            if "admin_id" in sheet:
                sheet["admin_id"] = str(sheet["admin_id"])
            sheets.append(MasterSheetInDB(**sheet))

        if not sheets:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No master sheets found",
            )

        sheets_response = [
            MasterSheetResponse(**s.model_dump(mode="json")) for s in sheets
        ]
        cache_set(
            "master_sheets:all",
            serialize_for_cache(sheets_response),
            expire=3600,
        )
        return sheets_response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching master sheets: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch master sheets",
        )


@router.get("/job_metrics")
async def get_job_metrics(
    jobid: str = Query(..., description="ID of the job to fetch metrics for"),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    if current_user.get("role") != "admin":
        logger.warning(
            "Unauthorized metrics view attempt by %s",
            current_user.get("username"),
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view job metrics",
        )

    try:
        metrics = await db.job_metrics.find_one({"job_id": jobid})
        if not metrics:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Metrics not found for this job",
            )
        metrics["_id"] = str(metrics["_id"])
        return metrics
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching metrics for job {jobid}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch job metrics",
        )


@router.post("/update-all-metrics")
async def update_all_metrics(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    if current_user.get("role") != "admin":
        logger.warning(
            "Unauthorized metrics update attempt by %s",
            current_user.get("username"),
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update metrics",
        )

    try:
        admin_doc = await db.admins.find_one({"_id": current_user.get("_id")})
        if not admin_doc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Admin not found",
            )

        updated_jobs = await update_all_jobs_metrics(db, admin_doc)

        return {
            "status": "ok",
            "message": f"Metrics updated/created for {len(updated_jobs)} jobs",
            "updated_jobs": updated_jobs,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating all job metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update all metrics",
        )


@router.put("/update/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    payload: JobUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(security.get_current_user),
):
    if current_user.get("role") != "admin":
        logger.warning(
            "Unauthorized job update attempt by %s",
            current_user.get("username"),
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update jobs",
        )

    try:
        existing_job = await db.jobs.find_one({"_id": job_id})
        if not existing_job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )

        update_data = {
            k: v for k, v in payload.model_dump().items() if v is not None
        }
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid fields provided for update",
            )

        await db.jobs.update_one(
            {"_id": job_id},
            {"$set": update_data},
        )

        cache_delete("jobs:all")

        updated_job = await db.jobs.find_one({"_id": job_id})
        updated_job["_id"] = str(updated_job["_id"])
        return JobResponse(**updated_job)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating job {job_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update job",
        )

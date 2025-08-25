from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
import pandas as pd
from datetime import datetime, timezone
from src.services.google_service import fetch_form_responses
from src import logger


async def calculate_metrics(db: AsyncIOMotorDatabase, job_id: str, admin_doc: dict) -> dict:
    """
    Calculate gender-wise and branch-wise metrics for a job.
    Store/update them in the job_metrics collection.

    Args:
        db (AsyncIOMotorDatabase): Database connection.
        job_id (str): Job identifier.
        admin_doc (dict): Admin document for Google service authentication.

    Returns:
        dict: Metrics with gender-wise and branch-wise counts.

    Raises:
        HTTPException: If job not found or no response sheet link is set.
    """
    try:
        job = await db.jobs.find_one({"_id": job_id})
        if not job:
            logger.error("Job not found for job_id=%s", job_id)
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

        responses_sheet_link = job.get("responses_sheet_link")
        if not responses_sheet_link:
            logger.warning("Job has no response sheet link: job_id=%s", job_id)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job has no response sheet link")

        responses = fetch_form_responses(admin_doc, responses_sheet_link)

        if not responses:
            metrics = {"gender_wise": {}, "branch_wise": {}}
        else:
            df = pd.DataFrame(responses)
            cols = {c.lower(): c for c in df.columns}
            metrics = {}

            if "gender" in cols:
                metrics["gender_wise"] = df[cols["gender"]].value_counts().to_dict()

            if "branch" in cols:
                metrics["branch_wise"] = df[cols["branch"]].value_counts().to_dict()

        metrics_doc = {
            "job_id": job_id,
            "metrics": metrics,
            "updated_at": datetime.now(timezone.utc)
        }

        await db.job_metrics.update_one(
            {"job_id": job_id},
            {"$set": metrics_doc},
            upsert=True
        )
        logger.info("Metrics calculated and stored for job_id=%s", job_id)
        return metrics
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error calculating metrics for job_id=%s", job_id)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error") from exc


async def update_or_create_job_metrics(
    db: AsyncIOMotorDatabase,
    job: dict,
    admin_doc: dict
) -> bool:
    """
    Update metrics for a job if deadline not over or create metrics if missing.

    Args:
        db (AsyncIOMotorDatabase): Database connection.
        job (dict): Job document.
        admin_doc (dict): Admin document for Google service authentication.

    Returns:
        bool: True if metrics updated/created, False otherwise.
    """
    try:
        job_id = str(job["_id"])
        deadline = job.get("application_deadline")
        if deadline and deadline < datetime.now(timezone.utc):
            return False   # Skip expired jobs

        existing_metrics = await db.job_metrics.find_one({"job_id": job_id})

        if existing_metrics and deadline and deadline < datetime.now(timezone.utc):
            logger.info("Skipped metrics update: deadline passed for job_id=%s", job_id)
            return False

        metrics = await calculate_metrics(db, job_id, admin_doc)

        await db.job_metrics.update_one(
            {"job_id": job_id},
            {"$set": {"metrics": metrics, "updated_at": datetime.now(timezone.utc)}},
            upsert=True
        )
        logger.info("Metrics updated/created for job_id=%s", job_id)
        return True
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error updating/creating metrics for job_id=%s", job.get('_id'))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error") from exc


async def update_all_jobs_metrics(db: AsyncIOMotorDatabase, admin_doc: dict) -> list[str]:
    """
    Loop through all jobs and update/create metrics as needed.

    Args:
        db (AsyncIOMotorDatabase): Database connection.
        admin_doc (dict): Admin document for Google service authentication.

    Returns:
        list[str]: List of job_ids updated.
    """
    updated_jobs = []
    try:
        async for job in db.jobs.find({}):
            updated = await update_or_create_job_metrics(db, job, admin_doc)
            if updated:
                updated_jobs.append(str(job["_id"]))
        logger.info("Updated metrics for %d jobs", len(updated_jobs))
        return updated_jobs
    except Exception as exc:
        logger.exception("Error updating all jobs metrics")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error") from exc

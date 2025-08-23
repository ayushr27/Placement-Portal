from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
import pandas as pd
from datetime import datetime
from src.services.google_service import fetch_form_responses

async def calculate_metrics(db: AsyncIOMotorDatabase, job_id: str, admin_doc: dict):
    """
    Calculate gender-wise and branch-wise metrics for a job.
    Store/update them in the job_metrics collection.
    """
   
    job = await db.jobs.find_one({"_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    responses_sheet_link = job.get("responses_sheet_link")
    if not responses_sheet_link:
        raise HTTPException(status_code=400, detail="Job has no response sheet link")

  
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
        "updated_at": datetime.utcnow()
    }

    await db.job_metrics.update_one(
        {"job_id": job_id},      
        {"$set": metrics_doc},   
        upsert=True              
    )

    return metrics


async def update_or_create_job_metrics(db: AsyncIOMotorDatabase, job: dict, admin_doc: dict):
    """
    Update metrics for a job if deadline not over or create metrics if missing.
    """
    job_id = str(job["_id"])
    deadline = job.get("application_deadline")

    existing_metrics = await db.job_metrics.find_one({"job_id": job_id})

    
    if existing_metrics and deadline and deadline < datetime.utcnow():
        return False

    metrics = await calculate_metrics(db, job_id, admin_doc)

    await db.job_metrics.update_one(
        {"job_id": job_id},
        {"$set": {"metrics": metrics, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return True


async def update_all_jobs_metrics(db: AsyncIOMotorDatabase, admin_doc: dict):
    """
    Loop through all jobs and update/create metrics as needed.
    Returns list of job_ids updated.
    """
    updated_jobs = []
    async for job in db.jobs.find({}):
        updated = await update_or_create_job_metrics(db, job, admin_doc)
        if updated:
            updated_jobs.append(str(job["_id"]))
    return updated_jobs

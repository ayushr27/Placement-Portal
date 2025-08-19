from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from bson import ObjectId
from src.services import google_service
from src.routes.schemas import JobCreate, JobInDB, JobResponse
import requests
import re
from datetime import datetime
import pytz

ist = pytz.timezone('Asia/Kolkata')

async def extract_form_id(form_link: str) -> str:
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", form_link)
    if not match:
        raise ValueError("Invalid Google Form link")
    return match.group(1)


async def check_and_update_jobs(db: AsyncIOMotorDatabase):
    now = datetime.now(pytz.UTC)  
    expired_jobs = db.jobs.find({"application_deadline": {"$lte": now}, "synced": {"$ne": True}})
    async for job in expired_jobs:
        admin_doc = await db.admins.find_one({"email": job["created_by"]})
        await sync_responses_to_master(db, admin_doc, JobInDB(**job))
        await db.jobs.update_one({"_id": job["_id"]}, {"$set": {"synced": True}})


async def _get_admin_doc(db: AsyncIOMotorDatabase, username_or_email: str) -> dict:
    admin = await db.admins.find_one({"username": username_or_email}) or \
            await db.admins.find_one({"email": username_or_email})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    if "google_oauth" not in admin:
        raise HTTPException(status_code=400, detail="Admin Google account not linked")
    return admin

async def sync_responses_to_master(db, admin_doc, job_doc: JobInDB):
   
    form_responses_service = google_service.get_google_service_for_admin(admin_doc, "forms", "v1")
    form_id = await extract_form_id(job_doc.form_link)

    responses = form_responses_service.forms().responses().list(formId=form_id).execute()
    applied_rolls = set()

    for r in responses.get("responses", []):
        answers = r.get("answers", {})
       
        for ans in answers.values():
            if "textAnswers" in ans:
                applied_rolls.add(ans["textAnswers"]["answers"][0]["value"].strip())

    
    sheets_service = google_service.get_google_service_for_admin(admin_doc, "sheets", "v4")
    sheet = sheets_service.spreadsheets()

    header = sheet.values().get(
        spreadsheetId=job_doc.master_sheet_id,
        range="Sheet1!1:1"
    ).execute().get("values", [[]])[0]

    if job_doc.company not in header:
        raise Exception(f"Column for {job_doc.company} not found in master sheet")

    col_index = header.index(job_doc.company)
    col_letter = chr(ord('A') + col_index)

    # Fetch roll numbers from master sheet
    roll_nums = sheet.values().get(
        spreadsheetId=job_doc.master_sheet_id,
        range="Sheet1!A2:A"
    ).execute().get("values", [])

    values = [["Applied" if r[0] in applied_rolls else ""] for r in roll_nums]

    sheet.values().update(
        spreadsheetId=job_doc.master_sheet_id,
        range=f"Sheet1!{col_letter}2:{col_letter}{len(values)+1}",
        valueInputOption="RAW",
        body={"values": values}
    ).execute()


def update_column(admin_doc: dict, spreadsheet_id: str, column_index: int, values: list[str]):
    """
    Updates a full column (starting row 2, since row 1 is header).
    column_index is 0-based (A=0, B=1, ...).
    """
    sheets_service = google_service.get_google_service_for_admin(admin_doc, "sheets", "v4")
    col_letter = chr(ord('A') + column_index)
    range_notation = f"Sheet1!{col_letter}2:{col_letter}{len(values)+1}"
    body = {"values": [[v] for v in values]}
    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range=range_notation,
        valueInputOption="RAW",
        body=body
    ).execute()


async def _get_or_create_master_sheet(db, admin_doc, batch_year: list[int]) -> str:
    existing = await db.master_sheets.find_one({
        "admin_id": admin_doc["_id"],
        "batch_year": batch_year
    })
    if existing:
        return existing["spreadsheet_id"]

    # Fetch all roll numbers for batch
    students = await db.students.find({"batch": {"$in": batch_year}}).to_list(None)
    roll_numbers = [s["roll_number"] for s in students]

    title = f"Placement Sheet - {batch_year}"
    spreadsheet_id = google_service.create_sheet(admin_doc, title, roll_numbers)

    # Add JobsLog sheet
    sheets_service = google_service.get_google_service_for_admin(admin_doc, "sheets", "v4")
    sheets_service.spreadsheets().batchUpdate(
        spreadsheetId=spreadsheet_id,
        body={
            "requests": [{"addSheet": {"properties": {"title": "JobsLog"}}}]
        }
    ).execute()

    
    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range="JobsLog!1:1",
        valueInputOption="RAW",
        body={"values": [["Timestamp", "Batch", "Company", "Title", "Form Link", "Responses Link"]]},
    ).execute()

    await db.master_sheets.insert_one({
        "admin_id": admin_doc["_id"],
        "batch_year": batch_year,
        "spreadsheet_id": spreadsheet_id,
        "created_at": datetime.now(ist)
    })

    return spreadsheet_id


async def _ensure_company_column(admin_doc: dict, spreadsheet_id: str, company: str):
    sheets_service = google_service.get_google_service_for_admin(admin_doc, "sheets", "v4")
    sheet = sheets_service.spreadsheets()

    result = sheet.values().get(
        spreadsheetId=spreadsheet_id,
        range="Sheet1!1:1"
    ).execute()
    header = result.get("values", [[]])[0]
    if company not in header:
        header.append(company)
        sheet.values().update(
            spreadsheetId=spreadsheet_id,
            range="Sheet1!1:1",
            valueInputOption="RAW",
            body={"values": [header]}
        ).execute()


APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwOWIV5rnj8Ev8YsQMpQDLCYZBJU8FsU-Wr7cWzGeDbPvJd7y8T2evwUHPdUQI34pdYtg/exec"

def create_sheet_for_job(form_id: str, job_title: str) -> str:
    payload = {"formId": form_id, "jobTitle": job_title}
    response = requests.post(APPS_SCRIPT_URL, json=payload)
    if response.status_code == 200:
        return response.json().get("sheetUrl")
    else:
        raise Exception("Failed to create sheet")
    

async def create_job_with_links(
    db: AsyncIOMotorDatabase,
    current_admin_username: str,
    job_data: JobCreate,
    responses_sheet_link: str
) -> JobResponse:
    if not job_data.title or not job_data.company or not job_data.form_link:
        raise HTTPException(status_code=400, detail="Title, company, and form link are required")

    admin_doc = await _get_admin_doc(db, current_admin_username)

    master_sheet_id = await _get_or_create_master_sheet(db, admin_doc, job_data.batch)
    await _ensure_company_column(admin_doc, master_sheet_id, job_data.company)

    now_iso = datetime.now(ist).isoformat()

    # --- Log job into JobsLog sheet ---
    sheets_service = google_service.get_google_service_for_admin(admin_doc, "sheets", "v4")
    sheets_service.spreadsheets().values().append(
        spreadsheetId=master_sheet_id,
        range="JobsLog!A:F",
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body={
            "values": [[
                now_iso,
                ",".join(str(b) for b in job_data.batch),
                job_data.company,
                job_data.title,
                job_data.form_link,
                responses_sheet_link
            ]]
        }
    ).execute()

    # --- Store in DB ---
    job_doc = JobInDB(
        id=str(ObjectId()),
        title=job_data.title,
        company=job_data.company,
        batch=job_data.batch,
        form_link=job_data.form_link,
        responses_sheet_link=responses_sheet_link,
        gender_preference=job_data.gender_preference,
        CG_Cutoff=job_data.CG_Cutoff,
        application_deadline=job_data.application_deadline,
        location=job_data.location,
        job_description=job_data.job_description,
        created_by=admin_doc.get("email") or admin_doc.get("username"),
        created_at=datetime.now(ist),
        updated_at=datetime.now(ist),
        master_sheet_id=master_sheet_id,
        master_sheet_link=f"https://docs.google.com/spreadsheets/d/{master_sheet_id}"
    )

    await db.jobs.insert_one(job_doc.dict(by_alias=True))
    await check_and_update_jobs(db)
    return JobResponse(
        id=job_doc.id,
        title=job_doc.title,
        company=job_doc.company,
        batch=job_doc.batch,
        location=job_doc.location,
        application_deadline=job_doc.application_deadline,
        gender_preference=job_doc.gender_preference,
        CG_Cutoff=job_doc.CG_Cutoff,
        form_link=job_doc.form_link,
        responses_sheet_link=job_doc.responses_sheet_link,
        master_sheet_id=job_doc.master_sheet_id,
        master_sheet_link=job_doc.master_sheet_link
    )

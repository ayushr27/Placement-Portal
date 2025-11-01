import re
from datetime import datetime

import pytz
import requests
from bson import ObjectId
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from src.routes.schemas import JobInDB
from datetime import datetime
from src import logger
from src.config import secrets
from src.routes.schemas import JobCreate, JobInDB, JobResponse
from src.services import google_service
from src.services.constants import GOOGLE_APPS_SCRIPT_TIMEOUT

ist = pytz.timezone("Asia/Kolkata")
APPS_SCRIPT_URL = secrets.APPS_SCRIPT_URL
FORM_APPS_SCRIPT_URL = secrets.FORM_APPS_SCRIPT_URL

async def extract_form_id(form_link: str) -> str:
    """Extract the Google Form ID from a form link."""
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", form_link)
    if not match:
        logger.error("Invalid Google Form link provided: %s", form_link)
        raise ValueError("Invalid Google Form link")
    return match.group(1)


async def check_and_update_jobs(db: AsyncIOMotorDatabase):
    """Check expired jobs and update their sync status in the database."""
    now = datetime.now(pytz.UTC)
    expired_jobs = db.jobs.find(
        {"application_deadline": {"$lte": now}, "synced": {"$ne": True}}
    )

    async for job in expired_jobs:
        try:
            admin_doc = await db.admins.find_one({"email": job["created_by"]})
            await sync_responses_to_master(db, admin_doc, JobInDB(**job))
            await db.jobs.update_one(
                {"_id": job["_id"]}, {"$set": {"synced": True}}
            )
        except Exception as e:
            logger.error("Failed to sync job %s: %s", job.get("_id"), str(e))


async def _get_admin_doc(
    db: AsyncIOMotorDatabase, username_or_email: str
) -> dict:
    """Retrieve admin document from the database."""
    admin = (
        await db.admins.find_one({"username": username_or_email})
        or await db.admins.find_one({"email": username_or_email})
    )

    if not admin:
        logger.error("Admin not found for: %s", username_or_email)
        raise HTTPException(status_code=404, detail="Admin not found")

    if "google_oauth" not in admin:
        logger.error(
            "Google account not linked for admin: %s", username_or_email
        )
        raise HTTPException(
            status_code=400, detail="Admin Google account not linked"
        )

    return admin


async def sync_responses_to_master(
    db: AsyncIOMotorDatabase, admin_doc: dict, job_doc: JobInDB
):
    """Sync responses from Google Form to the master Google Sheet."""
    try:
        form_service = google_service.get_google_service_for_admin(
            admin_doc, "forms", "v1"
        )
        form_id = await extract_form_id(job_doc.form_link)
        form_info = form_service.forms().get(formId=form_id).execute()

        roll_question_id = None
        for item in form_info.get("items", []):
            question = item.get("questionItem", {}).get("question", {})
            title = (
                item.get("title", "").strip().lower()
                or question.get("title", "").strip().lower()
            )
            if "roll" in title and "number" in title:
                roll_question_id = question.get("questionId")
                break

        if not roll_question_id:
            raise Exception("Roll Number question not found in the form")

        responses = form_service.forms().responses().list(
            formId=form_id
        ).execute()

        applied_rolls = {
            ans["textAnswers"]["answers"][0]["value"].strip()
            for r in responses.get("responses", [])
            for ans in [r.get("answers", {}).get(roll_question_id, {})]
            if "textAnswers" in ans
        }

        sheets_service = google_service.get_google_service_for_admin(
            admin_doc, "sheets", "v4"
        )
        sheet = sheets_service.spreadsheets()

        header = sheet.values().get(
            spreadsheetId=job_doc.master_sheet_id, range="Sheet1!1:1"
        ).execute().get("values", [[]])[0]

        if job_doc.company_name not in header:
            raise Exception(
                f"Column for {job_doc.company_name} not found in master sheet"
            )

        col_index = header.index(job_doc.company_name)
        col_letter = chr(ord("A") + col_index)

        roll_nums = sheet.values().get(
            spreadsheetId=job_doc.master_sheet_id, range="Sheet1!A2:A"
        ).execute().get("values", [])

        values = [["Applied" if r[0] in applied_rolls else ""] for r in roll_nums]

        sheet.values().update(
            spreadsheetId=job_doc.master_sheet_id,
            range=f"Sheet1!{col_letter}2:{col_letter}{len(values) + 1}",
            valueInputOption="RAW",
            body={"values": values},
        ).execute()

    except Exception as e:
        logger.error("Error syncing responses to master: %s", str(e))
        raise


def update_column(
    admin_doc: dict, spreadsheet_id: str, column_index: int, values: list[str]
):
    """Update a column in the Google Sheet starting from row 2."""
    try:
        sheets_service = google_service.get_google_service_for_admin(
            admin_doc, "sheets", "v4"
        )
        col_letter = chr(ord("A") + column_index)
        range_notation = f"Sheet1!{col_letter}2:{col_letter}{len(values) + 1}"
        body = {"values": [[v] for v in values]}

        sheets_service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range=range_notation,
            valueInputOption="RAW",
            body=body,
        ).execute()

    except Exception as e:
        logger.error(
            "Failed to update column in sheet %s: %s", spreadsheet_id, str(e)
        )
        raise


async def _get_or_create_master_sheet(
    db: AsyncIOMotorDatabase, admin_doc: dict, batch_year: list[int]
) -> str:
    """Get or create a master placement sheet for the given batch."""
    existing = await db.master_sheets.find_one(
        {"admin_id": admin_doc["_id"], "batch_year": batch_year}
    )
    if existing:
        return existing["spreadsheet_id"]

    students = await db.students.find(
        {"batch": {"$in": batch_year}}
    ).to_list(None)
    roll_numbers = [s["roll_number"] for s in students]

    title = f"Placement Sheet - {batch_year}"
    spreadsheet_id = google_service.create_sheet(
        admin_doc, title, roll_numbers
    )

    sheets_service = google_service.get_google_service_for_admin(
        admin_doc, "sheets", "v4"
    )
    sheets_service.spreadsheets().batchUpdate(
        spreadsheetId=spreadsheet_id,
        body={"requests": [{"addSheet": {"properties": {"title": "JobsLog"}}}]},
    ).execute()

    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range="JobsLog!1:1",
        valueInputOption="RAW",
        body={
            "values": [
                [
                    "Timestamp",
                    "Batch",
                    "Company",
                    "Title",
                    "Form Link",
                    "Responses Link",
                ]
            ]
        },
    ).execute()

    await db.master_sheets.insert_one(
        {
            "admin_id": admin_doc["_id"],
            "batch_year": batch_year,
            "spreadsheet_id": spreadsheet_id,
            "created_at": datetime.now(ist),
        }
    )
    return spreadsheet_id


async def _ensure_company_column(
    admin_doc: dict, spreadsheet_id: str, company: str
):
    """Ensure that a company column exists in the master sheet."""
    try:
        sheets_service = google_service.get_google_service_for_admin(
            admin_doc, "sheets", "v4"
        )
        sheet = sheets_service.spreadsheets()
        result = sheet.values().get(
            spreadsheetId=spreadsheet_id, range="Sheet1!1:1"
        ).execute()
        header = result.get("values", [[]])[0]

        if company not in header:
            header.append(company)
            sheet.values().update(
                spreadsheetId=spreadsheet_id,
                range="Sheet1!1:1",
                valueInputOption="RAW",
                body={"values": [header]},
            ).execute()

    except Exception as e:
        logger.error("Failed to ensure company column: %s", str(e))
        raise


def create_sheet_for_job(form_id: str, job_title: str) -> str:
    """Create a new Google Sheet for a job via Apps Script."""
    try:
        payload = {"formId": form_id, "jobTitle": job_title}
        logger.info(
            "Creating sheet via %s with payload: %s", APPS_SCRIPT_URL, payload
        )

        response = requests.post(
            APPS_SCRIPT_URL,
            json=payload,
            timeout=GOOGLE_APPS_SCRIPT_TIMEOUT,
        )
        logger.info(
            "Sheet creation response: %s, %s",
            response.status_code,
            response.text,
        )

        if response.status_code == 200:
            data = response.json()
            sheet_url = data.get("sheetUrl")
            if not sheet_url:
                raise Exception("sheetUrl missing in response")
            return sheet_url

        raise Exception(
            f"Apps Script returned {response.status_code}: {response.text}"
        )

    except Exception as e:
        logger.error("Error creating sheet for job %s: %s", job_title, str(e))
        raise


async def create_job_with_links(
    db: AsyncIOMotorDatabase,
    current_admin_username: str,
    job_data: JobCreate,
    responses_sheet_link: str,
) -> JobResponse:
    """Create a job entry with associated Google Sheets links."""
    if (
        not job_data.job_designation
        or not job_data.company_name
        or not job_data.form_link
    ):
        logger.error("Missing required job data: %s", job_data)
        raise HTTPException(
            status_code=400,
            detail="Title, company, and form link are required",
        )

    admin_doc = await _get_admin_doc(db, current_admin_username)
    master_sheet_id = await _get_or_create_master_sheet(
        db, admin_doc, job_data.batch
    )
    await _ensure_company_column(
        admin_doc, master_sheet_id, job_data.company_name
    )

    now_iso = datetime.now(ist).isoformat()

    try:
        sheets_service = google_service.get_google_service_for_admin(
            admin_doc, "sheets", "v4"
        )
        sheets_service.spreadsheets().values().append(
            spreadsheetId=master_sheet_id,
            range="JobsLog!A:F",
            valueInputOption="RAW",
            insertDataOption="INSERT_ROWS",
            body={
                "values": [
                    [
                        now_iso,
                        ",".join(str(b) for b in job_data.batch),
                        job_data.company_name,
                        job_data.job_designation,
                        job_data.form_link,
                        responses_sheet_link,
                    ]
                ]
            },
        ).execute()
    except Exception as e:
        logger.error("Failed to append job to JobsLog sheet: %s", str(e))
        raise

    job_doc = JobInDB(
        id=str(ObjectId()),
        company_name=job_data.company_name,
        website=job_data.website,
        linkedin_link=job_data.linkedin_link,
        address=job_data.address,
        batch=job_data.batch,
        work_location=job_data.work_location,
        job_designation=job_data.job_designation,
        type_of_employment=job_data.type_of_employment,
        eligibility_criteria=job_data.eligibility_criteria,
        cgpa_eligibility=job_data.cgpa_eligibility,
        applicable_branch=job_data.applicable_branch,
        stipend=job_data.stipend,
        ctc=job_data.ctc,
        other_benefits=job_data.other_benefits,
        bond=job_data.bond,
        job_description=job_data.job_description,
        about_company=job_data.about_company,
        selection_process=job_data.selection_process,
        form_link=job_data.form_link,
        application_deadline=job_data.application_deadline,
        created_by=admin_doc.get("email") or admin_doc.get("username"),
        created_at=datetime.now(ist),
        updated_at=datetime.now(ist),
        responses_sheet_link=responses_sheet_link,
        master_sheet_id=master_sheet_id,
        master_sheet_link=f"https://docs.google.com/spreadsheets/d/{master_sheet_id}",
        synced=False,
    )

    try:
        await db.jobs.insert_one(job_doc.model_dump(by_alias=True))
    except Exception as e:
        logger.error("Failed to insert job into database: %s", str(e))
        raise

    return JobResponse(**job_doc.model_dump())



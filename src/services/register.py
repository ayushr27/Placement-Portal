import csv
import io
import random
import string
import asyncio
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from src.services.schemas import StudentCreate, StudentInDB
from src.routes.utils import security
from src.services.utils import send_email_task
from src.services.constants import ACCOUNT_CREATION_EMAIL_BODY, BATCH_SIZE, BATCH_DELAY_SECONDS
from src.services import google_service


def generate_random_password(length: int = 8) -> str:
    """
    Generate a random alphanumeric password.

    Args:
        length (int): Length of the password. Defaults to 8.

    Returns:
        str: Randomly generated password.
    """
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


async def process_student_csv(db: AsyncIOMotorDatabase, file_bytes: bytes) -> dict:
    csv_text = file_bytes.decode("utf-8")
    reader = csv.DictReader(io.StringIO(csv_text))

    required = {"name", "email", "roll_number"}  # batch, branch, course optional now
    to_insert, creds_to_send = [], []

    for row in reader:
        if not required.issubset(row.keys()):
            raise HTTPException(status_code=400, detail="CSV missing required columns.")

        try:
            student_create = StudentCreate(
                name=row["name"].strip(),
                email=row["email"].strip(),
                roll_number=row["roll_number"].strip(),
                branch=row.get("branch", "").strip() or None,
                batch=int(row["batch"]) if row.get("batch") else None,
                course=row.get("course", "").strip() or None,
                gender=row.get("gender", "").strip() or None,
                phone_no=row.get("phone_no", "").strip() or None,
                password=generate_random_password(),
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid data for {row.get('email', '')}: {str(e)}")

        if await db.students.find_one({"email": student_create.email}):
            continue

        student_in_db = StudentInDB(
            name=student_create.name,
            gender=student_create.gender,
            email=student_create.email,
            username=student_create.email,  # email as username
            roll_number=student_create.roll_number,
            branch=student_create.branch,
            course=student_create.course,
            batch=student_create.batch,
            phone_no=student_create.phone_no,
            hashed_password=security.hash_password(student_create.password),
            role="student",
            
        )

        to_insert.append(student_in_db.model_dump(by_alias=True, exclude={"id"}))
        creds_to_send.append({
            "name": student_in_db.name,
            "email": student_in_db.email,
            "username": student_in_db.username,
            "password": student_create.password,
        })

    if to_insert:
        await db.students.insert_many(to_insert)

        # Send mails in batches
        for i in range(0, len(creds_to_send), BATCH_SIZE):
            batch = creds_to_send[i:i + BATCH_SIZE]
            for cred in batch:
                subject = "Your Student Account Credentials"
                body = ACCOUNT_CREATION_EMAIL_BODY.format(
                    name=cred["name"],
                    username=cred["username"],
                    password=cred["password"],
                )
                send_email_task.delay(cred["email"], subject, body)

            if i + BATCH_SIZE < len(creds_to_send):
                await asyncio.sleep(BATCH_DELAY_SECONDS)

    return {
        "inserted_count": len(to_insert),
        "inserted_emails": [c["email"] for c in creds_to_send],
        "message": "Students added and credentials emailed" if to_insert else "No new students added",
    }


async def create_admin(db: AsyncIOMotorDatabase, admin_data: dict) -> dict:
    """
    Create a new admin user in the database.

    Args:
        db (AsyncIOMotorDatabase): MongoDB database instance.
        admin_data (dict): Admin details including 'email' and 'password'.

    Raises:
        HTTPException: If an admin with the given email already exists.

    Returns:
        dict: Newly created admin ID and success message.
    """
    existing_admin = await db.admins.find_one({"email": admin_data["email"]})
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin with this email already exists")

    admin_data["hashed_password"] = security.hash_password(admin_data["password"])
    admin_data["role"] = "admin"
    admin_data.pop("password", None)
    result = await db.admins.insert_one(admin_data)
    return {"id": str(result.inserted_id), "message": "Admin created successfully"}


async def create_job_sheet_for_admin(db: AsyncIOMotorDatabase, admin_email: str, job_title: str):
    admin_doc = await db.admins.find_one({"email": admin_email})
    if not admin_doc:
        raise HTTPException(status_code=404, detail="Admin not found")
    spreadsheet_id = await google_service.create_sheet(admin_doc, f"Job - {job_title}")
    return {"spreadsheet_id": spreadsheet_id}


async def append_student_to_job_sheet(db: AsyncIOMotorDatabase, admin_email: str, spreadsheet_id: str, student_data: list):
    admin_doc = await db.admins.find_one({"email": admin_email})
    if not admin_doc:
        raise HTTPException(status_code=404, detail="Admin not found")
    await google_service.append_to_sheet(admin_doc, spreadsheet_id, student_data)
    return {"message": "Student data appended to sheet successfully"}

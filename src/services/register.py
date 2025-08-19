# src/services/register.py
import csv
import io
import random
import string
from bson import ObjectId
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.services.schemas import StudentCreate, StudentInDB
from src.routes.utils import security
from src.services.utils import send_email_to_student
from src.services import google_service

def generate_random_password(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

import asyncio

BATCH_SIZE = 20         # number of emails per batch
BATCH_DELAY_SECONDS = 10  # wait time between batches

async def process_student_csv(db: AsyncIOMotorDatabase, file_bytes: bytes):
    csv_text = file_bytes.decode("utf-8")
    reader = csv.DictReader(io.StringIO(csv_text))

    required = {"name", "email", "roll_number", "branch", "batch", "course"}
    to_insert, creds_to_send = [], []

    for row in reader:
        if not required.issubset(row.keys()):
            raise HTTPException(status_code=400, detail="CSV missing required columns.")

        try:
            student_create = StudentCreate(
                name=row["name"].strip(),
                email=row["email"].strip(),
                roll_number=row["roll_number"].strip(),
                branch=row["branch"].strip(),
                batch=int(row["batch"]),
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
            id=str(ObjectId()),
            name=student_create.name,
            gender=student_create.gender,
            email=student_create.email,
            username=student_create.email,
            roll_number=student_create.roll_number,
            branch=student_create.branch,
            course=student_create.course,
            batch=student_create.batch,
            phone_no=student_create.phone_no,
            hashed_password=security.hash_password(student_create.password),
            role="student",
        )

        to_insert.append(student_in_db.model_dump())
        creds_to_send.append({
            "name": student_in_db.name,
            "email": student_in_db.email,
            "username": student_in_db.username,
            "password": student_create.password,
        })

    if to_insert:
        await db.students.insert_many(to_insert)

        # 🔹 Send mails in batches
        for i in range(0, len(creds_to_send), BATCH_SIZE):
            batch = creds_to_send[i:i + BATCH_SIZE]

            for cred in batch:
                subject = "Your Student Account Credentials"
                body = f"""
Hi {cred['name']},

Your student account has been created.

Login credentials:
Username: {cred['username']}
Password: {cred['password']}

Please login and update your password.

Regards,
Training and Placement Cell, IIITDM Kurnool
"""
                await send_email_to_student(cred["email"], subject, body)

            # If more emails remain, wait before sending next batch
            if i + BATCH_SIZE < len(creds_to_send):
                await asyncio.sleep(BATCH_DELAY_SECONDS)

    return {
        "inserted_count": len(to_insert),
        "inserted_emails": [c["email"] for c in creds_to_send],
        "message": "Students added and credentials emailed" if to_insert else "No new students added",
    }


async def create_admin(db: AsyncIOMotorDatabase, admin_data: dict):
    if await db.admins.find_one({"email": admin_data["email"]}):
        raise HTTPException(status_code=400, detail="Admin with this email already exists")

    admin_data["hashed_password"] = security.hash_password(admin_data["password"])
    admin_data["role"] = "admin"
    admin_data.pop("password", None)
    result = await db.admins.insert_one(admin_data)
    return {"id": str(result.inserted_id), "message": "Admin created successfully"}

# ===== Sheets helpers used by job posting flow =====
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

import csv
import io
import random
import string
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from src.services.schemas import StudentCreate
from src.routes.utils import security
from src.services.utils import send_email_to_student 

def generate_random_password(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

async def process_student_csv(db: AsyncIOMotorDatabase, file_bytes: bytes):
    csv_text = file_bytes.decode("utf-8")
    reader = csv.DictReader(io.StringIO(csv_text))

    required_fields = {"name", "email", "roll_number", "branch", "year", "course"}
    students_to_insert = []
    credentials_to_send = []

    for row in reader:  
        if not required_fields.issubset(row.keys()):
            raise HTTPException(status_code=400, detail="CSV missing required columns.")

        password = generate_random_password()
        password_hash = security.hash_password(password)

        student_data = {
            "name": row["name"].strip(),
            "email": row["email"].strip(),
            "username": row["email"].strip(),
            "roll_number": row["roll_number"].strip(),
            "branch": row["branch"].strip(),
            "year": int(row["year"]),
            "hashed_password": password_hash,
            "role": "student",
            "is_first_login": True,
            "gender": row.get("gender", "").strip() or None,
            "course": row.get("course", "").strip() or None,
            "phone_no": row.get("phone_no", "").strip() or None,
        }

        existing_student = await db.students.find_one({"email": student_data["email"]})
        if existing_student:
            continue

        students_to_insert.append(student_data)

        # Store for emailing
        credentials_to_send.append({
            "name": student_data["name"],
            "email": student_data["email"],
            "username": student_data["username"],
            "password": password
        })

    if students_to_insert:
        result = await db.students.insert_many(students_to_insert)

        # Send emails to new students
        for cred in credentials_to_send:
            subject = "Your Student Account Credentials"
            body = f"""
Hi {cred['name']},

Your student account has been created.

Login credentials:
Username: {cred['username']}
Password: {cred['password']}

Please login and update your password.

Regards,
Training and Placement Cell ,IIITDM Kurnool
"""
            await send_email_to_student(cred["email"], subject, body)

        return {
            "inserted_count": len(students_to_insert),
            "inserted_emails": [cred["email"] for cred in credentials_to_send],
            "message": "Students added and credentials emailed"
        }


async def create_admin(db: AsyncIOMotorDatabase, admin_data: dict):
    """Create a new admin user"""
   
    existing_admin = await db.admins.find_one({"email": admin_data["email"]})
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin with this email already exists")
    
    # Hash password
    admin_data["hashed_password"] = security.hash_password(admin_data["password"])
    admin_data["role"] = "admin"
    admin_data.pop("password", None)  
    
    result = await db.admins.insert_one(admin_data)
    return {"id": str(result.inserted_id), "message": "Admin created successfully"}

async def reader_to_async_iter(reader):
    """
    Helper to turn sync csv.DictReader into async iterator.
    """
    for row in reader:
        yield row

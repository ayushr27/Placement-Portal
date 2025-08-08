import csv
import io
import random
import string
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from src.routes.utils import security
from src.services.utils import send_email_to_student
from src.services.constants import ACCOUNT_CREATION_EMAIL_BODY


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
    """
    Process a CSV file containing student details, insert them into the database,
    and send credentials via email.

    Args:
        db (AsyncIOMotorDatabase): MongoDB database instance.
        file_bytes (bytes): Raw CSV file data.

    Returns:
        dict: Summary of inserted students and their emails.
    """
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
        credentials_to_send.append({
            "name": student_data["name"],
            "email": student_data["email"],
            "username": student_data["username"],
            "password": password
        })

    if students_to_insert:
        await db.students.insert_many(students_to_insert)

        for cred in credentials_to_send:
            subject = "Your Student Account Credentials"
            body = ACCOUNT_CREATION_EMAIL_BODY.format(
                name=cred['name'],
                username=cred['username'],
                password=cred['password']
            )
            await send_email_to_student(cred["email"], subject, body)

        return {
            "inserted_count": len(students_to_insert),
            "inserted_emails": [cred["email"] for cred in credentials_to_send],
            "message": "Students added and credentials emailed"
        }
    return {"inserted_count": 0, "inserted_emails": [], "message": "No new students added"}


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


async def reader_to_async_iter(reader):
    """
    Convert a synchronous CSV DictReader into an asynchronous iterator.

    Args:
        reader (csv.DictReader): Synchronous CSV reader.

    Yields:
        dict: Row data from the CSV.
    """
    for row in reader:
        yield row

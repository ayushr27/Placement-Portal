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
from fastapi import BackgroundTasks
from src.services.utils import queue_email_task
from src.services.constants import ACCOUNT_CREATION_EMAIL_BODY, BATCH_SIZE, BATCH_DELAY_SECONDS
from src import logger


def generate_random_password(length: int = 8) -> str:
    """
    Generate a random alphanumeric password.

    Args:
        length (int): Length of the password. Defaults to 8.

    Returns:
        str: Randomly generated password.
    """
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


async def process_student_csv(db: AsyncIOMotorDatabase, file_bytes: bytes, background_tasks: BackgroundTasks | None = None) -> dict:
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
            role="student"
        )

        to_insert.append(student_in_db.model_dump(by_alias=True, exclude={"id"}))
        creds_to_send.append({
            "name": student_in_db.name,
            "email": student_in_db.email,
            "username": student_in_db.username,
            "password": student_create.password,
        })

    emailed = 0
    if to_insert:
        await db.students.insert_many(to_insert)
        logger.info(f"Inserted {len(to_insert)} credentials to database")

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
                # Keyword args: the positional order here was wrong
                # (background_tasks landed in `email` and `body` in
                # `background_tasks`), so every CSV upload raised
                # AttributeError: 'str' object has no attribute 'add_task'.
                if queue_email_task(
                    email=cred["email"],
                    subject=subject,
                    body=body,
                    background_tasks=background_tasks,
                ):
                    emailed += 1

            if i + BATCH_SIZE < len(creds_to_send):
                await asyncio.sleep(BATCH_DELAY_SECONDS)

    if not to_insert:
        message = "No new students added"
    elif emailed == len(creds_to_send):
        message = "Students added and credentials emailed"
    else:
        message = (
            "Students added, but credentials could NOT be emailed because mail "
            "is not configured. The generated passwords are returned below and "
            "are not recoverable later - distribute them now."
        )

    result = {
        "inserted_count": len(to_insert),
        "inserted_emails": [c["email"] for c in creds_to_send],
        "emailed_count": emailed,
        "message": message,
    }

    # Passwords are random and stored only as bcrypt hashes. If they could not
    # be delivered by mail, handing them back to the admin who uploaded the CSV
    # is the only way the accounts are usable at all.
    if to_insert and emailed < len(creds_to_send):
        result["credentials"] = [
            {"username": c["username"], "password": c["password"]}
            for c in creds_to_send
        ]

    return result


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

# create_job_sheet_for_admin / append_student_to_job_sheet were removed: both
# were unreachable and neither could run. The first awaited the synchronous
# google_service.create_sheet and omitted its required roll_numbers argument;
# the second called google_service.append_to_sheet, which does not exist.
# Job-sheet creation is handled in src/services/jobs.py.
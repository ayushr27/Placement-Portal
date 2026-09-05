import csv
import io
import secrets as token_secrets
import string
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.services.schemas import StudentCreate, StudentInDB
from src.routes.utils import security
from fastapi import BackgroundTasks
from src.services.utils import queue_email_task
from src.services.constants import ACCOUNT_CREATION_EMAIL_BODY
from src import logger


def generate_random_password(length: int = 16) -> str:
    """
    Generate a random alphanumeric password.

    Uses `secrets`, not `random`. `random.choices` is Mersenne Twister: not
    cryptographically secure, and a whole CSV batch was generated from one
    stream in a single loop, so seeing one issued password gave real leverage
    over a classmate's. `secrets.randbelow` is already used correctly for OTPs
    elsewhere in this codebase.

    Args:
        length (int): Length of the password. Defaults to 16.

    Returns:
        str: Randomly generated password.
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(token_secrets.choice(alphabet) for _ in range(length))


async def process_student_csv(db: AsyncIOMotorDatabase, file_bytes: bytes, background_tasks: BackgroundTasks | None = None) -> dict:
    # A spreadsheet exported from Excel is usually cp1252, not UTF-8, so any
    # accented name raised an uncaught UnicodeDecodeError and the admin saw an
    # opaque 500. Fall back rather than fail, and only give up if both fail.
    try:
        csv_text = file_bytes.decode("utf-8-sig")
    except UnicodeDecodeError:
        try:
            csv_text = file_bytes.decode("cp1252")
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not read the CSV's text encoding. Re-save it as "
                    "CSV UTF-8 and try again."
                ),
            )

    reader = csv.DictReader(io.StringIO(csv_text))

    required = {"name", "email", "roll_number"}  # batch, branch, course optional now
    to_insert, creds_to_send = [], []
    # The duplicate check below only looks at what is already in the database,
    # so two rows sharing an email within one file both got inserted - two
    # documents with the same username, one of which is unreachable at login
    # because get_user returns whichever Mongo hands back first, while both
    # students were emailed a password.
    seen_emails = set()

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

        email_key = student_create.email.strip().casefold()
        if email_key in seen_emails:
            logger.warning(
                "Skipping duplicate email within the uploaded CSV: %s",
                student_create.email,
            )
            continue
        seen_emails.add(email_key)

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

        # Queue the mails. There used to be an `await asyncio.sleep(
        # BATCH_DELAY_SECONDS)` between batches, which throttled *queueing*
        # rather than sending - queue_email_task only calls
        # background_tasks.add_task, which returns immediately. The sleep
        # therefore bought nothing and held the HTTP request open for ~10s per
        # 10 students: a 300-student upload ran ~290s, far past the platform's
        # function limit, so the admin got a gateway timeout and lost the
        # response body carrying the generated passwords.
        for cred in creds_to_send:
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
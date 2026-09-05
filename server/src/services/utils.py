import random
import string
import pytz
import pydantic

from fastapi import HTTPException, status, BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from src import logger
from src.config import secrets
from src.services.constants import (
    ACCOUNT_CREATION_EMAIL_FROM_NAME,
    ACCOUNT_CREATION_EMAIL_SERVER,
    ACCOUNT_CREATION_EMAIL_PORT,
    ACCOUNT_CREATION_EMAIL_FROM,
)

if not hasattr(pydantic.BaseModel, "Config"):
    class _Compat:
        arbitrary_types_allowed = True

    pydantic.BaseModel.Config = _Compat

ist = pytz.timezone("Asia/Kolkata")

conf = ConnectionConfig(
    MAIL_USERNAME=secrets.MAIL_USERNAME,
    MAIL_PASSWORD=secrets.MAIL_PASSWORD,
    MAIL_FROM=ACCOUNT_CREATION_EMAIL_FROM,
    MAIL_PORT=ACCOUNT_CREATION_EMAIL_PORT,
    MAIL_SERVER=ACCOUNT_CREATION_EMAIL_SERVER,
    MAIL_FROM_NAME=ACCOUNT_CREATION_EMAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


def generate_random_password(length: int = 10) -> str:
    """
    Generate a random password containing letters, digits, and special characters.
    """
    chars = string.ascii_letters + string.digits + "!@#$%^&*()"
    return ''.join(random.choice(chars) for _ in range(length))


async def send_email_to_student(email: str, subject: str, body: str) -> None:
    """
    Send an email to a student using the configured mail server.
    """
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[email],
            body=body,
            subtype="plain"
        )
        fm = FastMail(conf)
        await fm.send_message(message)

    except Exception as exc:
        logger.error(f"[Worker] Error sending email to {email}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email to {email}",
        )


def queue_email_task(
    email: str,
    subject: str,
    body: str,
    background_tasks: BackgroundTasks | None = None,
) -> None:
    """
    Queue an email sending task using FastAPI's background worker.

    Args:
        background_tasks (BackgroundTasks): FastAPI background task handler.
        email (str): Recipient email.
        subject (str): Email subject.
        body (str): Email content.
    """
    if background_tasks:
        background_tasks.add_task(send_email_to_student, email, subject, body)


async def send_email(to_email: str, subject: str, body: str) -> None:
    """
    Directly send an email without using background tasks.
    """
    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=body,
        subtype="plain",
    )
    fm = FastMail(conf)
    await fm.send_message(message)

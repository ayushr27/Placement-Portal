import random
import string
from datetime import datetime
import pytz
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.routes.utils import security
from motor.motor_asyncio import AsyncIOMotorDatabase
from src.services.config import secrets
from src.services.constants import (
    ACCOUNT_CREATION_EMAIL_FROM_NAME,
    ACCOUNT_CREATION_EMAIL_SERVER,
    ACCOUNT_CREATION_EMAIL_PORT,
    ACCOUNT_CREATION_EMAIL_FROM
)
ist = pytz.timezone('Asia/Kolkata')

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
    Generate a random password containing letters, digits,
    and special characters.

    Args:
        length (int): Desired password length (default is 10).

    Returns:
        str: Randomly generated password.
    """
    chars = string.ascii_letters + string.digits + "!@#$%^&*()"
    return ''.join(random.choice(chars) for _ in range(length))


async def send_email_to_student(email: str, subject: str, body: str) -> None:
    """
    Send an email to a student using the configured mail server.

    Args:
        email (str): Recipient's email address.
        subject (str): Email subject.
        body (str): Email body text.

    Raises:
        RuntimeError: If sending fails due to mail server issues.
    """
    try:

        message = MessageSchema(
            subject=subject,
            recipients=[email],
            body=body,
            subtype="plain",
        )

        fm = FastMail(conf)
        await fm.send_message(message)

    except Exception as exc:
        raise RuntimeError(f"Failed to send email to {email}") from exc

async def send_email(to_email: str, subject: str, body: str):
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[to_email],
            body=body,
            subtype="plain"
        )
        fm = FastMail(conf)
        await fm.send_message(message)
    except Exception as exc:
        raise RuntimeError(f"Failed to send email to {email}") from exc


async def send_email(to_email: str, subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=body,
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
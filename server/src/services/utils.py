import random
import string
import pytz
import pusher
import pydantic

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi import HTTPException, status

from src import logger
from src.config import secrets
from src.services.constants import (
    ACCOUNT_CREATION_EMAIL_FROM_NAME,
    ACCOUNT_CREATION_EMAIL_SERVER,
    ACCOUNT_CREATION_EMAIL_PORT,
    ACCOUNT_CREATION_EMAIL_FROM,
)

# Compatibility for older versions of Pydantic
if not hasattr(pydantic.BaseModel, "Config"):
    class _Compat:
        arbitrary_types_allowed = True

    pydantic.BaseModel.Config = _Compat

# Timezone configuration
ist = pytz.timezone("Asia/Kolkata")

# Email configuration
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

# Pusher configuration
pusher_client = pusher.Pusher(
    app_id=secrets.PUSHER_APP_ID,
    key=secrets.PUSHER_KEY,
    secret=secrets.PUSHER_SECRET,
    cluster="ap2",
    ssl=True,
)


def generate_random_password(length: int = 10) -> str:
    """
    Generate a random password containing letters, digits, and special characters.

    Args:
        length (int): Desired password length. Default is 10.

    Returns:
        str: Randomly generated password.
    """
    chars = string.ascii_letters + string.digits + "!@#$%^&*()"
    return ''.join(random.choice(chars) for _ in range(length))


def send_email_task(email: str, subject: str, body: str) -> None:
    """
    Push an email event to Pusher.

    Args:
        email (str): Recipient email.
        subject (str): Email subject.
        body (str): Email content.
    """
    pusher_client.trigger(
        "email-channel",
        "send-email-to-student",
        {
            "email": email,
            "subject": subject,
            "body": body,
        },
    )


async def send_email_to_student(email: str, subject: str, body: str) -> None:
    """
    Send an email to a student using the configured mail server.

    Args:
        email (str): Recipient's email address.
        subject (str): Email subject.
        body (str): Email body text.

    Raises:
        HTTPException: If sending fails due to mail server issues.
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
        logger.error(f"[Worker] Detailed error while sending email to {email}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email to {email}",
        )


async def send_email(to_email: str, subject: str, body: str) -> None:
    """
    Send an email using the configured FastMail connection.

    Args:
        to_email (str): Recipient email address.
        subject (str): Email subject.
        body (str): Email content.
    """
    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=body,
        subtype="plain",
    )
    fm = FastMail(conf)
    await fm.send_message(message)

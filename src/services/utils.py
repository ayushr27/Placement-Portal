import random
import string
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from src.config import secrets


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
        conf = ConnectionConfig(
            MAIL_USERNAME=secrets.MAIL_USERNAME,
            MAIL_PASSWORD=secrets.MAIL_PASSWORD,
            MAIL_FROM=secrets.MAIL_FROM,
            MAIL_PORT=secrets.MAIL_PORT,
            MAIL_SERVER=secrets.MAIL_SERVER,
            MAIL_FROM_NAME=getattr(secrets, "MAIL_FROM_NAME", "Admin Team"),
            MAIL_STARTTLS=secrets.MAIL_STARTTLS,
            MAIL_SSL_TLS=secrets.MAIL_SSL_TLS,
            USE_CREDENTIALS=secrets.USE_CREDENTIALS,
            VALIDATE_CERTS=secrets.VALIDATE_CERTS,
        )

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

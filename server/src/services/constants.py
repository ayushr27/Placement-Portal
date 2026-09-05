from src.config import secrets

ACCOUNT_CREATION_EMAIL_BODY = """
Hi {name},

Your student account for Placement Portal has been created.

Login credentials:
Username: {username}
Password: {password}

Please login and update your password.

Regards,
Training and Placement Cell, IIITDM Kurnool
"""
ACCOUNT_CREATION_EMAIL_FROM_NAME = "Training and Placement Cell IIITDM Kurnool"
ACCOUNT_CREATION_EMAIL_SERVER = "smtp.gmail.com"
ACCOUNT_CREATION_EMAIL_PORT = 587
# Sender identity comes from MAIL_FROM (falling back to the SMTP account), so
# that no individual's personal address is baked into the source.
ACCOUNT_CREATION_EMAIL_FROM = (
    secrets.MAIL_FROM or secrets.MAIL_USERNAME or "noreply@example.com"
)
EMAIL_STARTTLS = True
EMAIL_SSL_TLS = False
EMAIL_FROM_NAME = "Test Mailer"

BATCH_SIZE = 10
BATCH_DELAY_SECONDS = 10

GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/forms.responses.readonly",
]
# Must stay below the serverless function limit (10s Hobby / 60s Pro by
# default). At 60 the platform killed the invocation before `requests` ever
# timed out, so the admin saw a gateway error while Apps Script may already have
# created the sheet and repointed the form.
GOOGLE_APPS_SCRIPT_TIMEOUT = 8

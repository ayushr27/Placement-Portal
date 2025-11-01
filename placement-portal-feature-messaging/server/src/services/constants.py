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
ACCOUNT_CREATION_EMAIL_FROM = "dhruvsing2003@gmail.com"
EMAIL_STARTTLS = True
EMAIL_SSL_TLS = False
EMAIL_FROM_NAME = "Test Mailer"

BATCH_SIZE = 20
BATCH_DELAY_SECONDS = 10

GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/forms.responses.readonly",
]
GOOGLE_APPS_SCRIPT_TIMEOUT = 60
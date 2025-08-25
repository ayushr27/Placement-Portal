import requests
from fastapi import HTTPException, status
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest
from src.services.constants import GOOGLE_SCOPES
from src.config import secrets
from src import logger

GOOGLE_CLIENT_ID = secrets.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = secrets.GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI = secrets.GOOGLE_REDIRECT_URI


def _validate_env() -> None:
    """
    Ensure Google OAuth environment variables are set.

    Raises:
        RuntimeError: If any required variable is missing.
    """
    if not (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI):
        logger.error("Google OAuth environment variables are missing")
        raise RuntimeError("Google OAuth environment variables are not set.")


def get_oauth_flow() -> Flow:
    """
    Create an OAuth flow object using client config.

    Returns:
        Flow: OAuth 2.0 flow object.
    """
    _validate_env()
    return Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": [GOOGLE_REDIRECT_URI],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=GOOGLE_SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )


def get_google_auth_url() -> str:
    """
    Get Google OAuth authorization URL.

    Returns:
        str: Google auth URL.
    """
    try:
        flow = get_oauth_flow()
        auth_url, _ = flow.authorization_url(
            prompt="consent", access_type="offline", include_granted_scopes="true"
        )
        return auth_url
    except Exception as exc:
        logger.error("Error creating Google auth URL: %s", str(exc))
        raise


def credentials_to_dict(credentials: Credentials) -> dict:
    """
    Convert Google Credentials object to dictionary.

    Args:
        credentials (Credentials): Google OAuth credentials.

    Returns:
        dict: Dictionary with token information.
    """
    return {
        "access_token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }


def exchange_code_for_tokens(code: str) -> tuple[dict, dict]:
    """
    Exchange authorization code for access/refresh tokens and fetch user info.

    Args:
        code (str): OAuth authorization code.

    Returns:
        tuple[dict, dict]: (tokens, user_info)
    """
    try:
        flow = get_oauth_flow()
        flow.fetch_token(code=code)
        creds = flow.credentials
        tokens = credentials_to_dict(creds)

        response = requests.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            params={"alt": "json"},
            headers={"Authorization": f"Bearer {creds.token}"},
            timeout=10,
        )
        response.raise_for_status()
        user_info = response.json()
        return tokens, user_info
    except Exception as exc:
        logger.error("Failed to exchange code for tokens: %s", str(exc))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Google token exchange failed")


async def store_google_tokens(db, admin_id, tokens: dict) -> None:
    """
    Store Google OAuth tokens for an admin user.

    Args:
        db: MongoDB instance.
        admin_id: Admin document ID.
        tokens (dict): OAuth tokens.
    """
    try:
        await db.admins.update_one(
            {"_id": admin_id},
            {"$set": {"google_oauth": tokens}},
        )
        logger.info("Stored Google tokens for admin: %s", admin_id)
    except Exception as exc:
        logger.error("Failed to store Google tokens for %s: %s", admin_id, str(exc))
        raise


def get_google_service_for_admin(
    admin_doc: dict, service_name: str, version: str
):
    """
    Get Google API service client for an admin.

    Args:
        admin_doc (dict): Admin document with OAuth tokens.
        service_name (str): Google service (e.g., 'sheets').
        version (str): API version.

    Returns:
        Resource: Google API client.
    """
    tokens = admin_doc.get("google_oauth")
    if not tokens:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Google account not linked.")

    creds = Credentials(
        tokens["access_token"],
        refresh_token=tokens.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=GOOGLE_SCOPES,
    )

    if creds.expired and creds.refresh_token:
        try:
            creds.refresh(GoogleRequest())
        except Exception as exc:
            logger.error("Token refresh failed: %s", str(exc))
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google token refresh failed")

    return build(service_name, version, credentials=creds)


def create_sheet(admin_doc: dict, title: str, roll_numbers: list[str]) -> str:
    """
    Create a Google Sheet with roll numbers.

    Args:
        admin_doc (dict): Admin with linked Google account.
        title (str): Sheet title.
        roll_numbers (list[str]): Roll numbers to insert.

    Returns:
        str: Spreadsheet ID.
    """
    try:
        sheets_service = get_google_service_for_admin(admin_doc, "sheets", "v4")
        spreadsheet = {"properties": {"title": title}}
        sheet = (
            sheets_service.spreadsheets()
            .create(body=spreadsheet, fields="spreadsheetId")
            .execute()
        )
        spreadsheet_id = sheet.get("spreadsheetId")

        # Add header
        sheets_service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range="Sheet1!1:1",
            valueInputOption="RAW",
            body={"values": [["Roll No."]]},
        ).execute()

        # Add roll numbers
        roll_values = [[r] for r in roll_numbers]
        sheets_service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range=f"Sheet1!A2:A{len(roll_numbers)+1}",
            valueInputOption="RAW",
            body={"values": roll_values},
        ).execute()

        logger.info("Created Google Sheet with ID: %s", spreadsheet_id)
        return spreadsheet_id
    except Exception as exc:
        logger.error("Failed to create Google Sheet: %s", str(exc))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Google Sheets creation failed")


def fetch_form_responses(
    admin_doc: dict, responses_sheet_link: str, range_name: str = "Form Responses 1!A:Z"
) -> list[dict]:
    """
    Fetch responses from a Google Form's linked sheet.

    Args:
        admin_doc (dict): Admin with linked Google account.
        responses_sheet_link (str): Google Sheet link.
        range_name (str): Range to read.

    Returns:
        list[dict]: Parsed responses (header -> value).
    """
    try:
        sheet_id = responses_sheet_link.split("/d/")[1].split("/")[0]
    except Exception:
        logger.warning("Invalid Google Sheet link provided")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Google Sheet link")

    try:
        sheets_service = get_google_service_for_admin(admin_doc, "sheets", "v4")
        result = (
            sheets_service.spreadsheets()
            .values()
            .get(spreadsheetId=sheet_id, range=range_name)
            .execute()
        )

        values = result.get("values", [])
        if not values or len(values) < 2:
            return []

        header = values[0]
        responses = [
            {header[i]: row[i] if i < len(row) else "" for i in range(len(header))}
            for row in values[1:]
        ]
        return responses
    except Exception as exc:
        logger.error("Failed to fetch form responses: %s", str(exc))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch form responses")

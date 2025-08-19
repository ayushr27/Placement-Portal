import os
from fastapi import HTTPException
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest
from dotenv import load_dotenv
import requests
load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

GOOGLE_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/forms.responses.readonly",
]


def _validate_env():
    if not (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI):
        raise RuntimeError("Google OAuth environment variables are not set.")


def get_oauth_flow() -> Flow:
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
    flow = get_oauth_flow()
    auth_url, _ = flow.authorization_url(
        prompt="consent", access_type="offline", include_granted_scopes="true"
    )
    return auth_url


def credentials_to_dict(credentials: Credentials) -> dict:
    return {
        "access_token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }


def exchange_code_for_tokens(code: str):
    flow = get_oauth_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials
    tokens = credentials_to_dict(creds)

    # Fetch user profile info (email, name, etc.)
    user_info_response = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        params={"alt": "json"},
        headers={"Authorization": f"Bearer {creds.token}"},
    )
    user_info = user_info_response.json()

    return tokens, user_info


async def store_google_tokens(db, admin_id, tokens: dict):
    await db.admins.update_one(
        {"_id": admin_id},
        {"$set": {"google_oauth": tokens}}
    )


def get_google_service_for_admin(admin_doc: dict, service_name: str, version: str):
    tokens = admin_doc.get("google_oauth")
    if not tokens:
        raise HTTPException(status_code=400, detail="Google account not linked.")

    creds = Credentials(
        tokens["access_token"],
        refresh_token=tokens.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=GOOGLE_SCOPES,
    )

    if creds.expired and creds.refresh_token:
        creds.refresh(GoogleRequest())

    return build(service_name, version, credentials=creds)


def create_sheet(admin_doc: dict, title: str, roll_numbers: list[str]) -> str:
    sheets_service = get_google_service_for_admin(admin_doc, "sheets", "v4")
    spreadsheet = {"properties": {"title": title}}
    sheet = sheets_service.spreadsheets().create(
        body=spreadsheet, fields="spreadsheetId"
    ).execute()
    spreadsheet_id = sheet.get("spreadsheetId")

    # First row: Roll No header
    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range="Sheet1!1:1",
        valueInputOption="RAW",
        body={"values": [["Roll No."]]},
    ).execute()

    # Populate roll numbers starting from A2
    roll_values = [[r] for r in roll_numbers]
    sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range=f"Sheet1!A2:A{len(roll_numbers)+1}",
        valueInputOption="RAW",
        body={"values": roll_values},
    ).execute()

    return spreadsheet_id
    



def fetch_form_responses(admin_doc: dict, responses_sheet_link: str, range_name: str = "Form Responses 1!A:Z") -> list[dict]:
    """
    Fetch responses from a Google Form's linked responses sheet.
    Returns a list of dicts (header -> value).
    """
    # Extract sheetId from link
    try:
        sheet_id = responses_sheet_link.split("/d/")[1].split("/")[0]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Google Sheet link")

    sheets_service = get_google_service_for_admin(admin_doc, "sheets", "v4")
    sheet = sheets_service.spreadsheets()

    result = sheet.values().get(
        spreadsheetId=sheet_id,
        range=range_name
    ).execute()

    values = result.get("values", [])
    if not values or len(values) < 2:
        return []

    header = values[0]
    responses = []
    for row in values[1:]:
        row_dict = {header[i]: row[i] if i < len(row) else "" for i in range(len(header))}
        responses.append(row_dict)

    return responses

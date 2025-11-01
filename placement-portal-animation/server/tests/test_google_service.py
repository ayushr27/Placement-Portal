import pytest
from fastapi import HTTPException
from src.services import google_service
from google.oauth2.credentials import Credentials


def test_validate_env_missing(monkeypatch):
    # Temporarily unset the secrets
    monkeypatch.setattr(google_service, "GOOGLE_CLIENT_ID", None)
    monkeypatch.setattr(google_service, "GOOGLE_CLIENT_SECRET", None)
    monkeypatch.setattr(google_service, "GOOGLE_REDIRECT_URI", None)

    with pytest.raises(RuntimeError) as exc_info:
        google_service._validate_env()
    assert "Google OAuth environment variables are not set" in str(exc_info.value)


def test_credentials_to_dict():
    creds = Credentials(
        token="access123",
        refresh_token="refresh123",
        token_uri="https://token.uri",
        client_id="cid123",
        client_secret="csecret123",
        scopes=["scope1", "scope2"],
    )
    result = google_service.credentials_to_dict(creds)
    expected = {
        "access_token": "access123",
        "refresh_token": "refresh123",
        "token_uri": "https://token.uri",
        "client_id": "cid123",
        "client_secret": "csecret123",
        "scopes": ["scope1", "scope2"],
    }
    assert result == expected


def test_fetch_form_responses_invalid_link():
    admin_doc = {"google_oauth": {"access_token": "dummy"}}
    invalid_link = "https://docs.google.com/invalid-link"

    with pytest.raises(HTTPException) as exc_info:
        google_service.fetch_form_responses(admin_doc, invalid_link)

    assert exc_info.value.status_code == 400
    assert "Invalid Google Sheet link" in exc_info.value.detail

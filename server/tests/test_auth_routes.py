"""
Regression tests for the login route's error mapping.

The reported bug: `POST /api/auth/token` wrapped *every* failure in a generic
500. `login_user` raises HTTPException(401) for bad credentials, but the route
only re-mapped ValueError, so the 401 fell through to `except Exception` and was
rewritten as 500 "Login failed due to server error". Bad password, dead
database, and a real crash were indistinguishable.
"""

import pytest
from fastapi import HTTPException, status
from fastapi.testclient import TestClient

import main
from src.database import get_database
from src.services import auth as auth_service


@pytest.fixture
def client():
    """TestClient with the MongoDB dependency stubbed out."""
    main.app.dependency_overrides[get_database] = lambda: object()
    yield TestClient(main.app)
    main.app.dependency_overrides.clear()


def _post_login(client):
    return client.post(
        "/api/auth/token",
        data={"username": "nobody@example.com", "password": "wrong"},
    )


def test_bad_credentials_return_401_not_500(client, monkeypatch):
    """Invalid credentials must surface as 401 with the real detail message."""

    async def fake_login_user(username, password, db):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    monkeypatch.setattr(auth_service, "login_user", fake_login_user)

    response = _post_login(client)

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_unexpected_error_still_returns_500(client, monkeypatch):
    """A genuine fault must still be masked as a generic 500."""

    async def exploding_login_user(username, password, db):
        raise RuntimeError("mongo is on fire")

    monkeypatch.setattr(auth_service, "login_user", exploding_login_user)

    response = _post_login(client)

    assert response.status_code == 500
    assert response.json()["detail"] == "Login failed due to server error"
    # The underlying error must not leak to the client.
    assert "mongo is on fire" not in response.text


def test_successful_login_returns_token(client, monkeypatch):
    async def fake_login_user(username, password, db):
        return {"access_token": "a.b.c", "token_type": "bearer"}

    monkeypatch.setattr(auth_service, "login_user", fake_login_user)

    response = _post_login(client)

    assert response.status_code == 200
    assert response.json() == {"access_token": "a.b.c", "token_type": "bearer"}

import pytest
import bcrypt
from datetime import timedelta, datetime, timezone
from jose import jwt
from fastapi import HTTPException

from src.routes.utils import security, ALGORITHM


@pytest.mark.asyncio
async def test_hash_and_verify_password():
    password = "test_password123"
    hashed = security.hash_password(password)

    assert hashed != password  # hash should not equal plaintext
    assert security.verify_password(password, hashed)
    assert not security.verify_password("wrong_password", hashed)


def test_create_and_decode_token():
    data = {"sub": "testuser", "role": "student"}
    token = security.create_access_token(data)
    decoded = security.decode_token(token)

    assert decoded["sub"] == "testuser"
    assert decoded["role"] == "student"


def test_expired_token_raises():
    data = {"sub": "testuser", "role": "student"}
    token = jwt.encode(
        {
            **data,
            "exp": datetime.now(timezone.utc) - timedelta(seconds=1)
        },
        security.secret_key,
        algorithm=ALGORITHM
    )

    with pytest.raises(HTTPException) as exc_info:
        security.decode_token(token)
    assert exc_info.value.status_code == 401
    assert "expired" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_authenticate_user_success_and_failure(mocker):
    fake_user = {
        "username": "testuser",
        "hashed_password": bcrypt.hashpw(
            "password123".encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")
    }

    async def fake_get_user(username, db):
        return fake_user

    mocker.patch("src.routes.utils.get_user", fake_get_user)

    creds = mocker.Mock(username="testuser", password="password123")
    user = await security.authenticate_user(mocker.Mock(), creds)
    assert user == fake_user

    creds_wrong = mocker.Mock(username="testuser", password="wrongpass")
    user = await security.authenticate_user(mocker.Mock(), creds_wrong)
    assert user is None
from datetime import datetime, timedelta, timezone
import secrets as token_secrets
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from src.config import secrets as app_secrets
from src.routes.utils import get_user, security
from src.services.utils import send_email
from src.services import google_service
from src import logger

# Maximum wrong OTP guesses before the reset request is discarded.
MAX_OTP_ATTEMPTS = 5

# Compared against when the username is unknown, so that a missing user costs
# the same time as a wrong password. Generated once at import.
DUMMY_PASSWORD_HASH = security.hash_password(token_secrets.token_urlsafe(16))


async def login_user(username: str, password: str, db: AsyncIOMotorDatabase):
    """
    Authenticate a user by username and password.

    Args:
        username (str): Username of the user.
        password (str): Plaintext password.
        db (AsyncIOMotorDatabase): MongoDB database instance.

    Returns:
        dict: Access token with type.

    Raises:
        HTTPException: If user not found or invalid credentials.
    """
    try:
        user = await get_user(username, db)

        # Always run a bcrypt comparison, even when the user does not exist, so
        # response time does not reveal which usernames are registered.
        stored_hash = user.get("hashed_password", "") if user else DUMMY_PASSWORD_HASH
        password_ok = security.verify_password(password, stored_hash)

        if not user or not password_ok:
            logger.warning("Failed login attempt for username: %s", username)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password"
            )

        collection = "students" if user.get("role") == "student" else "admins"
        await db[collection].update_one(
            {"username": user["username"]},
            {"$set": {"last_login": datetime.now(timezone.utc)}},
        )

        token = security.create_access_token(
            {"sub": user["username"], "role": user.get("role", "student")}
        )
        logger.info("User %s logged in successfully", username)
        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error during login for %s: %s", username, str(exc))
        raise


def get_google_auth_url() -> str:
    """
    Get Google OAuth authorization URL for admin login.

    Returns:
        str: Google OAuth URL.
    """
    return google_service.get_google_auth_url()


async def handle_admin_google_callback(
    code: str, db: AsyncIOMotorDatabase, state: Optional[str] = None
):
    """
    Handle Google OAuth callback for admin login.

    Args:
        code (str): Google OAuth code.
        db (AsyncIOMotorDatabase): MongoDB database instance.

    Returns:
        dict: Access token with type.

    Raises:
        HTTPException: If authentication fails or user not authorized.
    """
    try:
        # Reject callbacks we did not initiate (OAuth CSRF).
        google_service.consume_state(state)
        tokens, user_info = google_service.exchange_code_for_tokens(code)
        email = (user_info or {}).get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Google authentication failed")

        admin = await db.admins.find_one({"email": email})
        if not admin:
            raise HTTPException(status_code=403, detail="Not authorized")

        await google_service.store_google_tokens(db, admin["_id"], tokens)

        jwt_token = security.create_access_token(
            {"sub": admin["username"], "role": "admin"}
        )
        logger.info("Admin %s logged in via Google", email)
        return {"access_token": jwt_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Google OAuth callback error: %s", str(exc))
        raise


async def reset_user_password(
    username: str,
    role: str,
    old_password: str,
    new_password: str,
    db: AsyncIOMotorDatabase,
):
    """
    Reset a user's password given the old password.

    Args:
        username (str): Username of the user.
        role (str): User role (student/admin).
        old_password (str): Current password.
        new_password (str): New password.
        db (AsyncIOMotorDatabase): MongoDB database instance.

    Returns:
        dict: Status message.

    Raises:
        HTTPException: If user not found or old password is incorrect.
    """
    try:
        collection = "students" if role == "student" else "admins"
        user = await db[collection].find_one({"username": username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not security.verify_password(old_password, user["hashed_password"]):
            raise HTTPException(status_code=401, detail="Old password incorrect")

        hashed_new = security.hash_password(new_password)
        await db[collection].update_one(
            {"username": username},
            {"$set": {"hashed_password": hashed_new, "is_first_login": False}},
        )
        logger.info("Password updated for user: %s", username)
        return {"status": "Password updated successfully"}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Password reset error for %s: %s", username, str(exc))
        raise


async def forgot_password_request_service(email: str, db: AsyncIOMotorDatabase):
    """
    Generate and send OTP for password reset.

    Args:
        email (str): User email.
        db (AsyncIOMotorDatabase): MongoDB database instance.

    Returns:
        dict: Status message.

    Raises:
        HTTPException: If user not found.
    """
    try:
        # The OTP can only reach the user by email, so without SMTP this flow
        # cannot work. Say so plainly instead of failing as an opaque 500.
        if not app_secrets.mail_enabled:
            logger.warning("Password reset requested but mail is not configured")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Password reset is unavailable because email is not "
                    "configured on the server. Please contact the placement cell."
                ),
            )

        user = await get_user(email, db)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # secrets.randbelow is CSPRNG-backed; random.randint is predictable and
        # must never generate a credential.
        otp = f"{token_secrets.randbelow(1_000_000):06d}"
        hashed_otp = security.hash_password(otp)
        expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

        await db["forgot-password"].delete_many({"email": email})
        await db["forgot-password"].insert_one(
            {
                "email": email,
                "otp_hash": hashed_otp,
                "expiry": expiry,
                "purpose": "password_reset",
                "verified": False,
                "attempts": 0,
            }
        )
        await send_email(email, "Your password reset code", f"Your OTP is: {otp}")
        logger.info("OTP sent to %s", email)
        return {"message": "OTP sent to your email"}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error in forgot password request for %s: %s", email, str(exc))
        raise


async def forgot_password_verify_service(
    email: str, otp: str, db: AsyncIOMotorDatabase
):
    """
    Verify OTP for password reset and issue reset token.

    Args:
        email (str): User email.
        otp (str): OTP received by the user.
        db (AsyncIOMotorDatabase): MongoDB database instance.

    Returns:
        dict: Reset token.

    Raises:
        HTTPException: If OTP is invalid, expired, or no request found.
    """
    try:
        token_doc = await db["forgot-password"].find_one(
            {"email": email, "purpose": "password_reset"}
        )
        if not token_doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No OTP request found")

        # A 6-digit OTP is trivially brute-forceable without a cap.
        if token_doc.get("attempts", 0) >= MAX_OTP_ATTEMPTS:
            await db["forgot-password"].delete_many({"email": email})
            logger.warning("OTP attempt limit exceeded for %s", email)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many incorrect attempts. Request a new code.",
            )

        expiry = token_doc["expiry"].replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > expiry:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP expired")

        if not security.verify_password(otp, token_doc["otp_hash"]):
            await db["forgot-password"].update_one(
                {"_id": token_doc["_id"]}, {"$inc": {"attempts": 1}}
            )
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

        await db["forgot-password"].update_one(
            {"_id": token_doc["_id"]}, {"$set": {"verified": True}}
        )
        user = await get_user(email, db)
        token = security.create_access_token(
            {"sub": user["username"], "role": user["role"], "action": "reset_password"},
            expires_delta=timedelta(minutes=10),
        )
        logger.info("OTP verified for %s", email)
        return {"reset_token": token}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error in OTP verification for %s: %s", email, str(exc))
        raise


async def forgot_password_reset_service(
    new_password: str, token: str, db: AsyncIOMotorDatabase
):
    """
    Reset a user's password using a valid reset token.

    Args:
        new_password (str): New password.
        token (str): Reset token.
        db (AsyncIOMotorDatabase): MongoDB database instance.

    Returns:
        dict: Status message.

    Raises:
        HTTPException: If token invalid, OTP not verified, or user not found.
    """
    try:
        payload = security.decode_token(token)
        if payload.get("action") != "reset_password":
            raise HTTPException(status_code=400, detail="Invalid reset token")

        email_or_username = payload["sub"]
        user = await get_user(email_or_username, db)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        token_doc = await db["forgot-password"].find_one(
            {"email": user["email"], "purpose": "password_reset"}
        )
        if not token_doc or not token_doc["verified"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP not verified")

        hashed_pw = security.hash_password(new_password)
        collection = "students" if user["role"] == "student" else "admins"
        await db[collection].update_one(
            {"username": user["username"]}, {"$set": {"hashed_password": hashed_pw}}
        )
        logger.info("Password reset completed for %s", email_or_username)
        return {"message": "Password reset successful"}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error in forgot password reset: %s", str(exc))
        raise

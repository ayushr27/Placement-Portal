from datetime import datetime, timedelta, timezone
import random
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from src.routes.utils import get_user, security
from src.services.utils import send_email
from src.services import google_service
# from src.services.utils import ist

#username/password login
async def login_user(username: str, password: str, db: AsyncIOMotorDatabase):
    user = await get_user(username, db)
    if not user or not security.verify_password(password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    collection = "students" if user.get("role") == "student" else "admins"
    await db[collection].update_one(
        {"username": user["username"]},
        {"$set": {"last_login": datetime.now(timezone.utc)}}
    )

    token = security.create_access_token({"sub": user["username"], "role": user.get("role", "student")})
    return {"access_token": token, "token_type": "bearer"}

#Google OAuth for admins
def get_google_auth_url() -> str:
    return google_service.get_google_auth_url()

async def handle_admin_google_callback(code: str, db: AsyncIOMotorDatabase):
    tokens, user_info =  google_service.exchange_code_for_tokens(code)
    email = (user_info or {}).get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google authentication failed")

    admin = await db.admins.find_one({"email": email})
    if not admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    await google_service.store_google_tokens(db, admin["_id"], tokens)

    jwt_token = security.create_access_token({"sub": admin["username"], "role": "admin"})
    return {"access_token": jwt_token, "token_type": "bearer"}

#Password & OTP flows
async def reset_user_password(username: str, role: str, old_password: str, new_password: str, db: AsyncIOMotorDatabase):
    collection = "students" if role == "student" else "admins"
    user = await db[collection].find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not security.verify_password(old_password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Old password incorrect")

    hashed_new = security.hash_password(new_password)
    await db[collection].update_one({"username": username}, {"$set": {"hashed_password": hashed_new, "is_first_login": False}})
    return {"status": "Password updated successfully"}

async def forgot_password_request_service(email: str, db: AsyncIOMotorDatabase):
    user = await get_user(email, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = str(random.randint(100000, 999999))
    hashed_otp = security.hash_password(otp)
    expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

    await db["forgot-password"].delete_many({"email": email})
    await db["forgot-password"].insert_one({
        "email": email,
        "otp_hash": hashed_otp,
        "expiry": expiry,
        "purpose": "password_reset",
        "verified": False
    })
    await send_email(email, "Your password reset code", f"Your OTP is: {otp}")
    return {"message": "OTP sent to your email"}

async def forgot_password_verify_service(email: str, otp: str, db: AsyncIOMotorDatabase):
    token_doc = await db["forgot-password"].find_one({"email": email, "purpose": "password_reset"})
    if not token_doc:
        raise HTTPException(status_code=404, detail="No OTP request found")
    if not security.verify_password(otp, token_doc["otp_hash"]):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    expiry = token_doc["expiry"].replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expiry:
        raise HTTPException(status_code=400, detail="OTP expired")

    await db["forgot-password"].update_one({"_id": token_doc["_id"]}, {"$set": {"verified": True}})
    user = await get_user(email, db)
    token = security.create_access_token(
        {"sub": user["username"], "role": user["role"], "action": "reset_password"},
        expires_delta=timedelta(minutes=10)
    )
    return {"reset_token": token}

async def forgot_password_reset_service(new_password: str, token: str, db: AsyncIOMotorDatabase):
    payload = security.decode_token(token)
    if payload.get("action") != "reset_password":
        raise HTTPException(status_code=400, detail="Invalid reset token")

    email_or_username = payload["sub"]
    user = await get_user(email_or_username, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token_doc = await db["forgot-password"].find_one({"email": user["email"], "purpose": "password_reset"})
    if not token_doc or not token_doc["verified"]:
        raise HTTPException(status_code=400, detail="OTP not verified")

    hashed_pw = security.hash_password(new_password)
    collection = "students" if user["role"] == "student" else "admins"
    await db[collection].update_one({"username": user["username"]}, {"$set": {"hashed_password": hashed_pw}})
    return {"message": "Password reset successful"}

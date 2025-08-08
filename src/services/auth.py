from fastapi import HTTPException, status
from src.routes.utils import security, get_user


async def authenticate_user(username: str, password: str, db):
    """
    Authenticate a user against the database.

    Raises:
        HTTPException: 401 if credentials are invalid.
    """
    user = await get_user(username, db)
    if not user or not security.verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    return user


async def reset_user_password(password_data, current_user, db):
    """
    Reset a user's password.

    Raises:
        HTTPException: 404 if user not found.
        HTTPException: 401 if old password is incorrect.
    """
    role = current_user.get("role", "student")
    username = current_user.get("username")

    collection_name = "students" if role == "student" else "admins"
    user = await db[collection_name].find_one({"username": username})

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not security.verify_password(password_data.old_password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Old password incorrect")

    hashed_new = security.hash_password(password_data.new_password)
    await db[collection_name].update_one(
        {"username": username},
        {"$set": {"hashed_password": hashed_new, "is_first_login": False}},
    )

    return {"status": "Password updated successfully"}

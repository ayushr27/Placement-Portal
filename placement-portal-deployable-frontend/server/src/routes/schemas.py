from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class TokenData(BaseModel):
    username: Optional[str] = None


class PasswordResetSchema(BaseModel):
    old_password: Optional[str] = Field(
        None, min_length=6, description="Old password must be at least 6 characters"
    )
    new_password: str = Field(
        ..., min_length=6, description="New password must be at least 6 characters"
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class TokenRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserResponseStudent(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., min_length=2, max_length=100)
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$")
    email: EmailStr
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    roll_number: str = Field(..., min_length=3, max_length=20)
    branch: str
    course: Optional[str] = None
    year: int = Field(..., ge=1, le=10)
    phone_no: Optional[str] = Field(None, pattern=r"^\+?\d{7,15}$")
    role: str = "student"


class UserResponseAdmin(BaseModel):
    id: str
    username: str = Field(..., min_length=3, max_length=50)
    role: str
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class Token(BaseModel):
    access_token: str
    token_type: str


class JobPost(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=10)
    company: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=100)
    salary: str = Field(..., min_length=1)

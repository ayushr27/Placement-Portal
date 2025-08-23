from datetime import datetime
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field


class StudentCreate(BaseModel):
    name: str
    gender: Optional[str] = None
    email: EmailStr
    roll_number: str
    branch: str
    course: Optional[str] = None
    batch: int
    phone_no: Optional[str] = None
    password: str


class StudentInDB(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    gender: Optional[str] = None
    email: EmailStr
    username: Optional[str] = None  # Email can be used as username
    roll_number: str
    branch: str
    course: Optional[str] = None
    batch: int
    phone_no: Optional[str] = None
    hashed_password: str
    role: str = "student"
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    name: str


class AdminInDB(BaseModel):
    id: str = Field(alias="_id")
    username: str
    email: EmailStr
    name: str
    hashed_password: str
    role: str = "admin"
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}



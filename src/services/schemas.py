from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class StudentCreate(BaseModel):
    name: str
    gender: Optional[str] = None
    email: EmailStr
    roll_number: str
    branch: str
    course: Optional[str] = None
    year: int
    phone_no: Optional[str] = None
    password: str

class StudentInDB(BaseModel):
    id: Optional[str] = None
    name: str
    gender: Optional[str] = None
    email: EmailStr
    username: Optional[str] = None  # Can use email as username
    roll_number: str
    branch: str
    course: Optional[str] = None
    year: int
    phone_no: Optional[str] = None
    hashed_password: str
    role: str = "student"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True 
        arbitrary_types_allowed = True
        json_encoders = {
            "ObjectId": lambda oid: str(oid)
        }

class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    name: str

class AdminInDB(BaseModel):
    id: Optional[str] = None
    username: str
    email: EmailStr
    name: str
    hashed_password: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True 
        arbitrary_types_allowed = True
        json_encoders = {
            "ObjectId": lambda oid: str(oid)
        }

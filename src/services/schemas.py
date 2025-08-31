from datetime import datetime,date
from typing import Optional, Union

from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field


class StudentCreate(BaseModel):
    name: str
    gender: Optional[str] = None
    email: EmailStr
    roll_number: str
    branch: Optional[str] = None
    course: Optional[str] = None
    batch: Optional[int] = None
    phone_no: Optional[str] = None
    password: str



class StudentInDB(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    gender: Optional[str] = None
    email: EmailStr
    date_of_birth: Optional[datetime] = None
    phone_no: Optional[str] = None
    username: Optional[str] = None
    roll_number: str
    branch: Optional[str] = None
    course: Optional[str] = None
    batch: Optional[int] = None
    ssc_cgpa: Optional[Union[float, str]] = None
    hsc_cgpa: Optional[Union[float, str]] = None
    btech_cgpa: Optional[Union[float, str]] = None
    mtech_cgpa: Optional[Union[float, str]] = None
    backlogs: Optional[int] = 0
    current_address: Optional[str] = None
    permanent_address: Optional[str] = None
    linkedin_link: Optional[str] = None
    github_link: Optional[str] = None
    resume_link: Optional[str] = None
    hashed_password: str
    role: str = "student"
    has_edited_profile: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    career_path: Optional[str] = None

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


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
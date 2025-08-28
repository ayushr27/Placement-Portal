from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import pytz
from bson import ObjectId


def ist():
    tz = pytz.timezone("Asia/Kolkata")
    return datetime.now(tz)


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
    id: str = Field(alias="_id")
    name: str = Field(..., min_length=2, max_length=100)
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$")
    email: EmailStr
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    roll_number: str = Field(..., min_length=3, max_length=20)
    branch: str
    course: Optional[str] = None
    batch: int
    phone_no: Optional[str] = None
    role: str = "student"


class UserResponseAdmin(BaseModel):
    id: str
    username: str = Field(..., min_length=3, max_length=50)
    role: str
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class StudentProfileUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    phone_no: Optional[str] = None


class AdminProfileUpdate(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class Token(BaseModel):
    access_token: str
    token_type: str


class JobCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    company: str = Field(..., min_length=2, max_length=200)
    batch: list[int] = Field(..., min_items=1, max_items=4)
    CG_Cutoff: Optional[float] = Field(None, ge=0.0, le=10.0)
    gender_preference: Optional[List[str]] = Field(None, min_items=1, max_items=2)
    location: Optional[str] = Field(None, min_length=2, max_length=200)
    form_link: str = Field(..., min_length=5, max_length=500)
    application_deadline: Optional[datetime] = None
    job_description: Optional[str] = None



class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    batch: Optional[List[int]] = None
    CG_Cutoff: Optional[float] = None
    gender_preference: Optional[List[str]] =None
    location: Optional[str] = None
    form_link: Optional[str] = None
    application_deadline: Optional[datetime] = None
    job_description: Optional[str] = None

class JobInDB(JobCreate):
    id: str = Field(alias="_id")
    created_by: str
    created_at: datetime = Field(default_factory=ist)
    updated_at: datetime = Field(default_factory=ist)
    responses_sheet_link: str
    master_sheet_id: str
    master_sheet_link: str
    synced: bool = False

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }


class JobResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    company: str
    batch: list[int]
    gender_preference: Optional[List[str]] = None
    location: Optional[str] = None
    CG_Cutoff: Optional[float] = None
    form_link: str
    application_deadline: Optional[datetime] = None
    responses_sheet_link: Optional[str] = None
    master_sheet_id: str
    master_sheet_link: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }


class JobMetricsRequest(BaseModel):
    job_id: str = Field(..., min_length=1, description="Unique Job ID")


class MasterSheetInDB(BaseModel):
    _id: str
    admin_id: Optional[str] = None
    batch_year: Optional[List[int]] = None
    spreadsheet_id: Optional[str] = None
    created_at: Optional[datetime] = None


class MasterSheetResponse(BaseModel):
    _id: str
    admin_id: Optional[str] = None
    batch_year: Optional[List[int]] = None
    spreadsheet_id: Optional[str] = None
    created_at: Optional[str] = None


class AdminEditStudentProfile(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    phone_no: Optional[str] = None
    course: Optional[str] = None
    batch: Optional[int] = None
    year: Optional[int] = None
    roll_number: Optional[str] = None
    branch: Optional[str] = None


class StudentEditProfile(BaseModel): 
    name: Optional[str] = None 
    gender: Optional[str] = None 
    phone_no: Optional[str] = None    
from pydantic import BaseModel, EmailStr, Field, ConfigDict ,HttpUrl
from typing import Optional, List
from datetime import datetime, timedelta
import pytz
def ist():
    tz = pytz.timezone("Asia/Kolkata")
    return datetime.now(tz)
class TokenData(BaseModel):
    username: str | None = None

class PasswordResetSchema(BaseModel):
    old_password: Optional[str] = None
    new_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class TokenRequest(BaseModel):
    username: str
    password: str

class UserResponseStudent(BaseModel):
    id: Optional[str] = None
    name: str
    gender: Optional[str] = None
    email: EmailStr
    username: Optional[str] = None  
    roll_number: str
    branch: str
    course: Optional[str] = None
    batch: int
    phone_no: Optional[str] = None
    role: str = "student"

class UserResponseAdmin(BaseModel):
    id: str
    username: str
    role: str
    name: str 
    email: str 

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

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


class JobInDB(JobCreate):
    id: str 
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(ist))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(ist))
    location: Optional[str] = None
    gender_preference: Optional[List[str]] = None
    CG_Cutoff: Optional[float] = None
    form_link: str
    application_deadline: Optional[datetime] = None
    responses_sheet_link: str
    master_sheet_id: str
    master_sheet_link: str


class JobResponse(BaseModel):
    id: str  
    title: str
    company: str
    batch: list[int]
    gender_preference: Optional[List[str]] = None
    location: Optional[str] = None
    CG_Cutoff: Optional[float] = None
    form_link: str
    application_deadline: Optional[datetime] = None
    responses_sheet_link: str
    master_sheet_id: str
    master_sheet_link: str
    
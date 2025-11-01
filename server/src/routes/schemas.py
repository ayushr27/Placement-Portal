from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Union
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
    id: Optional[str] = Field(default=None, alias="_id", description="Unique identifier for the student")
    name: str = Field(..., description="Full name of the student")
    gender: Optional[str] = Field(None, description="Gender of the student")
    email: EmailStr = Field(..., description="Email address of the student")
    date_of_birth: Optional[datetime] = Field(None, description="Date of birth in YYYY-MM-DD format")
    phone_no: Optional[str] = Field(None, description="Contact number of the student")
    username: Optional[str] = Field(None, description="Username for login")
    roll_number: str = Field(..., description="Unique roll number assigned to the student")
    branch: Optional[str] = Field(None, description="Branch of study, e.g., Computer Science and Engineering")
    course: Optional[str] = Field(None, description="Course name, e.g., Bachelor of Technology")
    batch: Optional[int] = Field(None, ge=2000, le=2100, description="Year of graduation")
    ssc_cgpa: Optional[Union[float, str]] = Field(None, description="CGPA in 10th standard or 'NA'")
    hsc_cgpa: Optional[Union[float, str]] = Field(None, description="CGPA in 12th standard or 'NA'")
    btech_cgpa: Optional[Union[float, str]] = Field(None, description="CGPA in B.Tech or 'NA'")
    mtech_cgpa: Optional[Union[float, str]] = Field(None, description="CGPA in M.Tech or 'NA'")
    backlogs: Optional[int] = Field(0, description="Number of active backlogs, default is 0")
    current_address: Optional[str] = Field(None, description="Current residential address")
    permanent_address: Optional[str] = Field(None, description="Permanent residential address")
    linkedin_link: Optional[str] = Field(None, description="Link to LinkedIn profile")
    github_link: Optional[str] = Field(None, description="Link to GitHub profile")
    resume_link: Optional[str] = Field(None, description="Link to uploaded resume")
    aadhar_card_link: Optional[str] = Field(None, description="Link to Aadhar card document")
    pan_card_link: Optional[str] = Field(None, description="Link to PAN card document")
    role: str = Field("student", description="Role of the user, default is 'student'")
    career_path: Optional[str] = Field(None, description="Future career preference: Higher Studies or Placements")
    has_edited_profile: bool = Field(False, description="Indicates whether the student has edited their profile")


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
    company_name: str = Field(..., min_length=2, max_length=200)
    website: Optional[str] = Field(None)
    linkedin_link: Optional[str] = Field(None)
    address: Optional[str] = Field(None)
    batch: List[int] = Field(..., min_items=1)
    work_location: Optional[str] = Field(None)
    job_designation: Optional[str] = Field(None)
    type_of_employment: Optional[str] = Field(None)
    eligibility_criteria: Optional[str] = Field(None)
    cgpa_eligibility: Optional[float] = Field(None, ge=0.0, le=10.0)
    applicable_branch: Optional[str] = Field(None)
    stipend: Optional[str] = Field(None)
    ctc: Optional[str] = Field(None)
    other_benefits: Optional[str] = Field(None)
    bond: Optional[str] = Field(None)
    job_description: Optional[str] = Field(None)
    about_company: Optional[str] = Field(None)
    selection_process: Optional[List[str]] = Field(None, min_items=1)
    form_link: Optional[str] = Field(None)
    application_deadline: Optional[datetime] = None


class JobUpdate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=200)
    website: Optional[str] = Field(None)
    linkedin_link: Optional[str] = Field(None)
    address: Optional[str] = Field(None)
    batch: List[int] = Field(..., min_items=1)
    work_location: Optional[str] = Field(None)
    job_designation: Optional[str] = Field(None)
    type_of_employment: Optional[str] = Field(None)
    eligibility_criteria: Optional[str] = Field(None)
    cgpa_eligibility: Optional[float] = Field(None, ge=0.0, le=10.0)
    applicable_branch: Optional[str] = Field(None)
    stipend: Optional[str] = Field(None)
    ctc: Optional[str] = Field(None)
    other_benefits: Optional[str] = Field(None)
    bond: Optional[str] = Field(None)
    job_description: Optional[str] = Field(None)
    about_company: Optional[str] = Field(None)
    selection_process: Optional[List[str]] = Field(None, min_items=1)
    form_link: Optional[str] = Field(None)
    application_deadline: Optional[datetime] = None


class JobInDB(JobCreate):
    id: str = Field(alias="_id")
    created_by: str
    created_at: datetime = Field(default_factory=ist)
    updated_at: datetime = Field(default_factory=ist)
    responses_sheet_link: str
    master_sheet_id: str
    master_sheet_link: str
    synced: bool = False

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )


class JobResponse(BaseModel):
    id: str = Field(alias="_id")
    company_name: str
    website: Optional[str] = None
    linkedin_link: Optional[str] = None
    address: Optional[str] = None
    batch: List[int] = Field(..., min_items=1)
    work_location: Optional[str] = None
    job_designation: Optional[str] = None
    type_of_employment: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    cgpa_eligibility: Optional[float] = None
    applicable_branch: Optional[str] = None
    stipend: Optional[str] = None
    ctc: Optional[str] = None
    other_benefits: Optional[str] = None
    bond: Optional[str] = None
    job_description: Optional[str] = None
    about_company: Optional[str] = None
    selection_process: Optional[List[str]] = None
    form_link: Optional[str] = None
    application_deadline: Optional[datetime] = None
    responses_sheet_link: Optional[str] = None
    master_sheet_id: str
    master_sheet_link: str
    synced: Optional[bool] = False
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )


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
    email: EmailStr
    date_of_birth: Optional[datetime] = Field(
        None, description="Date of birth in format YYYY-MM-DD"
    )
    phone_no: Optional[str] = None
    username: Optional[str] = Field(
        None, min_length=3, max_length=50, description="Username will be used for login"
    )
    roll_number: str
    branch: Optional[str] = Field(
        None,
        min_length=2,
        max_length=100,
        description="Write the Branch name in full, e.g., Computer Science and Engineering",
    )
    course: Optional[str] = Field(
        None,
        min_length=2,
        max_length=100,
        description="Write the Course name in full, e.g., Bachelor of Technology",
    )
    batch: Optional[int] = Field(
        None, ge=2000, le=2100, description="Batch year is your year of graduation"
    )
    ssc_cgpa: Optional[Union[float, str]] = Field(
        None, description="CGPA in 10-point scale of class 10th or 'NA'"
    )
    hsc_cgpa: Optional[Union[float, str]] = Field(
        None, description="CGPA in 10-point scale of class 12th or 'NA'"
    )
    btech_cgpa: Optional[Union[float, str]] = Field(
        None, description="CGPA in 10-point scale of B.Tech or 'NA'"
    )
    mtech_cgpa: Optional[Union[float, str]] = Field(
        None, description="CGPA in 10-point scale of M.Tech or 'NA'"
    )
    backlogs: Optional[int] = 0
    current_address: Optional[str] = None
    permanent_address: Optional[str] = None
    linkedin_link: Optional[str] = None
    github_link: Optional[str] = None
    resume_link: Optional[str] = None
    aadhar_card_link: Optional[str] = None
    pan_card_link: Optional[str] = None
    role: str = "student"
    career_path: Optional[str] = None

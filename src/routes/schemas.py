from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List

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
    year: int
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
    

class JobPost(BaseModel):
    title: str
    description: str
    company: str
    location: str
    salary: str  
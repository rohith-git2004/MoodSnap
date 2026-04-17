from pydantic import BaseModel
from typing import Optional

class LoginSchema(BaseModel):
    username: str
    role: str

class MoodCreateSchema(BaseModel):
    userId: str
    role: str
    mood: str
    note: Optional[str] = ""
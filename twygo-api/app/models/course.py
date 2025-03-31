# app.models.course
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class Lesson(BaseModel):
    title: str
    description: str
    video_id: Optional[str] = None
    video_size_mb: Optional[float] = None
    transcript: Optional[str] = None
    created_at: datetime = datetime.utcnow()

class Course(BaseModel):
    title: str
    description: str
    end_date: datetime
    video_size_mb: Optional[float] = None
    video_id: Optional[str] = None
    transcript: Optional[str] = None

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    end_date: Optional[datetime] = None
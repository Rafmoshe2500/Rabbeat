from typing import List, Dict, Any

from pydantic import BaseModel

from models.lesson import LessonDetails
from models.profile import TeacherProfile
from models.user import User


class LessonDetails(BaseModel):
    _id: str
    audio: str
    highlightsTimestamps: List[float]
    sttText: str
    text: Dict[str, Any]


class ResponseTeacherProfile(User, TeacherProfile):
    pass


class LessonResponse(BaseModel):
    lessonId: str
    userId: str
    details: LessonDetails


class ExtendLessonResponse(LessonResponse):
    status: str


class ExtendLessonDetailsResponse(LessonDetails):
    status: str

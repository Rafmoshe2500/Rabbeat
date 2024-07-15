from typing import List, Dict, Any

from pydantic import BaseModel

from models.lesson import LessonMetadata
from models.profile import TeacherProfile
from models.user import User


class LessonDetail(BaseModel):
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
    metadata: LessonMetadata


class ExtendLessonResponse(LessonResponse):
    status: str


class ExtendLessonMetadataResponse(LessonMetadata):
    status: str

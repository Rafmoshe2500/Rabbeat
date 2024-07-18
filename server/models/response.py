from typing import List, Dict, Any

from pydantic import BaseModel

from models.profile import TeacherProfile
from models.user import User


class LessonDetailsResponse(BaseModel):
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
    details: LessonDetailsResponse


class ExtendLessonResponse(LessonResponse):
    status: str


class ExtendLessonDetailsResponse(LessonDetailsResponse):
    status: str


class StudyZoneResponse(BaseModel):
    chatId: str
    testAudioId: str
    status: str

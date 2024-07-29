from typing import List, Dict, Any

from pydantic import BaseModel

from models.lesson import LessonDetails
from models.profile import TeacherProfile
from models.user import User


class LessonResponse(BaseModel):
    _id: str
    audio: str
    highlightsTimestamps: List[float]
    sttText: str
    text: Dict[str, Any]


class ResponseTeacherProfile(User, TeacherProfile):
    pass


class NotificationsDetails(BaseModel):
    audioNotification: bool
    messageNotifications: bool


class LessonDetailsResponse(BaseModel):
    lessonId: str
    userId: str
    details: LessonDetails


class StudyZoneResponse(BaseModel):
    chatId: str
    testAudioId: str
    status: str


class ExtendLessonDetailsResponse(LessonDetailsResponse):
    studyZoneDetails: StudyZoneResponse
    notificationsDetails: NotificationsDetails


class ResponseGetChatNotifications(BaseModel):
    studentUnread: int
    teacherUnread: int

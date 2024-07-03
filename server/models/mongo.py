# Pydantic models
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr


class LessonMetadata(BaseModel):
    title: str
    startChapter: str
    version: str
    startVerse: str
    endChapter: str
    endVerse: str
    pentateuch: str
    creationDate: datetime = datetime.now()


class Lesson(BaseModel):
    audio: str
    highlightsTimestamps: List[float]
    sttText: str
    metadata: LessonMetadata


class UserLessons(BaseModel):
    userId: str
    lessonId: str


class LessonsComments(BaseModel):
    userId: str
    lessonId: str
    time: float
    text: str


class LessonStatus(BaseModel):
    lessonId: str
    userId: str
    status: str = 'not-started'


class UpdateLessonStatusModel(BaseModel):
    inProgress: Optional[bool] = None
    finish: Optional[bool] = None


class Message(BaseModel):
    text: str
    user: str
    datetime: datetime


class ChatBotMessages(BaseModel):
    lessonId: str
    userId: str
    message: Message


class User(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: EmailStr
    phoneNumber: str
    address: str
    birthDay: str
    type: str  # (student/teacher)


class UserRegister(User):
    password: str
    confirm_password: str


class UserCredentials(BaseModel):
    email: EmailStr
    password: str


class LessonResponse(BaseModel):
    lessonId: str
    userId: str
    metadata: LessonMetadata


class ExtendLessonResponse(LessonResponse):
    status: str

# TODO Split to files

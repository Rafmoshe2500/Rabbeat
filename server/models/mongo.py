# Pydantic models
from datetime import datetime
from typing import List

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


class LessonComments(BaseModel):
    userId: str
    lessonId: str
    time: float
    text: str


class UpdateStatus(BaseModel):
    status: str


class UpdateComment(BaseModel):
    text: str


class LessonStatus(BaseModel):
    lessonId: str
    userId: str
    status: str = 'not-started'


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


class Recommendation(BaseModel):
    creationDate: datetime = datetime.now()
    studentId: str
    text: str


class Sample(BaseModel):
    audio: str
    title: str


class TeacherProfile(BaseModel):
    id: str
    image: str
    aboutMe: str
    recommendations: List[Recommendation]
    sampleIds: List[str]
    versions: List[str]


class UpdateProfile(BaseModel):
    key: str
    value: str | List[str | Recommendation]


class TestAudio(BaseModel):
    audio: str
    studentId: str
    lessonId: str


class StudentByTeacher(BaseModel):
    studentId: str
    lessonId: str

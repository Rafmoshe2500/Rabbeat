from typing import List

from datetime import datetime, timedelta
from pydantic import BaseModel, Field


class LessonDetails(BaseModel):
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
    details: LessonDetails


class CreateLesson(Lesson):
    teacherId: str


class AssociateUserToLesson(BaseModel):
    studentId: str
    teacherId: str
    lessonId: str


class DisassociateUserToLesson(BaseModel):
    lessonId: str
    studentId: str


class LessonComments(BaseModel):
    userId: str
    lessonId: str
    time: float
    text: str


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


class AssociateNewStudent(BaseModel):
    studentId: str
    teacherId: str
    expired_date: datetime = Field(default_factory=lambda: datetime.now() + timedelta(days=120))

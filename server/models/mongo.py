# Pydantic models
from typing import Optional, List

from pydantic import BaseModel


class Word(BaseModel):
    word: str
    start: float


class Lesson(BaseModel):
    title: str
    audio: str
    startChapter: str
    startVerse: str
    endChapter: str
    endVers: str
    pentateuch: str
    words: List[Word]


class Teacher(BaseModel):
    id: str
    email: str
    phoneNumber: str
    address: str
    firstName: str
    lastName: str
    brithDay: str
    dialects: List[str]
    picture: Optional[str]
    description: Optional[str]


class Student(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    phoneNumber: str
    address: str
    birthDay: str


class StudentLessons(BaseModel):
    studentId: str
    teacherId: str


class TeacherLessons(BaseModel):
    teacherId: str
    lessonId: str


class Comment(BaseModel):
    timestamp: float
    text: str


class LessonsComments(BaseModel):
    studentId: str
    lessonId: str
    comments: List[str]


class LessonStatus(BaseModel):
    lessonId: str
    studentId: str
    inProgress: bool
    finish: bool


class Message(BaseModel):
    text: str
    user: str
    # date: dateTime


class ChatBotMessages(BaseModel):
    lessonId: str
    studentId: str
    message: Message

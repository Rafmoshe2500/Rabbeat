# Pydantic models
import datetime
from typing import Optional, List, Dict

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
    lessonId: str


class TeacherLessons(BaseModel):
    teacherId: str
    lessonId: str


class LessonsComments(BaseModel):
    studentId: str
    lessonId: str
    comments: Dict[float, str]


class LessonStatus(BaseModel):
    lessonId: str
    studentId: str
    inProgress: bool
    finish: bool


class ChatBotMessages(BaseModel):
    lessonId: str
    studentId: str
    message: Dict[str, str, datetime]

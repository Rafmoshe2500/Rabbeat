# Pydantic models
from typing import Optional, List

from pydantic import BaseModel


class Audio(BaseModel):
    id: str
    teacherId: str
    audio: str
    startChapter: str
    startVerse: str
    endChapter: str
    endVers: str
    pentateuch: str
    text: str


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
    description: str


class Student(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    phoneNumber: str
    address: str
    birthDay: str


class StudentLesson(BaseModel):
    studentId: str
    teacherId: str
    audios: List[str]


class Comment(BaseModel):
    sender: str
    id: str
    text: str
    time: Optional[str]


class Comments(BaseModel):
    studentId: str
    teacherId: str
    audioId: str
    comments: List[str]

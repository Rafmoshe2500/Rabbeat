from datetime import datetime
from typing import List

from pydantic import BaseModel


class TestAudio(BaseModel):
    audio: str
    studentId: str
    lessonId: str


class Message(BaseModel):
    timestamp: datetime = datetime.now()
    sender: str
    type: str
    content: str


class ChatStudentTeacher(BaseModel):
    lessonId: str
    userId: str
    messages: List[Message] = []

from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class LessonTestAudio(BaseModel):
    audio: str


class Message(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.now)
    sender: str
    type: str
    content: str


class ChatStudentTeacher(BaseModel):
    lessonId: str
    userId: str
    messages: List[Message] = []

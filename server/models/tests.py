from datetime import datetime
from typing import List

from pydantic import BaseModel


class LessonTestAudio(BaseModel):
    audio: str


class Message(BaseModel):
    timestamp: datetime = datetime.now()
    sender: str
    type: str
    content: str


class ChatStudentTeacher(BaseModel):
    lessonId: str
    userId: str
    messages: List[Message] = []


class AudioCompareRequest(BaseModel):
    sourceText: str
    sttText: str
    testAudio: str  # base64 encoded audio
    lessonId: str

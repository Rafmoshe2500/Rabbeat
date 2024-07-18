# Pydantic models
from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class Recommendation(BaseModel):
    creationDate: datetime = Field(default_factory=datetime.now)
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

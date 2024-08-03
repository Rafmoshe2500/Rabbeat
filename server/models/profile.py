# Pydantic models
from datetime import datetime
from typing import List

from pydantic import BaseModel


class Recommendation(BaseModel):
    creationDate: datetime = datetime.now()
    studentId: str
    text: str


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


class Sample(BaseModel):
    audio: str
    title: str


class CreateSample(Sample):
    teacherId: str


class DeleteSample(BaseModel):
    sampleId: str

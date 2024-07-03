from collections import defaultdict
from typing import List, Dict, Any

from pydantic import BaseModel

from models.mongo import User


class LessonDetail(BaseModel):
    _id: str
    audio: str
    highlightsTimestamps: List[float]
    sttText: str
    text: Dict[str, Any]

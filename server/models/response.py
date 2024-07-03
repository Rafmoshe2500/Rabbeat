from collections import defaultdict
from typing import List, Dict, Any

from pydantic import BaseModel


class LessonDetail(BaseModel):
    _id: str
    audio: str
    highlightsTimestamps: List[float]
    sttText: str
    text: Dict[str, Any]
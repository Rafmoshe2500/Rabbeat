from collections import defaultdict
from typing import List, Dict, Any

from pydantic import BaseModel


class LessonResponse(BaseModel):
    audio: str
    highlightsTimestamps: List[float]
    text: Dict[str, Dict[str, Dict[str, Dict[str, Any]]]]

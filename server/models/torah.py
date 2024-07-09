from pydantic import BaseModel


class TextCompare(BaseModel):
    source: str
    sttText: str

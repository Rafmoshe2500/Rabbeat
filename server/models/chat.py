# Pydantic models

from pydantic import BaseModel


class ChatModule(BaseModel):
    message: str
    conversation_topic: str

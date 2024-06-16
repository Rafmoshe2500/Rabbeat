from fastapi import APIRouter, HTTPException
from models.mongo import ChatBotMessages
from database.mongo import db

router = APIRouter()


@router.post("/chatbot-messages/")
async def create_chatbot_message(chatbot_message: ChatBotMessages):
    result = await db.chatbot_messages.insert_one(chatbot_message.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Chatbot Message not created")


@router.get("/chatbot-messages/{lessonId}/student/{studentId}")
async def get_chatbot_messages(studentId: str, lessonId: str):
    chatbot_messages = await db.chatbot_messages.find({"studentId": studentId, "lessonId": lessonId}).to_list(100)
    for chatbot_message in chatbot_messages:
        chatbot_message["_id"] = str(chatbot_message["_id"])
    return chatbot_messages

from fastapi import APIRouter, HTTPException

from models.mongo import ChatBotMessages
from tools.utils import mongo_db

router = APIRouter(tags=['Student-Lessons | Additives'])


@router.post("/chatbot-message/")
async def create_chatbot_message(chatbot_message: ChatBotMessages):
    result = mongo_db.add_chatbot_message(chatbot_message)
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Chatbot Message not created")


@router.get("/chatbot-messages/{lessonId}/student/{studentId}")
async def get_chatbot_messages(studentId: str, lessonId: str):
    chatbot_messages = mongo_db.get_chatbot_messages(studentId, lessonId)
    for chatbot_message in chatbot_messages:
        chatbot_message["_id"] = str(chatbot_message["_id"])
    return chatbot_messages


@router.delete("/chatbot-messages/")
async def clear_chatbot(lessonId: str, studentId: str):
    delete_result = mongo_db.clear_chatbot(lessonId, studentId)
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No Chatbot Messages found for the given lessonId and studentId")

    return {"message": f"{delete_result.deleted_count} Chatbot Messages successfully deleted"}

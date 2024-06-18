from fastapi import APIRouter, HTTPException
from models.mongo import ChatBotMessages
from database.mongo import db

router = APIRouter(tags=['Student-Lessons'])


@router.post("/chatbot-messages/")
async def create_chatbot_message(chatbot_message: ChatBotMessages):
    result = db.chatbot_messages.insert_one(chatbot_message.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Chatbot Message not created")


@router.get("/chatbot-messages/{lessonId}/student/{studentId}")
async def get_chatbot_messages(studentId: str, lessonId: str):
    chatbot_messages = await list(db.chatbot_messages.find({"studentId": studentId, "lessonId": lessonId}))
    for chatbot_message in chatbot_messages:
        chatbot_message["_id"] = str(chatbot_message["_id"])
    return chatbot_messages


@router.delete("/chatbot-messages/")
async def delete_chatbot_messages(lessonId: str, studentId: str):
    delete_result = await db.chatbot_messages.delete_many({"lessonId": lessonId, "studentId": studentId})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No Chatbot Messages found for the given lessonId and studentId")

    return {"message": f"{delete_result.deleted_count} Chatbot Messages successfully deleted"}

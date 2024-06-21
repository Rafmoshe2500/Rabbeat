from fastapi import APIRouter, HTTPException

from models.mongo import ChatBotMessages
from tools.utils import mongo_db

router = APIRouter(tags=['Student-Lessons | Additives'])


@router.post("/chatbot-message/")
async def create_lesson_message(chatbot_message: ChatBotMessages):
    result = mongo_db.add_lesson_message(chatbot_message)
    if result:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Chatbot Message not created")


@router.get("/chatbot-messages/{lessonId}/student/{studentId}")
async def get_all_lesson_messages_from_lesson_by_student_id(studentId: str, lessonId: str):
    chatbot_messages = mongo_db.get_lesson_messages(studentId, lessonId)
    for chatbot_message in chatbot_messages:
        chatbot_message["_id"] = str(chatbot_message["_id"])
    return chatbot_messages


@router.delete("/chatbot-messages/")
async def delete_all_lesson_messages_from_lesson_by_student_id(lessonId: str, studentId: str):
    delete_result = mongo_db.delete_lesson_messages(lessonId, studentId)
    if not delete_result:
        raise HTTPException(status_code=404, detail="No Chatbot Messages found for the given lessonId and studentId")
    return {"message": f"{delete_result.deleted_count} Chatbot Messages successfully deleted"}

from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse

from models.lesson import ChatBotMessages
from database.mongo import mongo_db

router = APIRouter(tags=['User-Lessons | Additives'])


@router.post("/chatbot-message/", include_in_schema=False)
async def create_lesson_message(chatbot_message: ChatBotMessages):
    result = mongo_db.add_lesson_message(chatbot_message)
    if result:
        return JSONResponse(status_code=201, content=str(result.inserted_id))
    raise HTTPException(status_code=500, detail="Chatbot Message not created")


@router.get("/chatbot-messages/{lessonId}/user/{userId}", include_in_schema=False)
async def get_all_lesson_messages_from_lesson_by_user_id(userId: str, lessonId: str):
    chatbot_messages = mongo_db.get_lesson_messages(userId, lessonId)
    for chatbot_message in chatbot_messages:
        chatbot_message["_id"] = str(chatbot_message["_id"])
    return chatbot_messages


@router.delete("/chatbot-messages/", include_in_schema=False)
async def delete_all_lesson_messages_from_lesson_by_user_id(lessonId: str, userId: str):
    delete_result = mongo_db.delete_lesson_messages(lessonId, userId)
    if not delete_result:
        raise HTTPException(status_code=404, detail="No Chatbot Messages found for the given lessonId and userId")
    return {"message": f"{delete_result.deleted_count} Chatbot Messages successfully deleted"}

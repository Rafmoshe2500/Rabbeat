from typing import List

from fastapi import APIRouter
from starlette.responses import JSONResponse

from database.mongo import mongo_db
from models.tests import Message, LessonTestAudio

router = APIRouter(tags=['Student - Tests'])


@router.post("/lesson/chat/{chat_id}/message", response_model=str)
async def update_test_messages(chat_id, message: Message):
    mongo_db.add_message_to_chat(chat_id, message)
    return JSONResponse(status_code=201, content="Success update chat")


@router.get("/lesson/chat/{chat_id}", response_model=List[Message])
async def get_all_messages(chat_id: str):
    result = mongo_db.get_test_chat_by_id(chat_id)
    if result:
        return result['messages']


@router.put("/test-audio/{audio_id}", response_model=str)
def update_self_test_audio(audio_id, audio: LessonTestAudio):
    result = mongo_db.update_lesson_test_audio(audio_id, audio.audio)
    if result:
        return JSONResponse(status_code=200, content="Success to update test audio")

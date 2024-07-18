from typing import List

from fastapi import APIRouter, HTTPException

from database.mongo import mongo_db
from models.tests import Message, LessonTestAudio

router = APIRouter(tags=['Student - Tests'])


@router.post("/lesson/chat/{chat_id}/message", status_code=201)
async def update_test_messages(chat_id: str, message: Message):
    mongo_db.add_message_to_chat(chat_id, message)
    return "Success update chat"


@router.get("/lesson/chat/{chat_id}", response_model=List[Message])
async def get_all_messages(chat_id: str):
    result = mongo_db.get_test_chat_by_id(chat_id)
    if not result:
        raise HTTPException(status_code=404, detail="Chat not found")
    return result['messages']


@router.put("/test-audio/{audio_id}", status_code=200)
def update_self_test_audio(audio_id: str, audio: LessonTestAudio):
    result = mongo_db.update_lesson_test_audio(audio_id, audio.audio)
    if not result:
        raise HTTPException(status_code=404, detail="Audio not found")
    return "Success to update test audio"

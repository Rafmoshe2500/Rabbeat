from typing import List

from fastapi import APIRouter, HTTPException

from database.mongo import mongo_db
from models.response import ResponseGetChatNotifications
from models.tests import Message, LessonTestAudio

router = APIRouter(tags=['Student - Tests'])


@router.post("/lesson/chat/{chat_id}/message", status_code=201)
async def update_test_messages(chat_id: str, message: Message):
    if message.sender == 'teacher':
        mongo_db.update_chat_id(chat_id, 'student')
    else:
        mongo_db.update_chat_id(chat_id, 'teacher')
        mongo_db.update_study_zone('chatId', chat_id, True)
    mongo_db.add_message_to_chat(chat_id, message)
    return "Success send message"


@router.put("/lesson/chat/{chat_id}/open/{user_type}", status_code=200)
async def update_test_messages(chat_id: str, user_type: str):
    mongo_db.update_chat_id(chat_id, user_type, zero=True)
    return "Success update chat"


@router.get("/lesson/chat/notifications/{chat_id}/userType/{user_type}", status_code=200, response_model=int)
async def get_chat_notifications(chat_id: str, user_type):
    result = mongo_db.get_test_chat_by_id(chat_id)
    if user_type == 'student':
        return result['studentUnread']
    return result['teacherUnread']


@router.get("/lesson/chat/{chat_id}", response_model=List[Message])
async def get_all_messages(chat_id: str):
    result = mongo_db.get_test_chat_by_id(chat_id)
    if not result:
        raise HTTPException(status_code=404, detail="Chat not found")
    return result['messages']


@router.get("/test-audio/{audio_id}", status_code=200, response_model=LessonTestAudio)
def get_self_test_audio(audio_id: str):
    result = mongo_db.get_lesson_test_audio(audio_id)
    if not result:
        raise HTTPException(status_code=404, detail="Audio not found")
    del result['_id']
    return result


@router.put("/test-audio/{audio_id}", status_code=200)
def update_self_test_audio(audio_id: str, audio: LessonTestAudio):
    result = mongo_db.update_lesson_test_audio(audio_id, audio.audio)
    mongo_db.update_study_zone('testAudioId', audio_id, True)
    if not result:
        raise HTTPException(status_code=404, detail="Audio not found")
    return "Success to update test audio"

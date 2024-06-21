from typing import List, Optional

from fastapi import APIRouter, HTTPException

from models.mongo import Lesson, LessonResponse, LessonMetadata, LessonStatus, ExtendLessonResponse
from tools.utils import mongo_db

router = APIRouter(tags=['Lesson'])


@router.post("/lesson/")
async def create_lesson(lesson: Lesson):
    lesson_id = mongo_db.add_lesson(lesson)
    if lesson_id:
        return {"id": str(lesson_id)}
    raise HTTPException(status_code=500, detail="Lesson not created")


@router.get("/lesson/{id}")
async def get_lesson_by_id(id: str):
    lesson = mongo_db.get_lesson_by_id(id)
    if lesson:
        lesson["_id"] = str(lesson["_id"])
        return lesson
    raise HTTPException(status_code=404, detail="Lesson not found")


@router.get("/lessons/")
async def get_all_lessons():
    lessons = mongo_db.get_all_lessons()
    if not lessons:
        raise HTTPException(status_code=404, detail="No lessons found")
    for lesson in lessons:
        lesson["_id"] = str(lesson["_id"])
    return lessons


@router.get("/lessons-metadata/")
async def get_all_lessons_metadata():
    lessons = mongo_db.get_all_lessons_metadata()
    if not lessons:
        raise HTTPException(status_code=404, detail="No lessons found")
    for lesson in lessons:
        lesson["_id"] = str(lesson["_id"])
    return lessons


@router.get("/lessons/{user_id}")
async def get_lessons_metadata_by_user_id(user_id: str):
    try:
        lessons = []
        user = mongo_db.get_user_by_id(user_id)
        lesson_ids = mongo_db.get_lessons_by_user_id(user_id)
        for lesson_id in lesson_ids:
            metadata = mongo_db.get_lessons_metadata_by_user_id(lesson_id['lessonId'])
            lesson_response = LessonResponse(
                lessonId=lesson_id['lessonId'],
                userId=user_id,
                metadata=LessonMetadata(**metadata)
            )
            if user['type'] == 'student':
                status = mongo_db.get_lesson_status_by_ids(user_id, lesson_id['lessonId'])
                lesson_response = ExtendLessonResponse(**lesson_response.dict(), status=LessonStatus(**status))
            lessons.append(lesson_response)

        return lessons

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

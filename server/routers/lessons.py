from typing import List

from fastapi import APIRouter, HTTPException

from models.mongo import Lesson, LessonResponse
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


@router.get("/lessons/{student_id}", response_model=List[LessonResponse])
async def get_lessons_metadata_by_student_id(student_id: str):
    try:
        lessons = mongo_db.get_lessons_metadata_by_student_id(student_id)
        return lessons
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException

from models.mongo import TeacherLessons
from tools.utils import mongo_db

router = APIRouter(tags=['Teacher-Lessons'])


@router.post("/teacher-lesson/")
async def associate_teacher_to_lesson(teacher_lesson: TeacherLessons):
    result = mongo_db.associate_teacher_to_lesson(teacher_lesson)
    if result:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Teacher Lesson not created")


@router.get("/teacher-lessons/{teacherId}")
async def get_all_teacher_lessons_by_teacher_id(teacherId: str):
    teacher_lessons = mongo_db.get_all_teacher_lessons_by_teacher_id(teacherId)
    for teacher_lesson in teacher_lessons:
        teacher_lesson["_id"] = str(teacher_lesson["_id"])
    return teacher_lessons

from fastapi import APIRouter, HTTPException

from database.mongo import db
from models.mongo import TeacherLessons

router = APIRouter(tags=['Teacher-Lessons'])


@router.post("/teacher-lesson/")
async def create_teacher_lesson(teacher_lesson: TeacherLessons):
    result = db.teacher_lessons.insert_one(teacher_lesson.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Teacher Lesson not created")


@router.get("/teacher-lessons/{teacherId}")
async def get_teacher_lessons(teacherId: str):
    teacher_lessons = list(db.teacher_lessons.find({"teacherId": teacherId}))
    for teacher_lesson in teacher_lessons:
        teacher_lesson["_id"] = str(teacher_lesson["_id"])
    return teacher_lessons

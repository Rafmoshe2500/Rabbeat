from fastapi import APIRouter, HTTPException
from models.mongo import TeacherLessons
from database.mongo import db

router = APIRouter()


@router.post("/teacher-lessons/")
async def create_teacher_lesson(teacher_lesson: TeacherLessons):
    result = await db.teacher_lessons.insert_one(teacher_lesson.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Teacher Lesson not created")


@router.get("/teacher-lessons/{teacherId}")
async def get_teacher_lessons(teacherId: str):
    teacher_lessons = await db.teacher_lessons.find({"teacherId": teacherId}).to_list(500)
    for teacher_lesson in teacher_lessons:
        teacher_lesson["_id"] = str(teacher_lesson["_id"])
    return teacher_lessons

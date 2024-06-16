from fastapi import APIRouter, HTTPException
from models.mongo import StudentLessons
from database import db

router = APIRouter()

@router.post("/student-lessons/")
async def create_student_lesson(student_lesson: StudentLesson):
    result = await db.student_lessons.insert_one(student_lesson.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Student Lesson not created")

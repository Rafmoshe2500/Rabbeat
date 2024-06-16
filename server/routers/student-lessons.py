from fastapi import APIRouter, HTTPException
from models.mongo import StudentLessons
from database.mongo import db

router = APIRouter()


@router.post("/student-lessons/")
async def create_student_lesson(student_lesson: StudentLessons):
    result = await db.student_lessons.insert_one(student_lesson.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Student Lesson not created")


@router.get("/student-lessons/{studentId}")
async def get_student_lessons(studentId: str):
    student_lessons = await db.student_lessons.find({"studentId": studentId}).to_list(100)
    for student_lesson in student_lessons:
        student_lesson["_id"] = str(student_lesson["_id"])
    return student_lessons

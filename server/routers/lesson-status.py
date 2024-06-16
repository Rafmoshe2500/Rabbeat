from fastapi import APIRouter, HTTPException
from models.mongo import LessonStatus
from database.mongo import db

router = APIRouter()


@router.post("/lesson-status/")
async def create_lesson_status(lesson_status: LessonStatus):
    result = await db.lesson_status.insert_one(lesson_status.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Lesson Status not created")


@router.get("/lesson-status/{lessonId}/student/{studentId}")
async def get_lesson_status(studentId: str, lessonId: str):
    lesson_status = await db.lesson_status.find_one({"studentId": studentId, "lessonId": lessonId})
    if lesson_status:
        lesson_status["_id"] = str(lesson_status["_id"])
        return lesson_status
    raise HTTPException(status_code=404, detail="Lesson status not found")

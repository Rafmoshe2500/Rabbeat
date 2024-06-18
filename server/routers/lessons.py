from fastapi import APIRouter, HTTPException
from models.mongo import Lesson
from database.mongo import db
from bson import ObjectId

router = APIRouter(tags=['Lesson'])


@router.post("/lesson/")
async def create_lesson(lesson: Lesson):
    result = db.lessons.insert_one(lesson.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Lesson not created")


@router.get("/lesson/{id}")
async def get_lesson(id: str):
    lesson = db.lessons.find_one({"_id": ObjectId(id)})
    if lesson:
        lesson["_id"] = str(lesson["_id"])
        return lesson
    raise HTTPException(status_code=404, detail="Lesson not found")

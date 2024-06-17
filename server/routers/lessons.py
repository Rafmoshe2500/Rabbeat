from fastapi import APIRouter, HTTPException
from models.mongo import Lesson
from database.mongo import db
from bson import ObjectId

router = APIRouter(tags=['Lesson'])


@router.post("/lessons/")
async def create_lesson(lesson: Lesson):
    result = await db.lessons.insert_one(lesson.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Lesson not created")


@router.get("/lessons/{id}")
async def get_lesson(id: str):
    lesson = await db.lessons.find_one({"_id": ObjectId(id)})
    if lesson:
        lesson["_id"] = str(lesson["_id"])
        return lesson
    raise HTTPException(status_code=404, detail="Lesson not found")

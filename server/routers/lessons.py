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


@router.delete("/lessons/{id}")
async def delete_lesson(id: str):
    # Convert the id to ObjectId
    lesson_id = ObjectId(id)

    # Delete the lesson from Lessons
    delete_result = await db.lessons.delete_one({"_id": lesson_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Delete related student lessons
    await db.student_lessons.delete_many({"lessonId": str(lesson_id)})

    # Delete related teacher lessons
    await db.teacher_lessons.delete_many({"lessonId": str(lesson_id)})

    # Delete related lesson statuses
    await db.lesson_status.delete_many({"lessonId": str(lesson_id)})

    # Delete related lesson comments
    await db.lesson_comments.delete_many({"lessonsId": str(lesson_id)})

    # Delete related chatbot messages
    await db.chatbot_messages.delete_many({"lessonId": str(lesson_id)})

    return {"message": "Lesson and related data successfully deleted"}

from fastapi import APIRouter, HTTPException
from models.mongo import LessonsComments
from database.mongo import db

router = APIRouter(tags=['Lesson'])


@router.post("/lesson-comments/")
async def create_lesson_comment(lesson_comment: LessonsComments):
    result = await db.lesson_comments.insert_one(lesson_comment.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Lesson Comment not created")


@router.get("/lesson-comments/{lessonsId}/student/{studentId}")
async def get_lesson_comments(studentId: str, lessonsId: str):
    lesson_comments = await db.lesson_comments.find({"lessonsId": lessonsId, "studentId": studentId}).to_list(20)
    for lesson_comment in lesson_comments:
        lesson_comment["_id"] = str(lesson_comment["_id"])
    return lesson_comments

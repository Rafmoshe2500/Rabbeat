from bson import ObjectId
from fastapi import APIRouter, HTTPException
from models.mongo import LessonsComments
from database.mongo import db

router = APIRouter(tags=['Student-Lessons'])


@router.post("/lesson-comments/")
async def create_lesson_comment(lesson_comment: LessonsComments):
    result = db.lesson_comments.insert_one(lesson_comment.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Lesson Comment not created")


@router.get("/lesson-comments/{lessonsId}/student/{studentId}")
async def get_lesson_comments(studentId: str, lessonsId: str):
    lesson_comments =  list(db.lesson_comments.find({"lessonsId": lessonsId, "studentId": studentId}))
    for lesson_comment in lesson_comments:
        lesson_comment["_id"] = str(lesson_comment["_id"])
    return lesson_comments


@router.delete("/lesson-comments/{id}")
async def delete_lesson_comment(id: str):
    delete_result = db.lesson_comments.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")

    return {"message": "Comment successfully deleted"}

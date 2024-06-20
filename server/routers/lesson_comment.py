from fastapi import APIRouter, HTTPException

from models.mongo import LessonsComments
from tools.utils import mongo_db

router = APIRouter(tags=['Student-Lessons | Additives'])


@router.post("/lesson-comment/")
async def create_lesson_comment(lesson_comment: LessonsComments):
    result = mongo_db.add_lesson_comment(lesson_comment)
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Lesson Comment not created")


@router.get("/lesson-comments/{lessonsId}/student/{studentId}")
async def get_lesson_comments_by_ids(studentId: str, lessonsId: str):
    lesson_comments = mongo_db.get_lesson_comments_by_ids(studentId, lessonsId)
    for lesson_comment in lesson_comments:
        lesson_comment["_id"] = str(lesson_comment["_id"])
    return lesson_comments


@router.delete("/lesson-comment/{id}")
async def delete_lesson_comment_by_id(id: str):
    delete_result = mongo_db.delete_lesson_comment_by_id(id)
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")

    return {"message": "Comment successfully deleted"}

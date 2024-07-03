from typing import List

from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse

from models.mongo import LessonsComments
from tools.utils import mongo_db

router = APIRouter(tags=['User-Lessons | Additives'])


@router.post("/lesson-comment", response_model=str)
async def create_lesson_comment(lesson_comment: LessonsComments):
    result = mongo_db.add_lesson_comment(lesson_comment)
    if result:
        return JSONResponse(status_code=201, content=str(result.inserted_id))
    raise HTTPException(status_code=500, detail="Lesson Comment not created")


@router.get("/lesson-comments/{lessonsId}/user/{userId}", response_model=List[LessonsComments])
async def get_lesson_comments_by_ids(userId: str, lessonsId: str):
    lesson_comments = mongo_db.get_lesson_comments_by_ids(userId, lessonsId)
    for lesson_comment in lesson_comments:
        lesson_comment["_id"] = str(lesson_comment["_id"])
    return lesson_comments


@router.delete("/lesson-comment/{id}")
async def delete_lesson_comment_by_id(id: str):
    delete_result = mongo_db.delete_lesson_comment_by_id(id)
    if not delete_result:
        raise HTTPException(status_code=404, detail="Comment not found")

    return {"message": "Comment successfully deleted"}

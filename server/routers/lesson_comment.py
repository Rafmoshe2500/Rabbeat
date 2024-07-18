from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse

from models.lesson import LessonComments, UpdateComment
from database.mongo import mongo_db

router = APIRouter(tags=['User-Lessons | Additives'])


@router.post("/lesson-comment", response_model=str)
async def create_lesson_comment(lesson_comment: LessonComments):
    result = mongo_db.add_lesson_comment(lesson_comment)
    if result:
        return JSONResponse(status_code=201, content=str(result.inserted_id))
    raise HTTPException(status_code=500, detail="Lesson Comment not created")


@router.get("/lesson-comments/{lessonsId}/user/{userId}")
async def get_lesson_comments_by_ids(userId: str, lessonsId: str):
    lesson_comments = mongo_db.get_lesson_comments_by_ids(userId, lessonsId)
    for lesson_comment in lesson_comments:
        lesson_comment["id"] = str(lesson_comment["_id"])
        del lesson_comment["_id"]
    sorted_comments = sorted(lesson_comments, key=lambda x: x['time'])

    return sorted_comments


@router.delete("/lesson-comment/{id}")
async def delete_lesson_comment_by_id(id: str):
    delete_result = mongo_db.delete_lesson_comment_by_id(id)
    if not delete_result:
        raise HTTPException(status_code=404, detail="Comment not found")

    return {"message": "Comment successfully deleted"}


@router.post("/lesson-comment/{comment_id}")
async def update_lesson_status(comment_id, update: UpdateComment):
    update_result = mongo_db.update_lesson_comment(comment_id, update)
    if not update_result:
        raise HTTPException(status_code=404, detail="Something went wrong")
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    if update_result.modified_count == 0:
        raise HTTPException(status_code=304, detail="Comment not modified")
    return {"message": "Comment successfully updated"}

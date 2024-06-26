from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse

from models.mongo import LessonStatus
from tools.utils import mongo_db

router = APIRouter(tags=['User-Lessons | Additives'])


@router.post("/lesson-status/")
async def create_lesson_status(lesson_status: LessonStatus):
    result = mongo_db.add_lesson_status(lesson_status)
    if result:
        return JSONResponse(status_code=201, content=str(result.inserted_id))
    raise HTTPException(status_code=500, detail="Lesson Status not created")


@router.get("/user-status/{lessonId}/user/{userId}")
async def get_lesson_status_by_ids(userId: str, lessonId: str):
    lesson_status = mongo_db.get_lesson_status_by_ids(userId, lessonId)
    if lesson_status:
        lesson_status["_id"] = str(lesson_status["_id"])
        return lesson_status
    raise HTTPException(status_code=404, detail="Lesson status not found")


@router.get("/lesson-statuses/")
async def get_all_lesson_statuses():
    lesson_statuses = mongo_db.get_all_lesson_statuses()
    for lesson_status in lesson_statuses:
        lesson_status["_id"] = str(lesson_status["_id"])
    return lesson_statuses


@router.patch("/lesson-status/")
async def update_lesson_status(update: LessonStatus):
    update_result = mongo_db.update_lesson_status(update)
    if not update_result:
        raise HTTPException(status_code=404, detail="Something went wrong")
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="LessonStatus not found")
    if update_result.modified_count == 0:
        raise HTTPException(status_code=304, detail="LessonStatus not modified")
    return {"message": "LessonStatus successfully updated"}

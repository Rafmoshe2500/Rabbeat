from fastapi import APIRouter, HTTPException

from database.mongo import mongo_db
from models.lesson import LessonStatus

router = APIRouter(tags=['Study Zone'])


@router.post("/lesson-status")
async def update_lesson_status(update_status: LessonStatus):
    update_result = mongo_db.update_study_zone_status(update_status)
    if not update_result:
        raise HTTPException(status_code=404, detail="Something went wrong")
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="LessonStatus not found")
    if update_result.modified_count == 0:
        raise HTTPException(status_code=304, detail="LessonStatus not modified")
    return {"message": "LessonStatus successfully updated"}



from fastapi import APIRouter, HTTPException

from database.mongo import mongo_db
from models.lesson import LessonStatus
from models.response import StudyZoneResponse

router = APIRouter(tags=['Study Zone'])


@router.put("/lesson-status")
async def update_lesson_status(update_status: LessonStatus):
    update_result = mongo_db.update_study_zone_status(update_status)
    if not update_result:
        raise HTTPException(status_code=500, detail="Something went wrong")
    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="LessonStatus not found")
    if update_result.modified_count == 0:
        raise HTTPException(status_code=304, detail="LessonStatus not modified")
    return {"message": "LessonStatus successfully updated"}


@router.get("/study_zone/student/{student_id}/lesson/{lesson_id}", response_model=StudyZoneResponse)
def get_study_zone_by_user_and_lesson_ids(student_id: str, lesson_id: str):
    result = mongo_db.get_study_zone_by_ids(student_id, lesson_id)
    if not result:
        raise HTTPException(status_code=404, detail="Study zone not found")
    return StudyZoneResponse(**result)

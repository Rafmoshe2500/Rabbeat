from fastapi import APIRouter, HTTPException
from models.mongo import LessonStatus, UpdateLessonStatusModel
from database.mongo import db

router = APIRouter(tags=['Lesson'])


@router.post("/lesson-status/")
async def create_lesson_status(lesson_status: LessonStatus):
    result = await db.lesson_status.insert_one(lesson_status.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Lesson Status not created")


@router.get("/lesson-status/{lessonId}/student/{studentId}")
async def get_lesson_status(studentId: str, lessonId: str):
    lesson_status = await db.lesson_status.find_one({"studentId": studentId, "lessonId": lessonId})
    if lesson_status:
        lesson_status["_id"] = str(lesson_status["_id"])
        return lesson_status
    raise HTTPException(status_code=404, detail="Lesson status not found")


@router.patch("/lesson-status/")
async def update_lesson_status(update: LessonStatus):
    update_data = update.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No update parameters provided")

    update_result = await db.lesson_status.update_one(
        {"lessonId": update.lessonId, "studentId": update.studentId},
        {"$set": update_data}
    )

    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="LessonStatus not found")

    if update_result.modified_count == 0:
        raise HTTPException(status_code=304, detail="LessonStatus not modified")

    return {"message": "LessonStatus successfully updated"}

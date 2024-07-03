from fastapi import APIRouter, HTTPException

from models.mongo import UserLessons, LessonStatus
from tools.utils import mongo_db

router = APIRouter(tags=['User-Lessons'])


@router.post("/user-lesson")
async def associate_user_to_lesson(user_lesson: UserLessons):
    user = mongo_db.get_user_by_id(user_lesson.userId)
    result = mongo_db.associate_user_to_lesson(user_lesson)
    if not result:
        raise HTTPException(status_code=500, detail="User Lesson not created")
    if user['type'] == 'student':
        status = LessonStatus(userId=user_lesson.userId, lessonId=user_lesson.lessonId)
        status_result = mongo_db.add_lesson_status(status)
        if not status_result:
            mongo_db.remove_all_lesson_data_from_user(user_lesson)
            raise HTTPException(status_code=500, detail="User Lesson not created")
    return {"id": str(result.inserted_id)}


@router.delete("/user-lesson")
async def disassociate_user_from_lesson(user_lesson: UserLessons):
    mongo_db.remove_all_lesson_data_from_user(user_lesson)
    return {"message": "Lesson and related data successfully deleted"}

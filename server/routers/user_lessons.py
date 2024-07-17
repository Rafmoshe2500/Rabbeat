from typing import List

from fastapi import APIRouter, HTTPException

from database.mongo import mongo_db
from models.lesson import LessonStatus, AssociateUserToLesson, AssociateNewStudent
from models.response import ExtendLessonDetailsResponse

router = APIRouter(tags=['User-Lessons'])


@router.post("/user-lesson")
async def associate_user_to_lesson(new_associate: AssociateUserToLesson):
    if not mongo_db.get_connection(new_associate.userId, new_associate.teacher_id):
        HTTPException(status_code=404, detail="User are not association to this teacher!")
    user = mongo_db.get_user_by_id(new_associate.userId)
    result = mongo_db.associate_user_to_lesson(new_associate.userId, new_associate.lessonId)
    if not result:
        raise HTTPException(status_code=500, detail="User Lesson not created")
    if user['type'] == 'student':
        status = LessonStatus(userId=new_associate.userId, lessonId=new_associate.lessonId)
        status_result = mongo_db.add_lesson_status(status)
        mongo_db.add_test_chat(new_associate.lessonId, new_associate.userId)
        if not status_result:
            mongo_db.remove_all_lesson_data_from_user(new_associate.lessonId, new_associate.userId)
            raise HTTPException(status_code=500, detail="User Lesson not created")
    mongo_db.upsert_test_chat_messages()
    return {"id": str(result.inserted_id)}


@router.delete("/user-lesson")
async def disassociate_user_from_lesson(user_lesson: AssociateUserToLesson):
    mongo_db.remove_all_lesson_data_from_user(user_lesson)
    return {"message": "Lesson and related data successfully deleted"}


@router.get("/all-students/{teacher_id}", response_model=List[AssociateNewStudent])
async def get_all_students_by_teacher_id(teacher_id):
    return mongo_db.get_all_students_by_teacher(teacher_id)


@router.post("/teacher/new-student")
async def associate_student_to_teacher(new_student: AssociateNewStudent):
    mongo_db.associate_student_to_teacher(new_student)


@router.get("/teacher/{teacher_id}/student/{student_id}/lessons", response_model=List[ExtendLessonDetailsResponse])
async def get_shared_lessons(student_id: str, teacher_id: str):
    try:
        return mongo_db.get_shared_lessons(student_id, teacher_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

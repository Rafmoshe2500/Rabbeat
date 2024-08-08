from typing import List

from fastapi import APIRouter, HTTPException

from database.mongo import mongo_db
from models.lesson import AssociateUserToLesson, AssociateNewStudent, DisassociateUserToLesson
from models.response import ExtendLessonDetailsResponse
from tools.utils import sorted_lessons
from workflows.associate_student_to_lesson import AssociateUserToLessonFlow

router = APIRouter(tags=['User-Lessons'])


@router.post("/associate-lesson", status_code=201)
async def associate_student_to_lesson(new_associate: AssociateUserToLesson):
    try:
        result = AssociateUserToLessonFlow(new_associate.teacherId, new_associate.studentId,
                                           new_associate.lessonId).run()
        if not result:
            mongo_db.remove_all_lesson_data_from_user(new_associate.lessonId, new_associate.studentId)
            raise HTTPException(status_code=500, detail="Failed to associate user to lesson")
        return "Success to associate a new student to teacher lesson"
    except Exception as e:
        mongo_db.remove_all_lesson_data_from_user(new_associate.lessonId, new_associate.studentId)
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/disassociate-lesson")
async def disassociate_user_from_lesson(user_lesson: DisassociateUserToLesson):
    mongo_db.remove_all_lesson_data_from_user(user_lesson.lessonId, user_lesson.studentId)
    return {"message": "Lesson and related data successfully deleted"}


@router.get("/all-students/{teacher_id}", response_model=list)
async def get_all_students_by_teacher_id(teacher_id: str):
    return mongo_db.get_students_by_teacher_id(teacher_id)


@router.post("/teacher/new-student")
async def associate_student_to_teacher(new_student: AssociateNewStudent):
    mongo_db.associate_student_to_teacher(new_student)
    return {"message": "Student successfully associated with teacher"}


@router.get("/is-connection/student/{student_id}/teacher/{teacher_id}", response_model=bool)
async def check_if_student_have_connection_to_teacher(student_id, teacher_id):
    result = mongo_db.get_connection(student_id, teacher_id)
    if result:
        return True
    return False


@router.get("/teacher/{teacher_id}/student/{student_id}/lessons", response_model=List[ExtendLessonDetailsResponse])
async def get_shared_lessons(student_id: str, teacher_id: str):
    try:
        result = mongo_db.get_shared_lessons(student_id, teacher_id)
        for shared_lesson in result:
            notifications = mongo_db.get_notification_by_id(shared_lesson['studyZoneDetails']['notificationsId'])
            if notifications['lastSender'] == 'teacher':
                notifications['messageNotifications'] = False
            shared_lesson['notificationsDetails'] = notifications

        return sorted_lessons(result)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

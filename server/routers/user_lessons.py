from typing import List

from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse

from database.mongo import mongo_db
from models.lesson import AssociateUserToLesson, AssociateNewStudent, DisassociateUserToLesson
from models.response import ExtendLessonDetailsResponse
from workflows.associate_student_to_lesson import AssociateUserToLessonFlow

router = APIRouter(tags=['User-Lessons'])


@router.post("/associate-lesson")
async def associate_student_to_lesson(new_associate: AssociateUserToLesson):
    try:
        result = AssociateUserToLessonFlow(new_associate.teacherId, new_associate.studentId,
                                           new_associate.lessonId).run()
        if result:
            return JSONResponse(status_code=201, content="Success to associate a new student to teacher lesson")
        mongo_db.remove_all_lesson_data_from_user(new_associate.lessonId, new_associate.studentId)
        raise HTTPException(status_code=500, detail="Failed to associate user to lesson")
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)


@router.delete("/disassociate-lesson")
async def disassociate_user_from_lesson(user_lesson: DisassociateUserToLesson):
    mongo_db.remove_all_lesson_data_from_user(user_lesson.lessonId, user_lesson.studentId)
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

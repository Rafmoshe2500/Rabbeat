from fastapi import APIRouter, HTTPException

from models.mongo import StudentLessons, LessonStatus
from tools.utils import mongo_db

router = APIRouter(tags=['Student-Lessons', 'Student'])


@router.post("/student-lesson/")
async def associate_student_to_lesson(student_lesson: StudentLessons):
    result = mongo_db.associate_student_to_lesson(student_lesson)
    if not result:
        raise HTTPException(status_code=500, detail="Student Lesson not created")
    status = LessonStatus(studentId=student_lesson.studentId, lessonId=student_lesson.lessonId)
    status_result = mongo_db.add_lesson_status(status)
    if status_result:
        return {"id": str(result.inserted_id)}
    else:
        mongo_db.remove_all_lesson_data_from_student(student_lesson)
        raise HTTPException(status_code=500, detail="Student Lesson not created")


@router.get("/student-lessons/{studentId}")
async def get_all_student_lessons_by_student_id(studentId: str):
    student_lessons = mongo_db.get_all_student_lessons_by_student_id(studentId)
    for student_lesson in student_lessons:
        student_lesson["_id"] = str(student_lesson["_id"])
    return student_lessons


@router.delete("/student-lesson/")
async def disassociate_student_from_lesson(student: StudentLessons):
    mongo_db.remove_all_lesson_data_from_student(student)
    return {"message": "Lesson and related data successfully deleted"}

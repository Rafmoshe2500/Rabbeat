from fastapi import APIRouter, HTTPException
from models.mongo import StudentLessons, LessonStatus
from database.mongo import db

router = APIRouter(tags=['Student-Lessons', 'Student'])


@router.post("/student-lesson/")
async def create_student_lesson(student_lesson: StudentLessons):
    result = db.student_lessons.insert_one(student_lesson.dict())
    status = LessonStatus(studentId=student_lesson.studentId, lessonId=student_lesson.lessonId)
    db.lesson_status.insert_one(status.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Student Lesson not created")


@router.get("/student-lessons/{studentId}")
async def get_student_lessons(studentId: str):
    student_lessons = (db.student_lessons.find({"studentId": studentId}))
    for student_lesson in student_lessons:
        student_lesson["_id"] = str(student_lesson["_id"])
    return student_lessons


@router.delete("/student-lesson/")
async def delete_student_lesson(student: StudentLessons):
    # Delete related student lessons
    db.student_lessons.delete_one({"lessonId": student.lessonId, "studentId": student.studentId})

    # Delete related lesson statuses
    db.lesson_status.delete_one({"lessonId": student.lessonId, "studentId": student.studentId})

    # Delete related lesson comments
    db.lesson_comments.delete_many({"lessonsId": student.lessonId, "studentId": student.studentId})

    # Delete related chatbot messages
    db.chatbot_messages.delete_many({"lessonId": student.lessonId, "studentId": student.studentId})

    return {"message": "Lesson and related data successfully deleted"}

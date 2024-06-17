from fastapi import APIRouter, HTTPException
from models.mongo import StudentLessons
from database.mongo import db

router = APIRouter(tags=['Lesson', 'Student'])


@router.post("/student-lessons/")
async def create_student_lesson(student_lesson: StudentLessons):
    result = await db.student_lessons.insert_one(student_lesson.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Student Lesson not created")


@router.get("/student-lessons/{studentId}")
async def get_student_lessons(studentId: str):
    student_lessons = await db.student_lessons.find({"studentId": studentId}).to_list(100)
    for student_lesson in student_lessons:
        student_lesson["_id"] = str(student_lesson["_id"])
    return student_lessons


@router.delete("/lessons/")
async def delete_student_lesson(student: StudentLessons):
    # Delete related student lessons
    await db.student_lessons.delete_one({"lessonId": student.lessonId, "studentId": student.studentId})

    # Delete related lesson statuses
    await db.lesson_status.delete_one({"lessonId": student.lessonId, "studentId": student.studentId})

    # Delete related lesson comments
    await db.lesson_comments.delete_many({"lessonsId": student.lessonId, "studentId": student.studentId})

    # Delete related chatbot messages
    await db.chatbot_messages.delete_many({"lessonId": student.lessonId, "studentId": student.studentId})

    return {"message": "Lesson and related data successfully deleted"}
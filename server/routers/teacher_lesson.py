from bson import ObjectId
from fastapi import APIRouter, HTTPException
from models.mongo import TeacherLessons
from database.mongo import db

router = APIRouter(tags=['Lesson', 'Teacher'])


@router.post("/teacher-lessons/")
async def create_teacher_lesson(teacher_lesson: TeacherLessons):
    result = await db.teacher_lessons.insert_one(teacher_lesson.dict())
    if result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Teacher Lesson not created")


@router.get("/teacher-lessons/{teacherId}")
async def get_teacher_lessons(teacherId: str):
    teacher_lessons = await db.teacher_lessons.find({"teacherId": teacherId}).to_list(500)
    for teacher_lesson in teacher_lessons:
        teacher_lesson["_id"] = str(teacher_lesson["_id"])
    return teacher_lessons


@router.delete("/lessons/{id}")
async def delete_teacher_lesson(id: str):
    # Convert the id to ObjectId
    lesson_id = ObjectId(id)

    # Delete the lesson from Lessons
    delete_result = await db.lessons.delete_one({"_id": lesson_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Delete related student lessons
    await db.student_lessons.delete_many({"lessonId": str(lesson_id)})

    # Delete related teacher lessons
    await db.teacher_lessons.delete_many({"lessonId": str(lesson_id)})

    # Delete related lesson statuses
    await db.lesson_status.delete_many({"lessonId": str(lesson_id)})

    # Delete related lesson comments
    await db.lesson_comments.delete_many({"lessonsId": str(lesson_id)})

    # Delete related chatbot messages
    await db.chatbot_messages.delete_many({"lessonId": str(lesson_id)})

    return {"message": "Lesson and related data successfully deleted"}

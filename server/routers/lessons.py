from typing import List

from fastapi import APIRouter, HTTPException, Depends
from models.mongo import Lesson, LessonMetadata, LessonResponse, LessonStatus
from database.mongo import db
from bson import ObjectId

router = APIRouter(tags=['Lesson'])


@router.post("/lesson/")
async def create_lesson(lesson: Lesson):
    only_lesson = lesson.dict(include={'audio', 'highlightsTimestamps'})
    result = db.lessons.insert_one(only_lesson)
    metadata_lesson = {**lesson.metadata.dict(), '_id': result.inserted_id}
    result_metadata = db.lessons_metadata.insert_one(metadata_lesson)
    if result.inserted_id and result_metadata.inserted_id and result_metadata.inserted_id == result.inserted_id:
        return {"id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Lesson not created")


# @router.get("/lesson/{id}")
# async def get_lesson(id: str):
#     lesson = db.lessons.find_one({"_id": ObjectId(id)})
#     if lesson:
#         lesson["_id"] = str(lesson["_id"])
#         return lesson
#     raise HTTPException(status_code=404, detail="Lesson not found")


@router.get("/lessons/")
async def get_all_lessons():
    lessons = list(db.lessons.find())
    if not lessons:
        raise HTTPException(status_code=404, detail="No lessons found")
    for lesson in lessons:
        lesson["_id"] = str(lesson["_id"])
    return lessons


@router.get("/lessons-metadata/")
async def get_all_lessons_metadata():
    lessons = list(db.lessons_metadata.find())
    if not lessons:
        raise HTTPException(status_code=404, detail="No lessons found")
    for lesson in lessons:
        lesson["_id"] = str(lesson["_id"])
    return lessons


@router.get("/lessons/{student_id}", response_model=List[LessonResponse])
async def get_lessons(student_id: str):
    try:
        student_lessons = list(db.student_lessons.find({"studentId": student_id}))
        if not student_lessons:
            raise HTTPException(status_code=404, detail="No lessons found for the student.")

        lessons = []
        for student_lesson in student_lessons:
            lesson_id = student_lesson["lessonId"]

            # Get metadata
            metadata = db.lessons_metadata.find_one({"_id": ObjectId(lesson_id)})
            if not metadata:
                continue  # skip if metadata is not found

            # Get status
            status = db.lesson_status.find_one({"lessonId": lesson_id, "studentId": student_id})
            if not status:
                continue  # skip if status is not found

            lesson_response = LessonResponse(
                lessonId=lesson_id,
                studentId=student_id,
                metadata=LessonMetadata(**metadata),
                status=LessonStatus(**status)
            )
            lessons.append(lesson_response)

        return lessons

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

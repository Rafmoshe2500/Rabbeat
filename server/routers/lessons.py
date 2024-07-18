from typing import Union, List

from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse

from database.mongo import mongo_db
from models.lesson import Lesson, CreateLesson
from models.response import LessonDetails, LessonResponse, ExtendLessonResponse
from workflows.get_torah import TorahTextProcessor

router = APIRouter(tags=['Lesson'])


@router.post("/lesson", response_model=str)
async def create_lesson(lesson: CreateLesson):
    lesson_id = mongo_db.add_lesson(Lesson(**lesson.dict(exclude={'teacherId'})))
    mongo_db.associate_user_to_lesson(lesson.teacherId, str(lesson_id))
    if lesson_id:
        return JSONResponse(status_code=201, content=str(lesson_id))
    raise HTTPException(status_code=500, detail="Lesson not created")


@router.get("/lesson/{lesson_id}", response_model=LessonDetails)
async def get_lesson_by_id(lesson_id: str):
    lesson = mongo_db.get_lesson_by_id(lesson_id)
    lesson_details = mongo_db.get_lesson_details_by_id(lesson_id)

    if lesson:
        lesson["_id"] = str(lesson["_id"])

        # Set the pentateuch for this request
        torah_processor = TorahTextProcessor(lesson_details["pentateuch"])

        text = torah_processor.get_words_with_times_and_variants(
            start_chapter=lesson_details["startChapter"],
            start_verse=lesson_details["startVerse"],
            end_chapter=lesson_details["endChapter"],
            end_verse=lesson_details["endVerse"],
            times=lesson["highlightsTimestamps"]
        )

        lesson.update({"text": text})
        return lesson
    raise HTTPException(status_code=404, detail="Lesson not found")


@router.get("/lessons")
async def get_all_lessons():
    lessons = mongo_db.get_all_lessons()
    for lesson in lessons:
        lesson["_id"] = str(lesson["_id"])
    return lessons


@router.get("/lessons-details", response_model=List[LessonDetails])
async def get_all_lessons_details():
    lessons = mongo_db.get_all_lessons_details()
    if not lessons:
        raise HTTPException(status_code=404, detail="No lessons found")
    for lesson in lessons:
        lesson["_id"] = str(lesson["_id"])
    return lessons


@router.get("/lessons/{user_id}", response_model=List[Union[LessonResponse, ExtendLessonResponse]])
async def get_lessons_details_by_user_id(user_id: str):
    try:
        lessons = []
        user = mongo_db.get_user_by_id(user_id)
        lesson_ids = mongo_db.get_lessons_by_user_id(user_id)
        for lesson_id in lesson_ids:
            details = mongo_db.get_lessons_details_by_user_id(lesson_id['lessonId'])
            lesson_response = LessonResponse(
                lessonId=lesson_id['lessonId'],
                userId=user_id,
                details=LessonDetails(**details)
            )
            if user['type'] == 'student':
                study_zone = mongo_db.get_study_zone_by_ids(user_id, lesson_id['lessonId'])
                lesson_response = ExtendLessonResponse(**lesson_response.dict(), status=study_zone['status'])
            lessons.append(lesson_response)

        return lessons

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

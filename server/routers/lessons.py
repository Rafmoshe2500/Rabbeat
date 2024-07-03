from typing import Union, List

from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse

from models.mongo import Lesson, LessonResponse, LessonMetadata, ExtendLessonResponse
from models.response import LessonDetail
from tools.utils import mongo_db
from workflows.get_torah import TorahTextProcessor

router = APIRouter(tags=['Lesson'])


@router.post("/lesson", response_model=str)
async def create_lesson(lesson: Lesson):
    lesson_id = mongo_db.add_lesson(lesson)
    if lesson_id:
        return JSONResponse(status_code=201, content=str(lesson_id))
    raise HTTPException(status_code=500, detail="Lesson not created")


@router.get("/lesson/{id}", response_model=LessonDetail)
async def get_lesson_by_id(id: str):
    lesson = mongo_db.get_lesson_by_id(id)
    lesson_metadata = mongo_db.get_lesson_metadata_by_id(id)

    if lesson:
        lesson["_id"] = str(lesson["_id"])

        # Set the pentateuch for this request
        torah_processor = TorahTextProcessor(lesson_metadata["pentateuch"])

        text = torah_processor.get_words_with_times_and_variants(
            start_chapter=lesson_metadata["startChapter"],
            start_verse=lesson_metadata["startVerse"],
            end_chapter=lesson_metadata["endChapter"],
            end_verse=lesson_metadata["endVerse"],
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


@router.get("/lessons-metadata", response_model=List[LessonMetadata])
async def get_all_lessons_metadata():
    lessons = mongo_db.get_all_lessons_metadata()
    if not lessons:
        raise HTTPException(status_code=404, detail="No lessons found")
    for lesson in lessons:
        lesson["_id"] = str(lesson["_id"])
    return lessons


@router.get("/lessons/{user_id}", response_model=List[Union[LessonResponse, ExtendLessonResponse]])
async def get_lessons_metadata_by_user_id(user_id: str):
    try:
        lessons = []
        user = mongo_db.get_user_by_id(user_id)
        lesson_ids = mongo_db.get_lessons_by_user_id(user_id)
        for lesson_id in lesson_ids:
            metadata = mongo_db.get_lessons_metadata_by_user_id(lesson_id['lessonId'])
            lesson_response = LessonResponse(
                lessonId=lesson_id['lessonId'],
                userId=user_id,
                metadata=LessonMetadata(**metadata)
            )
            if user['type'] == 'student':
                status = mongo_db.get_lesson_status_by_ids(user_id, lesson_id['lessonId'])
                lesson_response = ExtendLessonResponse(**lesson_response.dict(), status=status['status'])
            lessons.append(lesson_response)

        return lessons

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

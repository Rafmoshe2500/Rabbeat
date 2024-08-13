from typing import Union, List

from fastapi import APIRouter, HTTPException

from database.mongo import mongo_db
from models.lesson import Lesson, CreateLesson, LessonDetails
from models.response import LessonDetailsResponse, LessonResponse, ExtendLessonDetailsResponse
from tools.utils import sorted_lessons
from workflows.get_torah import TorahTextProcessor

router = APIRouter(tags=['Lesson'])


@router.post("/lesson", response_model=str, status_code=201)
async def create_lesson(lesson: CreateLesson):
    lesson_id = mongo_db.add_lesson(Lesson(**lesson.model_dump(exclude={'teacherId'})))
    if not lesson_id:
        raise HTTPException(status_code=500, detail="Lesson not created")
    mongo_db.associate_user_to_lesson(lesson.teacherId, str(lesson_id.inserted_id))
    return str(lesson_id.inserted_id)


@router.delete("/lesson/{lesson_id}", response_model=str, status_code=200)
async def delete_lesson(lesson_id):
    users = mongo_db.get_users_associations_to_lesson(lesson_id)
    if len(users) > 1:
        raise HTTPException(status_code=409, detail="Error, this lesson are associate to students.")
    delete = mongo_db.delete_lesson_by_id(lesson_id)
    if delete.deleted_count > 0:
        delete = mongo_db.delete_lesson_details_by_id(lesson_id)
        if delete.deleted_count > 0:
            mongo_db.delete_user_lessons_by_lesson_id(lesson_id)
    return "Success delete lesson"


@router.get("/lesson/{lesson_id}", response_model=LessonResponse)
async def get_lesson_by_id(lesson_id: str):
    lesson = mongo_db.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    lesson_details = mongo_db.get_lesson_details_by_id(lesson_id)
    lesson["_id"] = str(lesson["_id"])

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


@router.get("/lesson-details/{user_id}", response_model=List[Union[LessonDetailsResponse, ExtendLessonDetailsResponse]])
async def get_lessons_details_by_user_id(user_id: str):
    try:
        user = mongo_db.get_user_by_id(user_id)
        lesson_ids = mongo_db.get_lessons_by_user_id(user_id)

        lessons = []
        for lesson_id in lesson_ids:
            details = mongo_db.get_lessons_details_by_lesson_id(lesson_id['lessonId'])
            lesson_details = LessonDetailsResponse(
                lessonId=lesson_id['lessonId'],
                userId=user_id,
                details=LessonDetails(**details)
            )
            if user['type'] == 'student':
                study_zone = mongo_db.get_study_zone_by_ids(user_id, lesson_id['lessonId'])
                notifications = mongo_db.get_notification_by_id(study_zone['notificationsId'])
                if notifications['lastSender'] == 'student':
                    notifications['messageNotifications'] = False
                lesson_details = ExtendLessonDetailsResponse(**lesson_details.dict(), studyZoneDetails=study_zone,
                                                             notificationsDetails=notifications)
            lessons.append(lesson_details)
        return sorted_lessons(lessons)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

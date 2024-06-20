from bson import ObjectId
from pymongo import ASCENDING, MongoClient
from pymongo.errors import ConnectionFailure

from models.mongo import LessonResponse, LessonMetadata, LessonStatus, StudentLessons, TeacherLessons, LessonsComments, \
    ChatBotMessages, Lesson


class MongoDB:
    def __init__(self, mongo_db, mongo_uri):
        self.mongo_db = mongo_db
        self.mongo_uri = mongo_uri
        self._db = self.__connect()

    def __connect(self):
        try:
            client = MongoClient(self.mongo_uri)
            db = client[self.mongo_db]
            # Create unique indexes
            db.users.create_index([("id", ASCENDING)], unique=True)
            db.users.create_index([("email", ASCENDING)], unique=True)
            print("Connected to MongoDB")
            return db
        except ConnectionFailure:
            print("Failed to connect to MongoDB")

    def get_lessons_metadata_by_student_id(self, student_id: str):
        student_lessons = list(self._db.student_lessons.find({"studentId": student_id}))
        if not student_lessons:
            return

        lessons = []
        for student_lesson in student_lessons:
            lesson_id = student_lesson["lessonId"]

            # Get metadata
            metadata = self._db.lessons_metadata.find_one({"_id": ObjectId(lesson_id)})
            if not metadata:
                continue  # skip if metadata is not found

            # Get status
            status = self._db.lesson_status.find_one({"lessonId": lesson_id, "studentId": student_id})
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

    def disassociate_student_from_lesson(self, student: StudentLessons):
        self._db.student_lessons.delete_one({"lessonId": student.lessonId, "studentId": student.studentId})
        self._db.lesson_status.delete_one({"lessonId": student.lessonId, "studentId": student.studentId})
        self._db.lesson_comments.delete_many({"lessonsId": student.lessonId, "studentId": student.studentId})
        self._db.chatbot_messages.delete_many({"lessonId": student.lessonId, "studentId": student.studentId})

    def associate_student_to_lesson(self, student_lesson: StudentLessons):
        result = self._db.student_lessons.insert_one(student_lesson.dict())
        status = LessonStatus(studentId=student_lesson.studentId, lessonId=student_lesson.lessonId)
        self._db.lesson_status.insert_one(status.dict())
        return result

    def associate_teacher_to_lesson(self, teacher_lesson: TeacherLessons):
        return self._db.teacher_lessons.insert_one(teacher_lesson.dict())

    def add_lesson(self, lesson: Lesson):
        only_lesson = lesson.dict(include={'audio', 'highlightsTimestamps'})
        result = self._db.lessons.insert_one(only_lesson)
        metadata_lesson = {**lesson.metadata.dict(), '_id': result.inserted_id}
        result_metadata = self._db.lessons_metadata.insert_one(metadata_lesson)
        if result.inserted_id and result_metadata.inserted_id and result_metadata.inserted_id == result.inserted_id:
            return result.inserted_id

    def get_all_lessons_metadata(self):
        return list(self._db.lessons_metadata.find())

    def get_all_lessons(self):
        return list(self._db.lessons.find())

    def get_lesson_by_id(self, id: str):
        return self._db.lessons.find_one({"_id": ObjectId(id)})

    def update_lesson_status(self, update: LessonStatus):
        return self._db.lesson_status.update_one(
            {"lessonId": update.lessonId, "studentId": update.studentId},
            {"$set": update.dict()}
        )

    def get_all_lesson_statuses(self):
        return list(self._db.lesson_status.find())

    def get_lesson_status_by_ids(self, student_id: str, lesson_id: str):
        return self._db.lesson_status.find_one({"studentId": student_id, "lessonId": lesson_id})

    def add_lesson_status(self, lesson_status: LessonStatus):
        return self._db.lesson_status.insert_one(lesson_status.dict())

    def delete_lesson_comment_by_id(self, id: str):
        return self._db.lesson_comments.delete_one({"_id": ObjectId(id)})

    def get_lesson_comments_by_ids(self, studentId: str, lessonsId: str):
        return list(self._db.lesson_comments.find({"lessonsId": lessonsId, "studentId": studentId}))

    def add_lesson_comment(self, lesson_comment: LessonsComments):
        return self._db.lesson_comments.insert_one(lesson_comment.dict())

    def clear_chatbot(self, lessonId: str, studentId: str):
        return self._db.chatbot_messages.delete_many({"lessonId": lessonId, "studentId": studentId})

    def get_chatbot_messages(self, studentId: str, lessonId: str):
        return list(self._db.chatbot_messages.find({"studentId": studentId, "lessonId": lessonId}))

    def add_chatbot_message(self, chatbot_message: ChatBotMessages):
        return self._db.chatbot_messages.insert_one(chatbot_message.dict())

    def get_all_student_lessons_by_student_id(self, studentId: str):
        return list(self._db.student_lessons.find({"studentId": studentId}))

    def get_all_teacher_lessons_by_teacher_id(self, teacherId: str):
        return list(self._db.teacher_lessons.find({"teacherId": teacherId}))

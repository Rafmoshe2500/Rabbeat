import logging
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, DuplicateKeyError
from bson import ObjectId

# Assuming the data models are defined as dataclasses
from models.mongo import StudentLessons, LessonResponse, LessonMetadata, LessonStatus, TeacherLessons, Lesson, \
    LessonsComments, ChatBotMessages, UserRegister, User, UserCredentials


class MongoDBApi:
    def __init__(self, mongo_db, mongo_uri):
        self.mongo_db = mongo_db
        self.mongo_uri = mongo_uri
        self._db = self.__connect()
        self.__ensure_indexes()

    def __connect(self):
        try:
            client = MongoClient(self.mongo_uri)
            db = client[self.mongo_db]
            # Ensure indexes exist
            logging.info("Connected to MongoDB")
            return db
        except ConnectionFailure as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            raise e

    def __ensure_indexes(self):
        try:
            self._db.users.create_index([("id", ASCENDING)], unique=True)
            self._db.users.create_index([("email", ASCENDING)], unique=True)
            self._db.user_credentials.create_index([("email", ASCENDING)], unique=True)
        except DuplicateKeyError as e:
            logging.warning(f"Index creation skipped due to duplication: {e}")

    def get_lessons_metadata_by_student_id(self, student_id: str):
        try:
            student_lessons = list(self._db.student_lessons.find({"studentId": student_id}))
            if not student_lessons:
                return []

            lessons = []
            for student_lesson in student_lessons:
                lesson_id = student_lesson["lessonId"]

                metadata = self._db.lessons_metadata.find_one({"_id": ObjectId(lesson_id)})
                if not metadata:
                    continue

                status = self._db.lesson_status.find_one({"lessonId": lesson_id, "studentId": student_id})
                if not status:
                    continue

                lesson_response = LessonResponse(
                    lessonId=lesson_id,
                    studentId=student_id,
                    metadata=LessonMetadata(**metadata),
                    status=LessonStatus(**status)
                )
                lessons.append(lesson_response)

            return lessons
        except Exception as e:
            logging.error(f"Error getting lesson metadata by student ID: {e}")
            return []

    def remove_all_lesson_data_from_student(self, student: StudentLessons):
        try:
            self._db.student_lessons.delete_one({"lessonId": student.lessonId, "studentId": student.studentId})
            self._db.lesson_status.delete_one({"lessonId": student.lessonId, "studentId": student.studentId})
            self._db.lesson_comments.delete_many({"lessonsId": student.lessonId, "studentId": student.studentId})
            self._db.chatbot_messages.delete_many({"lessonId": student.lessonId, "studentId": student.studentId})
        except Exception as e:
            logging.error(f"Error disassociating student from lesson: {e}")

    def associate_student_to_lesson(self, student_lesson: StudentLessons):
        try:
            result = self._db.student_lessons.insert_one(student_lesson.dict())
            return result
        except Exception as e:
            logging.error(f"Error associating student to lesson: {e}")
            return None

    def add_lesson_to_teacher(self, teacher_lesson: TeacherLessons):
        try:
            return self._db.teacher_lessons.insert_one(teacher_lesson.dict())
        except Exception as e:
            logging.error(f"Error associating teacher to lesson: {e}")
            return None

    def add_lesson(self, lesson: Lesson):
        try:
            only_lesson = lesson.dict(include={'audio', 'highlightsTimestamps'})
            result = self._db.lessons.insert_one(only_lesson)
            metadata_lesson = {**lesson.metadata.dict(), '_id': result.inserted_id}
            result_metadata = self._db.lessons_metadata.insert_one(metadata_lesson)
            if result.inserted_id and result_metadata.inserted_id == result.inserted_id:
                return result.inserted_id
        except Exception as e:
            logging.error(f"Error adding lesson: {e}")
            return None

    def get_all_lessons_metadata(self):
        try:
            return list(self._db.lessons_metadata.find())
        except Exception as e:
            logging.error(f"Error getting all lessons metadata: {e}")
            return []

    def get_all_lessons(self):
        try:
            return list(self._db.lessons.find())
        except Exception as e:
            logging.error(f"Error getting all lessons: {e}")
            return []

    def get_lesson_by_id(self, id: str):
        try:
            return self._db.lessons.find_one({"_id": ObjectId(id)})
        except Exception as e:
            logging.error(f"Error getting lesson by ID: {e}")
            return None

    def update_lesson_status(self, update: LessonStatus):
        try:
            return self._db.lesson_status.update_one(
                {"lessonId": update.lessonId, "studentId": update.studentId},
                {"$set": update.dict()}
            )
        except Exception as e:
            logging.error(f"Error updating lesson status: {e}")
            return None

    def get_all_lesson_statuses(self):
        try:
            return list(self._db.lesson_status.find())
        except Exception as e:
            logging.error(f"Error getting all lesson statuses: {e}")
            return []

    def get_lesson_status_by_ids(self, student_id: str, lesson_id: str):
        try:
            return self._db.lesson_status.find_one({"studentId": student_id, "lessonId": lesson_id})
        except Exception as e:
            logging.error(f"Error getting lesson status by IDs: {e}")
            return None

    def add_lesson_status(self, lesson_status: LessonStatus):
        try:
            return self._db.lesson_status.insert_one(lesson_status.dict())
        except Exception as e:
            logging.error(f"Error adding lesson status: {e}")
            return None

    def delete_lesson_comment_by_id(self, id: str):
        try:
            return self._db.lesson_comments.delete_one({"_id": ObjectId(id)})
        except Exception as e:
            logging.error(f"Error deleting lesson comment by ID: {e}")
            return None

    def get_lesson_comments_by_ids(self, studentId: str, lessonsId: str):
        try:
            return list(self._db.lesson_comments.find({"lessonsId": lessonsId, "studentId": studentId}))
        except Exception as e:
            logging.error(f"Error getting lesson comments by IDs: {e}")
            return []

    def add_lesson_comment(self, lesson_comment: LessonsComments):
        try:
            return self._db.lesson_comments.insert_one(lesson_comment.dict())
        except Exception as e:
            logging.error(f"Error adding lesson comment: {e}")
            return None

    def delete_lesson_messages(self, lessonId: str, studentId: str):
        try:
            return self._db.chatbot_messages.delete_many({"lessonId": lessonId, "studentId": studentId})
        except Exception as e:
            logging.error(f"Error clearing chatbot messages: {e}")
            return None

    def get_lesson_messages(self, studentId: str, lessonId: str):
        try:
            return list(self._db.chatbot_messages.find({"studentId": studentId, "lessonId": lessonId}))
        except Exception as e:
            logging.error(f"Error getting chatbot messages: {e}")
            return []

    def add_lesson_message(self, chatbot_message: ChatBotMessages):
        try:
            return self._db.chatbot_messages.insert_one(chatbot_message.dict())
        except Exception as e:
            logging.error(f"Error adding chatbot message: {e}")
            return None

    def get_all_student_lessons_by_student_id(self, studentId: str):
        try:
            return list(self._db.student_lessons.find({"studentId": studentId}))
        except Exception as e:
            logging.error(f"Error getting all student lessons by student ID: {e}")
            return []

    def get_all_teacher_lessons_by_teacher_id(self, teacherId: str):
        try:
            return list(self._db.teacher_lessons.find({"teacherId": teacherId}))
        except Exception as e:
            logging.error(f"Error getting all teacher lessons by teacher ID: {e}")
            return []

    def get_user_by_id(self, id: str):
        try:
            return self._db.users.find_one({"_id": ObjectId(id)})
        except Exception as e:
            logging.error(f"Error getting user by ID: {e}")
            return None

    def get_all_users(self):
        try:
            return list(self._db.users.find())
        except Exception as e:
            logging.error(f"Error getting all users: {e}")
            return []

    def add_user(self, user: User):
        try:
            return self._db.users.insert_one(user.dict())
        except Exception as e:
            logging.error(f"Error adding new user: {e}")
            return None

    def add_user_cred(self, user_cred: UserCredentials):
        try:
            return self._db.user_credentials.insert_one(user_cred.dict())
        except Exception as e:
            logging.error(f"Error adding new user credentials: {e}")
            return None

    def remove_user_cred(self, user_cred: UserCredentials):
        try:
            return self._db.user_credentials.delete_one(user_cred.dict())
        except Exception as e:
            logging.error(f"Error deleting new user credentials: {e}")
            return None

import logging

from bson import ObjectId
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, DuplicateKeyError

# Assuming the data models are defined as dataclasses
from models.mongo import LessonResponse, LessonMetadata, LessonStatus, Lesson, \
    LessonsComments, ChatBotMessages, User, UserCredentials, UserLessons


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

    def get_lessons_by_user_id(self, user_id: str):
        return list(self._db.user_lessons.find({"userId": user_id}))
    
    def get_lessons_metadata_by_user_id(self, lesson_id):
        return self._db.lessons_metadata.find_one({"_id": ObjectId(lesson_id)})
    
    # def get_lessons_metadata_by_user_id(self, user_id: str):
    #     try:
    #         user_lessons = list(self._db.user_lessons.find({"userId": user_id}))
    #         if not user_lessons:
    #             return []
    #
    #         lessons = []
    #         for student_lesson in user_lessons:
    #             lesson_id = student_lesson["lessonId"]
    #
    #             metadata = self._db.lessons_metadata.find_one({"_id": ObjectId(lesson_id)})
    #             if not metadata:
    #                 continue
    #
    #             status = self._db.lesson_status.find_one({"lessonId": lesson_id, "userId": user_id})
    #             if not status:
    #                 continue
    #
    #             lesson_response = LessonResponse(
    #                 lessonId=lesson_id,
    #                 userId=user_id,
    #                 metadata=LessonMetadata(**metadata),
    #                 status=LessonStatus(**status)
    #             )
    #             lessons.append(lesson_response)
    #
    #         return lessons
    #     except Exception as e:
    #         logging.error(f"Error getting lesson metadata by user ID: {e}")
    #         return []

    def remove_all_lesson_data_from_user(self, user_lesson: UserLessons):
        try:
            self._db.user_lessons.delete_one({"lessonId": user_lesson.lessonId, "userId": user_lesson.userId})
            self._db.lesson_status.delete_one({"lessonId": user_lesson.lessonId, "userId": user_lesson.userId})
            self._db.lesson_comments.delete_many({"lessonsId": user_lesson.lessonId, "userId": user_lesson.userId})
            self._db.chatbot_messages.delete_many({"lessonId": user_lesson.lessonId, "userId": user_lesson.userId})
        except Exception as e:
            logging.error(f"Error disassociating user from lesson: {e}")

    def associate_user_to_lesson(self, user_lesson: UserLessons):
        try:
            result = self._db.user_lessons.insert_one(user_lesson.dict())
            return result
        except Exception as e:
            logging.error(f"Error associating user to lesson: {e}")
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
                {"lessonId": update.lessonId, "userId": update.userId},
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

    def get_lesson_status_by_ids(self, user_id: str, lesson_id: str):
        try:
            return self._db.lesson_status.find_one({"userId": user_id, "lessonId": lesson_id})
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

    def get_lesson_comments_by_ids(self, userId: str, lessonsId: str):
        try:
            return list(self._db.lesson_comments.find({"lessonsId": lessonsId, "userId": userId}))
        except Exception as e:
            logging.error(f"Error getting lesson comments by IDs: {e}")
            return []

    def add_lesson_comment(self, lesson_comment: LessonsComments):
        try:
            return self._db.lesson_comments.insert_one(lesson_comment.dict())
        except Exception as e:
            logging.error(f"Error adding lesson comment: {e}")
            return None

    def delete_lesson_messages(self, lessonId: str, userId: str):
        try:
            return self._db.chatbot_messages.delete_many({"lessonId": lessonId, "userId": userId})
        except Exception as e:
            logging.error(f"Error clearing chatbot messages: {e}")
            return None

    def get_lesson_messages(self, userId: str, lessonId: str):
        try:
            return list(self._db.chatbot_messages.find({"userId": userId, "lessonId": lessonId}))
        except Exception as e:
            logging.error(f"Error getting chatbot messages: {e}")
            return []

    def add_lesson_message(self, chatbot_message: ChatBotMessages):
        try:
            return self._db.chatbot_messages.insert_one(chatbot_message.dict())
        except Exception as e:
            logging.error(f"Error adding chatbot message: {e}")
            return None

    def get_all_user_lessons_by_user_id(self, userId: str):
        try:
            return list(self._db.user_lessons.find({"userId": userId}))
        except Exception as e:
            logging.error(f"Error getting all user lessons by user ID: {e}")
            return []

    def get_user_by_id(self, id: str):
        try:
            return self._db.users.find_one({"_id": ObjectId(id)})
        except Exception as e:
            logging.error(f"Error getting user by ID: {e}")
            return None

    def get_user_by_email(self, email: str):
        try:
            return self._db.users.find_one({"email": email})
        except Exception as e:
            logging.error(f"Error getting user by email: {e}")
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

    def get_user_cred_by_email(self, email: str):
        try:
            return self._db.user_credentials.find_one({"email": email})
        except Exception as e:
            logging.error(f"Error getting user credentials by email: {e}")
            return None

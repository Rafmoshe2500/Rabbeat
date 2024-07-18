import logging
from typing import List

from bson import ObjectId
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, DuplicateKeyError, ServerSelectionTimeoutError

# Assuming the data models are defined as dataclasses
from database.piplines import PIPELINE_ALL_TEACHERS_WITH_PROFILE, get_shared_lessons_pipeline
from models.lesson import Lesson, LessonDetails, UpdateComment, LessonStatus, LessonComments, ChatBotMessages, \
    AssociateNewStudent, LessonTestAudio
from models.profile import TeacherProfile, UpdateProfile
from models.tests import Message
from models.user import User, UserCredentials
from tools.consts import MONGO_DB_NAME, MONGO_URI


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
            print(e)
        except ServerSelectionTimeoutError as e:
            print(e)
        except Exception as e:
            print(e)

    def __ensure_indexes(self) -> None:
        try:
            self._db.users.create_index([("id", ASCENDING)], unique=True)
            self._db.users.create_index([("email", ASCENDING)], unique=True)
            self._db.user_credentials.create_index([("email", ASCENDING)], unique=True)
        except DuplicateKeyError as e:
            logging.warning(f"Index creation skipped due to duplication: {e}")

    def get_lessons_by_user_id(self, user_id: str) -> List[Lesson]:
        return list(self._db.user_lessons.find({"userId": user_id}))

    def get_lessons_details_by_user_id(self, lesson_id) -> List[LessonDetails]:
        return self._db.lessons_details.find_one({"_id": ObjectId(lesson_id)})

    def remove_all_lesson_data_from_user(self, lesson_id, user_id) -> None:
        try:
            self._db.user_lessons.delete_one({"lessonId": lesson_id, "userId": user_id})
            self._db.study_zone.delete_one({"lessonId": lesson_id, "userId": user_id})
            self._db.lesson_comments.delete_many({"lessonsId": lesson_id, "userId": user_id})
            self._db.chatbot_messages.delete_many({"lessonId": lesson_id, "userId": user_id})
            self._db.test_chat_lesson.delete_many({"lessonId": lesson_id, "userId": user_id})
        except Exception as e:
            logging.error(f"Error disassociating user from lesson: {e}")

    def associate_user_to_lesson(self, user_id, lesson_id):
        try:
            result = self._db.user_lessons.insert_one({'userId': user_id, 'lessonId': lesson_id})
            return result
        except Exception as e:
            logging.error(f"Error associating user to lesson: {e}")
            return None

    def add_lesson(self, lesson: Lesson) -> str:
        try:
            only_lesson = lesson.dict(include={'audio', 'highlightsTimestamps', 'sttText'})
            result = self._db.lessons.insert_one(only_lesson)
            details_lesson = {**lesson.details.dict(), 'lessonId': result.inserted_id}
            result_details = self._db.lessons_details.insert_one(details_lesson)
            if result.inserted_id and result_details.inserted_id == result.inserted_id:
                return result.inserted_id
        except Exception as e:
            logging.error(f"Error adding lesson: {e}")

    def get_all_lessons_details(self) -> List[LessonDetails]:
        try:
            return list(self._db.lessons_details.find())
        except Exception as e:
            logging.error(f"Error getting all lessons details: {e}")
            return []

    def get_all_lessons(self) -> List[Lesson]:
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

    def get_lesson_details_by_id(self, lesson_id: str):
        try:
            return self._db.lessons_details.find_one({"lessonId": lesson_id})
        except Exception as e:
            logging.error(f"Error getting lesson by ID: {e}")
            return None

    def update_study_zone_status(self, update: LessonStatus):
        try:
            return self._db.study_zone.update_one(
                {"userId": update.userId, "lessonId": update.lessonId},
                {"$set": update.dict()}
            )
        except Exception as e:
            logging.error(f"Error updating lesson status: {e}")
            return None

    def update_lesson_comment(self, comment_id, update: UpdateComment):
        try:
            return self._db.lesson_comments.update_one(
                {"_id": ObjectId(comment_id)},
                {"$set": update.dict()}
            )
        except Exception as e:
            logging.error(f"Error updating lesson comment: {e}")
            return None

    # def get_all_lesson_statuses(self):
    #     try:
    #         return list(self._db.lesson_status.find())
    #     except Exception as e:
    #         logging.error(f"Error getting all lesson statuses: {e}")
    #         return []

    def get_study_zone_by_ids(self, user_id: str, lesson_id: str):
        try:
            return self._db.study_zone.find_one({"userId": user_id, "lessonId": lesson_id})
        except Exception as e:
            logging.error(f"Error getting lesson status by IDs: {e}")
            return None

    # def add_lesson_status(self, lesson_status: LessonStatus):
    #     try:
    #         return self._db.lesson_status.insert_one(lesson_status.dict())
    #     except Exception as e:
    #         logging.error(f"Error adding lesson status: {e}")
    #         return None

    def delete_lesson_comment_by_id(self, id: str):
        try:
            return self._db.lesson_comments.delete_one({"_id": ObjectId(id)})
        except Exception as e:
            logging.error(f"Error deleting lesson comment by ID: {e}")
            return None

    def get_lesson_comments_by_ids(self, userId: str, lessonsId: str):
        try:
            return list(self._db.lesson_comments.find({"lessonId": lessonsId, "userId": userId}))
        except Exception as e:
            logging.error(f"Error getting lesson comments by IDs: {e}")
            return []

    def add_lesson_comment(self, lesson_comment: LessonComments):
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

    def get_user_by_id(self, user_id: str):
        try:
            return self._db.users.find_one({"id": user_id})
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

    def add_teacher_profile(self, profile: TeacherProfile):
        try:
            return self._db.teacher_profile.insert_one(profile.dict())
        except Exception as e:
            logging.error(f"Error adding new user credentials: {e}")
            return None

    def get_teacher_profile(self, teacherId):
        try:
            return self._db.teacher_profile.find_one({"id": teacherId})
        except Exception as e:
            logging.error(f"Error getting teacher profile by ID: {e}")
            return None

    def update_profile(self, teacher_id: str, update: UpdateProfile):
        try:
            if update.key == 'recommendations':
                update.value = [x.dict() for x in update.value]
            self._db.teacher_profile.update_one({"id": teacher_id}, {"$set": {update.key: update.value}})
            return True
        except Exception as e:
            logging.error(f"Failed update profile: {e}")
            return None

    def update_user(self, user_id: str, update: UpdateProfile):
        try:
            if update.key == 'recommendations':
                update.value = [x.dict() for x in update.value]
            self._db.users.update_one({"id": user_id}, {"$set": {update.key: update.value}})
            return True
        except Exception as e:
            logging.error(f"Failed update profile: {e}")
            return None

    def get_all_teacher_with_profiles(self):
        try:
            return list(self._db.users.aggregate(PIPELINE_ALL_TEACHERS_WITH_PROFILE))
        except Exception as e:
            logging.error(f"Failed update profile: {e}")
            return None

    def associate_student_to_teacher(self, new_associate: AssociateNewStudent):
        try:
            return self._db.students_by_teacher.insert_one(new_associate.dict())
        except Exception as e:
            logging.error(f"Error associate new student to teacher: {e}")
            return None

    def get_connection(self, student_id, teacher_id):
        try:
            return self._db.students_by_teacher.find_one({"studentId": student_id, "teacherId": teacher_id})
        except Exception as e:
            return None

    def get_all_students_by_teacher(self, teacher_id):
        try:
            return list(self._db.students_by_teacher.find({"teacherId": teacher_id}))
        except Exception as e:
            return []

    def get_shared_lessons(self, student_id, teacher_id) -> List[LessonDetails]:
        pipeline = get_shared_lessons_pipeline(student_id, teacher_id)
        return list(self._db.user_lessons.aggregate(pipeline))

    def add_test_chat(self, lesson_id, user_id):
        try:
            return self._db.test_chat_lesson.insert_one({"userId": user_id, "lessonId": lesson_id, "messages": []})
        except Exception as e:
            logging.error(f"Error adding lesson chat: {e}")
            return None

    def get_test_chat_by_ids(self, user_id: str, lesson_id: str):
        try:
            return self._db.test_chat_lesson.find_one({"userId": user_id, "lessonId": lesson_id})
        except Exception as e:
            logging.error(f"Error getting lesson chat by IDs: {e}")
            return None

    def add_message_to_chat(self, lesson_id: str, user_id: str, new_message: Message):
        message_dict = new_message.dict()

        result = self._db.test_chat_lesson.update_one(
            {"lessonId": lesson_id, "userId": user_id},
            {"$push": {"messages": message_dict}},
            upsert=True  # This will create a new document if it doesn't exist
        )

        return result.modified_count > 0 or result.upserted_id is not None

    def add_lesson_test_audio(self):
        return self._db.lesson_test_audio.insert_one({'audio': ''})

    def update_lesson_test_audio(self, audio: LessonTestAudio):
        self._db.lesson_test_audio.update_one({'_id': ObjectId(audio.id)}, {'audio': audio.audio}, upsert=True)

    def add_new_study_zone(self, chat_id, test_audio_id, lesson_id, user_id):
        self._db.study_zone.insert_one(
            {'chatId': chat_id, 'testAudioId': test_audio_id, 'status': 'not-started',
             'lessonId': lesson_id, 'userId': user_id})


mongo_db = MongoDBApi(MONGO_DB_NAME, MONGO_URI)

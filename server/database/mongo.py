import logging
from typing import List

from bson import ObjectId, errors as bson_errors
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, DuplicateKeyError, ServerSelectionTimeoutError

from database.piplines import PIPELINE_ALL_TEACHERS_WITH_PROFILE, get_shared_lessons_pipeline, \
    get_students_by_teacher_ids_pipeline
from exceptions.exceptions import BackendConnectionError, BackendIndexCreationError, BackendQueryError, \
    BackendInvalidIdError, BackendDocumentNotFoundError, BackendDeleteError, BackendInsertError, BackendUpdateError
from models.lesson import Lesson, LessonDetails, UpdateComment, LessonStatus, LessonComments, ChatBotMessages, \
    AssociateNewStudent
from models.profile import TeacherProfile, UpdateProfile, CreateSample
from models.tests import Message
from models.user import User, UserCredentials
from tools.consts import MONGO_DB_NAME, MONGO_URI


class MongoDBApi:
    def __init__(self, db, uri):
        self.mongo_db = db
        self.mongo_uri = uri
        self._db = self.__connect()
        self.__ensure_indexes()

    def __connect(self):
        try:
            client = MongoClient(self.mongo_uri)
            db = client[self.mongo_db]
            logging.info("Connected to MongoDB")
            return db
        except ConnectionFailure as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            raise BackendConnectionError(str(e))
        except ServerSelectionTimeoutError as e:
            logging.error(f"Server selection timeout: {e}")
            raise BackendConnectionError(str(e))
        except Exception as e:
            logging.error(f"Unexpected error connecting to MongoDB: {e}")
            raise BackendConnectionError(str(e))

    def __ensure_indexes(self) -> None:
        try:
            self._db.users.create_index([("id", ASCENDING)], unique=True)
            self._db.users.create_index([("email", ASCENDING)], unique=True)
            self._db.user_credentials.create_index([("email", ASCENDING)], unique=True)
        except DuplicateKeyError as e:
            logging.warning(f"Index creation skipped due to duplication: {e}")
        except Exception as e:
            logging.error(f"Error creating indexes: {e}")
            raise BackendIndexCreationError(str(e))

    def get_lessons_by_user_id(self, user_id: str) -> List[Lesson]:
        try:
            return list(self._db.user_lessons.find({"userId": user_id}))
        except Exception as e:
            logging.error(f"Error getting lessons by user ID: {e}")
            raise BackendQueryError(f"Failed to retrieve lessons for user {user_id}")

    def get_lessons_details_by_lesson_id(self, lesson_id) -> LessonDetails:
        try:
            lesson_details = self._db.lessons_details.find_one({"_id": ObjectId(lesson_id)})
            if lesson_details is None:
                raise BackendDocumentNotFoundError(f"Lesson details not found for lesson ID {lesson_id}")
            return lesson_details
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid lesson ID: {lesson_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting lesson details: {e}")
            raise BackendQueryError(f"Failed to retrieve lesson details for lesson {lesson_id}")

    def get_users_associations_to_lesson(self, lesson_id):
        try:
            return list(self._db.user_lessons.find({'lessonId': lesson_id}))
        except Exception as e:
            logging.error(f"Error getting user associations for lesson: {e}")
            raise BackendQueryError(f"Failed to retrieve user associations for lesson {lesson_id}")

    def delete_lesson_by_id(self, lesson_id):
        try:
            result = self._db.lessons.delete_one({"_id": ObjectId(lesson_id)})
            if result.deleted_count == 0:
                raise BackendDocumentNotFoundError(f"Lesson with ID {lesson_id} not found")
            return result
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid lesson ID: {lesson_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error deleting lesson: {e}")
            raise BackendDeleteError(f"Failed to delete lesson {lesson_id}")

    def delete_lesson_details_by_id(self, lesson_id):
        try:
            result = self._db.lessons_details.delete_one({"_id": ObjectId(lesson_id)})
            if result.deleted_count == 0:
                raise BackendDocumentNotFoundError(f"Lesson details with ID {lesson_id} not found")
            return result
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid lesson ID: {lesson_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error deleting lesson details: {e}")
            raise BackendDeleteError(f"Failed to delete lesson details {lesson_id}")

    def delete_user_lessons_by_lesson_id(self, lesson_id):
        try:
            result = self._db.user_lessons.delete_one({"lessonId": lesson_id})
            return result
        except Exception as e:
            logging.error(f"Error deleting user lessons: {e}")
            raise BackendDeleteError(f"Failed to delete user lessons for lesson {lesson_id}")

    def remove_all_lesson_data_from_user(self, lesson_id, user_id) -> None:
        try:
            self._db.user_lessons.delete_one({"lessonId": lesson_id, "userId": user_id})
            study_zone = self.get_study_zone_by_ids(user_id, lesson_id)
            if study_zone:
                self._db.lesson_test_audio.delete_one({'_id': ObjectId(study_zone['testAudioId'])})
                self._db.lesson_notifications.delete_one({'id': ObjectId(study_zone['notificationsId'])})
                self._db.study_zone.delete_one({"lessonId": lesson_id, "userId": user_id})
            self._db.lesson_comments.delete_many({"lessonsId": lesson_id, "userId": user_id})
            self._db.chatbot_messages.delete_many({"lessonId": lesson_id, "userId": user_id})
            if study_zone:
                self._db.test_chat_lesson.delete_one({"_id": ObjectId(study_zone['chatId'])})
        except Exception as e:
            logging.error(f"Error disassociating user from lesson: {e}")
            raise BackendDeleteError(f"Failed to remove lesson data for user {user_id} and lesson {lesson_id}")

    def associate_user_to_lesson(self, user_id, lesson_id):
        try:
            result = self._db.user_lessons.insert_one({'userId': user_id, 'lessonId': lesson_id})
            return result
        except Exception as e:
            logging.error(f"Error associating user to lesson: {e}")
            raise BackendInsertError(f"Failed to associate user {user_id} with lesson {lesson_id}")

    def add_lesson(self, lesson: Lesson) -> str:
        try:
            only_lesson = lesson.dict(include={'audio', 'highlightsTimestamps', 'sttText'})
            result = self._db.lessons.insert_one(only_lesson)
            details_lesson = {**lesson.details.dict(), '_id': result.inserted_id}
            result_details = self._db.lessons_details.insert_one(details_lesson)
            if result.inserted_id and result_details.inserted_id == result.inserted_id:
                return result
            else:
                raise BackendInsertError("Failed to insert lesson and lesson details")
        except Exception as e:
            logging.error(f"Error adding lesson: {e}")
            raise BackendInsertError("Failed to add lesson")

    def get_all_lessons_details(self) -> List[LessonDetails]:
        return list(self._db.lessons_details.find())

    def get_all_lessons(self) -> List[Lesson]:
        return list(self._db.lessons.find())

    def get_lesson_by_id(self, lesson_id: str):
        try:
            lesson = self._db.lessons.find_one({"_id": ObjectId(lesson_id)})
            if lesson is None:
                raise BackendDocumentNotFoundError(f"Lesson with ID {lesson_id} not found")
            return lesson
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid lesson ID: {lesson_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting lesson by ID: {e}")
            raise BackendQueryError(f"Failed to retrieve lesson with ID {lesson_id}")

    def get_lesson_details_by_id(self, lesson_id: str):
        try:
            lesson_details = self._db.lessons_details.find_one({"_id": ObjectId(lesson_id)})
            if lesson_details is None:
                raise BackendDocumentNotFoundError(f"Lesson details with ID {lesson_id} not found")
            return lesson_details
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid lesson ID: {lesson_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting lesson details by ID: {e}")
            raise BackendQueryError(f"Failed to retrieve lesson details with ID {lesson_id}")

    def update_study_zone_status(self, update: LessonStatus):
        try:
            result = self._db.study_zone.update_one(
                {"userId": update.userId, "lessonId": update.lessonId},
                {"$set": update.dict()}
            )
            if result.matched_count == 0:
                raise BackendDocumentNotFoundError(
                    f"Study zone not found for user {update.userId} and lesson {update.lessonId}")
            return result
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error updating lesson status: {e}")
            raise BackendUpdateError(
                f"Failed to update study zone status for user {update.userId} and lesson {update.lessonId}")

    def update_study_zone(self, field: str, value, update: dict):
        try:
            result = self._db.study_zone.update_one(
                {field: value},
                {"$set": update}
            )
            if result.matched_count == 0:
                raise BackendDocumentNotFoundError(f"Study zone not found with {field}={value}")
            return result
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error updating study zone: {e}")
            raise BackendUpdateError(f"Failed to update study zone with {field}={value}")

    def get_study_zone_by_field(self, field, value):
        try:
            study_zone = self._db.study_zone.find_one({field: value})
            if study_zone is None:
                raise BackendDocumentNotFoundError(f"Study zone not found with {field}={value}")
            return study_zone
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting study zone by field: {e}")
            raise BackendQueryError(f"Failed to retrieve study zone with {field}={value}")

    def update_lesson_comment(self, comment_id, update: UpdateComment):
        try:
            result = self._db.lesson_comments.update_one(
                {"_id": ObjectId(comment_id)},
                {"$set": update.dict()}
            )
            if result.matched_count == 0:
                raise BackendDocumentNotFoundError(f"Lesson comment with ID {comment_id} not found")
            return result
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid comment ID: {comment_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error updating lesson comment: {e}")
            raise BackendUpdateError(f"Failed to update lesson comment with ID {comment_id}")

    def get_study_zone_by_ids(self, user_id: str, lesson_id: str):
        try:
            study_zone = self._db.study_zone.find_one({"userId": user_id, "lessonId": lesson_id})
            if study_zone is None:
                raise BackendDocumentNotFoundError(f"Study zone not found for user {user_id} and lesson {lesson_id}")
            return study_zone
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting study zone by IDs: {e}")
            raise BackendQueryError(f"Failed to retrieve study zone for user {user_id} and lesson {lesson_id}")

    def delete_lesson_comment_by_id(self, comment_id: str):
        try:
            result = self._db.lesson_comments.delete_one({"_id": ObjectId(comment_id)})
            if result.deleted_count == 0:
                raise BackendDocumentNotFoundError(f"Lesson comment with ID {comment_id} not found")
            return result
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid comment ID: {comment_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error deleting lesson comment by ID: {e}")
            raise BackendDeleteError(f"Failed to delete lesson comment with ID {id}")

    def get_lesson_comments_by_ids(self, user_id: str, lesson_id: str):
        return list(self._db.lesson_comments.find({"lessonId": lesson_id, "userId": user_id}))

    def add_lesson_comment(self, lesson_comment: LessonComments):
        try:
            result = self._db.lesson_comments.insert_one(lesson_comment.dict())
            return result
        except Exception as e:
            logging.error(f"Error adding lesson comment: {e}")
            raise BackendInsertError("Failed to add lesson comment")

    def delete_lesson_messages(self, lesson_id: str, user_id: str):
        try:
            result = self._db.chatbot_messages.delete_many({"lessonId": lesson_id, "userId": user_id})
            return result
        except Exception as e:
            logging.error(f"Error clearing chatbot messages: {e}")
            raise BackendDeleteError(f"Failed to delete lesson messages for lesson {lesson_id} and user {user_id}")

    def get_lesson_messages(self, user_id: str, lesson_id: str):
        return list(self._db.chatbot_messages.find({"userId": user_id, "lessonId": lesson_id}))

    def add_lesson_message(self, chatbot_message: ChatBotMessages):
        try:
            result = self._db.chatbot_messages.insert_one(chatbot_message.dict())
            return result
        except Exception as e:
            logging.error(f"Error adding chatbot message: {e}")
            raise BackendInsertError("Failed to add lesson message")

    def get_all_user_lessons_by_user_id(self, user_id: str):
        return list(self._db.user_lessons.find({"userId": user_id}))

    def get_user_by_id(self, user_id: str):
        try:
            user = self._db.users.find_one({"id": user_id})
            if user is None:
                raise BackendDocumentNotFoundError(f"User with ID {user_id} not found")
            return user
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting user by ID: {e}")
            raise BackendQueryError(f"Failed to retrieve user with ID {user_id}")

    def get_user_by_email(self, email: str):
        try:
            user = self._db.users.find_one({"email": email})
            if user is None:
                raise BackendDocumentNotFoundError(f"User with email {email} not found")
            return user
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting user by email: {e}")
            raise BackendQueryError(f"Failed to retrieve user with email {email}")

    def get_all_users(self):
        return list(self._db.users.find())

    def add_user(self, user: User):
        try:
            result = self._db.users.insert_one(user.dict())
            return result
        except DuplicateKeyError:
            raise BackendInsertError(f"User with email {user.email} already exists")
        except Exception as e:
            logging.error(f"Error adding new user: {e}")
            raise BackendInsertError("Failed to add new user")

    def add_user_cred(self, user_cred: UserCredentials):
        try:
            result = self._db.user_credentials.insert_one(user_cred.dict())
            return result
        except DuplicateKeyError:
            raise BackendInsertError(f"User credentials for email {user_cred.email} already exist")
        except Exception as e:
            logging.error(f"Error adding new user credentials: {e}")
            raise BackendInsertError("Failed to add new user credentials")

    def remove_user_cred(self, user_cred: UserCredentials):
        try:
            result = self._db.user_credentials.delete_one(user_cred.dict())
            if result.deleted_count == 0:
                raise BackendDocumentNotFoundError(f"User credentials for email {user_cred.email} not found")
            return result
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error deleting user credentials: {e}")
            raise BackendDeleteError(f"Failed to delete user credentials for email {user_cred.email}")

    def get_user_cred_by_email(self, email: str):
        try:
            user_cred = self._db.user_credentials.find_one({"email": email})
            if user_cred is None:
                raise BackendDocumentNotFoundError(f"User credentials for email {email} not found")
            return user_cred
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting user credentials by email: {e}")
            raise BackendQueryError(f"Failed to retrieve user credentials for email {email}")

    def add_teacher_profile(self, profile: TeacherProfile):
        try:
            result = self._db.teacher_profile.insert_one(profile.dict())
            return result
        except DuplicateKeyError:
            raise BackendInsertError(f"Teacher profile for ID {profile.id} already exists")
        except Exception as e:
            logging.error(f"Error adding new teacher profile: {e}")
            raise BackendInsertError("Failed to add new teacher profile")

    def get_teacher_profile(self, teacher_id):
        try:
            profile = self._db.teacher_profile.find_one({"id": teacher_id})
            if profile is None:
                raise BackendDocumentNotFoundError(f"Teacher profile for ID {teacher_id} not found")
            return profile
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting teacher profile by ID: {e}")
            raise BackendQueryError(f"Failed to retrieve teacher profile for ID {teacher_id}")

    def update_profile(self, teacher_id: str, update: UpdateProfile):
        try:
            if update.key == 'recommendations':
                update.value = [x.dict() for x in update.value]
            result = self._db.teacher_profile.update_one({"id": teacher_id}, {"$set": {update.key: update.value}})
            if result.matched_count == 0:
                raise BackendDocumentNotFoundError(f"Teacher profile for ID {teacher_id} not found")
            return True
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Failed update profile: {e}")
            raise BackendUpdateError(f"Failed to update profile for teacher {teacher_id}")

    def update_user(self, user_id: str, update: UpdateProfile):
        try:
            if update.key == 'recommendations':
                update.value = [x.dict() for x in update.value]
            result = self._db.users.update_one({"id": user_id}, {"$set": {update.key: update.value}})
            if result.matched_count == 0:
                raise BackendDocumentNotFoundError(f"User with ID {user_id} not found")
            return True
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Failed update user: {e}")
            raise BackendUpdateError(f"Failed to update user {user_id}")

    def get_all_teacher_with_profiles(self):
        return list(self._db.users.aggregate(PIPELINE_ALL_TEACHERS_WITH_PROFILE))

    def associate_student_to_teacher(self, new_associate: AssociateNewStudent):
        try:
            result = self._db.students_by_teacher.update_one(
                {"studentId": new_associate.studentId, "teacherId": new_associate.teacherId},
                {"$set": new_associate.dict()},
                upsert=True
            )
            return result
        except Exception as e:
            logging.error(f"Error associate new student to teacher: {e}")
            raise BackendUpdateError(
                f"Failed to associate student {new_associate.studentId} to teacher {new_associate.teacherId}")

    def check_connection_between_users(self, student_id, teacher_id):
        return self._db.students_by_teacher.find_one({"studentId": student_id, "teacherId": teacher_id})

    def get_students_by_teacher_id(self, teacher_id):
        pipeline = get_students_by_teacher_ids_pipeline(teacher_id)
        return list(self._db.students_by_teacher.aggregate(pipeline))

    def get_shared_lessons(self, student_id, teacher_id):
        pipeline = get_shared_lessons_pipeline(student_id, teacher_id)
        return list(self._db.user_lessons.aggregate(pipeline))

    def add_test_chat(self, lesson_id, user_id):
        try:
            result = self._db.test_chat_lesson.insert_one({
                "userId": user_id,
                "lessonId": lesson_id,
                "messages": [],
                "studentUnread": 0,
                "teacherUnread": 0
            })
            return result
        except Exception as e:
            logging.error(f"Error adding lesson chat: {e}")
            raise BackendInsertError(f"Failed to add test chat for lesson {lesson_id} and user {user_id}")

    def get_test_chat_by_id(self, chat_id: str):
        try:
            chat = self._db.test_chat_lesson.find_one({"_id": ObjectId(chat_id)})
            if chat is None:
                raise BackendDocumentNotFoundError(f"Test chat with ID {chat_id} not found")
            return chat
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid chat ID: {chat_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting lesson chat by ID: {e}")
            raise BackendQueryError(f"Failed to retrieve test chat with ID {chat_id}")

    def add_message_to_chat(self, chat_id: str, new_message: Message):
        try:
            message_dict = new_message.dict()
            result = self._db.test_chat_lesson.update_one(
                {"_id": ObjectId(chat_id)},
                {"$push": {"messages": message_dict}},
                upsert=True
            )
            return result.modified_count > 0 or result.upserted_id is not None
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid chat ID: {chat_id}")
        except Exception as e:
            logging.error(f"Error adding message to chat: {e}")
            raise BackendUpdateError(f"Failed to add message to chat {chat_id}")

    def update_chat_id(self, chat_id: str, sender, zero=None):
        try:
            update = {"$set": {f'{sender}Unread': 0}} if zero else {"$inc": {f'{sender}Unread': 1}}
            result = self._db.test_chat_lesson.update_one({'_id': ObjectId(chat_id)}, update)
            if result.matched_count == 0:
                raise BackendDocumentNotFoundError(f"Test chat with ID {chat_id} not found")
            return result
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid chat ID: {chat_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error updating chat: {e}")
            raise BackendUpdateError(f"Failed to update chat {chat_id}")

    def add_lesson_test_audio(self):
        try:
            result = self._db.lesson_test_audio.insert_one({'audio': ''})
            return result
        except Exception as e:
            logging.error(f"Error adding lesson test audio: {e}")
            raise BackendInsertError("Failed to add lesson test audio")

    def update_lesson_test_audio(self, audio_id: str, audio: str):
        try:
            result = self._db.lesson_test_audio.update_one({'_id': ObjectId(audio_id)}, {"$set": {'audio': audio}})
            if result.matched_count == 0:
                raise BackendDocumentNotFoundError(f"Lesson test audio with ID {audio_id} not found")
            return result
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid audio ID: {audio_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error updating lesson test audio: {e}")
            raise BackendUpdateError(f"Failed to update lesson test audio with ID {audio_id}")

    def get_lesson_test_audio(self, audio_id):
        try:
            audio = self._db.lesson_test_audio.find_one({'_id': ObjectId(audio_id)})
            if audio is None:
                raise BackendDocumentNotFoundError(f"Lesson test audio with ID {audio_id} not found")
            return audio
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid audio ID: {audio_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting lesson test audio: {e}")
            raise BackendQueryError(f"Failed to retrieve lesson test audio with ID {audio_id}")

    def add_new_study_zone(self, chat_id, test_audio_id, lesson_id, user_id, teacher_id, notifications_id):
        try:
            result = self._db.study_zone.insert_one({
                'chatId': chat_id,
                'testAudioId': test_audio_id,
                'status': 'not-started',
                'lessonId': lesson_id,
                'userId': user_id,
                'teacherId': teacher_id,
                'notificationsId': notifications_id
            })
            return result
        except Exception as e:
            logging.error(f"Error adding new study zone: {e}")
            raise BackendInsertError("Failed to add new study zone")

    def add_lesson_notifications(self):
        try:
            result = self._db.lesson_notifications.insert_one({
                'messageNotifications': False,
                'audioNotification': False,
                'lastSender': ''
            })
            return result
        except Exception as e:
            logging.error(f"Error adding lesson notifications: {e}")
            raise BackendInsertError("Failed to add lesson notifications")

    def update_notification_by_id(self, notification_id, update: dict):
        try:
            result = self._db.lesson_notifications.update_one(
                {"_id": ObjectId(notification_id)},
                {"$set": update}
            )
            if result.matched_count == 0:
                raise BackendDocumentNotFoundError(f"Lesson notification with ID {notification_id} not found")
            return result
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid notification ID: {notification_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error updating notification: {e}")
            raise BackendUpdateError(f"Failed to update notification with ID {notification_id}")

    def get_notification_by_id(self, notification_id):
        try:
            notification = self._db.lesson_notifications.find_one({'_id': ObjectId(notification_id)})
            if notification is None:
                raise BackendDocumentNotFoundError(f"Lesson notification with ID {notification_id} not found")
            return notification
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid notification ID: {notification_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting notification by ID: {e}")
            raise BackendQueryError(f"Failed to retrieve notification with ID {notification_id}")

    def add_new_sample(self, sample: CreateSample):
        try:
            return self._db.teacher_samples.insert_one(sample.dict())
        except Exception as e:
            logging.error(f"Error adding new sample: {e}")
            raise BackendInsertError("Failed to add new sample")

    def remove_sample(self, sample_id):
        try:
            result = self._db.teacher_samples.delete_one({"_id": ObjectId(sample_id)})
            if result.deleted_count == 0:
                raise BackendDocumentNotFoundError(f"Sample with ID {sample_id} not found")
            return result
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid sample ID: {sample_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error removing sample: {e}")
            raise BackendDeleteError(f"Failed to remove sample with ID {sample_id}")

    def get_samples(self, teacher_id):
        return list(self._db.teacher_samples.find({"teacherId": teacher_id}))

    def get_sample_by_id(self, sample_id):
        try:
            sample = self._db.teacher_samples.find_one({'_id': ObjectId(sample_id)})
            if sample is None:
                raise BackendDocumentNotFoundError(f"Sample with ID {sample_id} not found")
            return sample
        except bson_errors.InvalidId:
            raise BackendInvalidIdError(f"Invalid sample ID: {sample_id}")
        except BackendDocumentNotFoundError as e:
            logging.error(str(e))
            raise
        except Exception as e:
            logging.error(f"Error getting sample by ID: {e}")
            raise BackendQueryError(f"Failed to retrieve sample with ID {sample_id}")


mongo_db = MongoDBApi(MONGO_DB_NAME, MONGO_URI)

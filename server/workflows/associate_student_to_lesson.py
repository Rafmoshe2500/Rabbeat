from database.mongo import mongo_db
from workflows.base import BaseWorkflow


class AssociateUserToLessonFlow(BaseWorkflow):

    def __init__(self, teacher_id: str, student_id: str, lesson_id: str):
        self.teacher_id = teacher_id
        self.student_id = student_id
        self.lesson_id = lesson_id

    def __is_connected(self) -> bool:
        return mongo_db.check_connection_between_users(self.student_id, self.teacher_id)

    def __associate_user_to_lesson(self) -> None:
        mongo_db.associate_user_to_lesson(self.student_id, self.lesson_id)

    def __create_chat_room(self):
        return mongo_db.add_test_chat(self.lesson_id, self.student_id)

    @staticmethod
    def __create_self_test_audio():
        return mongo_db.add_lesson_test_audio()

    @staticmethod
    def __create_lesson_notifications():
        return mongo_db.add_lesson_notifications()

    def run(self):
        if not self.__is_connected():
            raise Exception("Student has no relationship with that teacher. please make connection.")
        self.__associate_user_to_lesson()
        chat_id = self.__create_chat_room()
        test_audio_id = self.__create_self_test_audio()
        notifications = self.__create_lesson_notifications()
        return mongo_db.add_new_study_zone(chat_id=str(chat_id.inserted_id),
                                           test_audio_id=str(test_audio_id.inserted_id),
                                           notifications_id=str(notifications.inserted_id),
                                           lesson_id=self.lesson_id,
                                           user_id=self.student_id,
                                           teacher_id=self.teacher_id)

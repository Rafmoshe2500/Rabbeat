from database.mongo import mongo_db
from models.user import User
from workflows.base import BaseWorkflow


class CreateStudyZone(BaseWorkflow):

    def __init__(self, teacher_id: str, student_id: str, lesson_id: str):
        self.teacher_id = teacher_id
        self.student_id = student_id
        self.lesson_id = lesson_id

    def __is_connected(self) -> bool:
        return mongo_db.get_connection(self.student_id, self.teacher_id)

    def __associate_user_to_lesson(self) -> None:
        mongo_db.associate_user_to_lesson(self.student_id, self.lesson_id)

    def __create_chat_room(self) -> str:
        return str(mongo_db.add_test_chat(self.lesson_id, self.student_id))

    @staticmethod
    def __create_self_test_audio():
        return str(mongo_db.add_lesson_test_audio())

    def run(self):
        if not self.__is_connected():
            raise Exception("Student has no relationship with that teacher. please make connection.")
        self.__associate_user_to_lesson()
        chat_id = self.__create_chat_room()
        test_audio_id = self.__create_self_test_audio()
        mongo_db.add_new_study_zone(chat_id, test_audio_id, self.lesson_id, self.student_id)

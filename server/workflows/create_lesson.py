from database.mongo import mongo_db
from models.lesson import CreateLesson, Lesson
from workflows.base import BaseWorkflow
from workflows.get_torah import TorahTextProcessor


class CreateLessonWorkflow(BaseWorkflow):

    def __init__(self, lesson: CreateLesson):
        self.lesson = lesson

    def __validate_lesson(self):
        torah_processor = TorahTextProcessor(self.lesson.details.pentateuch)
        torah_processor.get_all_torah_text_variants(self.lesson.details.startChapter,
                                                    self.lesson.details.startVerse,
                                                    self.lesson.details.endChapter,
                                                    self.lesson.details.endVerse)
        return True

    def run(self):
        if self.__validate_lesson():
            lesson_id = mongo_db.add_lesson(Lesson(**self.lesson.model_dump(exclude={'teacherId'})))
            mongo_db.associate_user_to_lesson(self.lesson.teacherId, str(lesson_id.inserted_id))
            return str(lesson_id.inserted_id)

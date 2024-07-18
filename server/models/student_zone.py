from pydantic import BaseModel


class CreateStudentZone(BaseModel):
    lessonId: str
    studentId: str
    chatId: str
    testAudioId: str
    status: str = 'not-started'

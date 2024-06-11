from fastapi import HTTPException
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, DuplicateKeyError

from models.mongo import Audio, Teacher, Student, StudentLesson, Comment, Comments
from routers import mongo_router
from tools.consts import MONGO_DB_NAME, MONGO_URI
from tools.utils import object_id_str

try:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    # Create unique indexes
    db.audio.create_index([("id", ASCENDING)], unique=True)
    db.teacher.create_index([("id", ASCENDING)], unique=True)
    db.teacher.create_index([("email", ASCENDING)], unique=True)
    db.student.create_index([("id", ASCENDING)], unique=True)
    db.student.create_index([("email", ASCENDING)], unique=True)
    db.student_lesson.create_index([("id", ASCENDING)], unique=True)
    db.comments.create_index([("id", ASCENDING)], unique=True)
    db.comment.create_index([("id", ASCENDING)], unique=True)
    print("Connected to MongoDB")
except ConnectionFailure:
    print("Failed to connect to MongoDB")


# Audio routes
@mongo_router.post("/audio/", tags=['Audio'])
async def create_audio(audio: Audio):
    try:
        result = db.audio.insert_one(audio.dict())
        return {"id": str(result.inserted_id)}
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Audio with this ID already exists")


@mongo_router.get("/audio/{audio_id}", tags=['Audio'])
async def get_audio(audio_id: str):
    audio = db.audio.find_one({"id": audio_id})
    if audio:
        return object_id_str(audio)
    raise HTTPException(status_code=404, detail="Audio not found")


@mongo_router.delete("/audio/{audio_id}", tags=['Audio'])
async def delete_audio(audio_id: str):
    result = db.audio.delete_one({"id": audio_id})
    if result.deleted_count == 1:
        return {"message": "Audio deleted successfully"}
    raise HTTPException(status_code=404, detail="Audio not found")


# Teacher routes
@mongo_router.post("/teacher/", tags=['Teacher'])
async def create_teacher(teacher: Teacher):
    try:
        result = db.teacher.insert_one(teacher.dict())
        return {"id": str(result.inserted_id)}
    except DuplicateKeyError as e:
        if 'email' in str(e):
            raise HTTPException(status_code=400, detail="Teacher with this email already exists")
        raise HTTPException(status_code=400, detail="Teacher with this ID already exists")


@mongo_router.get("/teacher/{teacher_id}", tags=['Teacher'])
async def get_teacher(teacher_id: str):
    teacher = db.teacher.find_one({"id": teacher_id})
    if teacher:
        return object_id_str(teacher)
    raise HTTPException(status_code=404, detail="Teacher not found")


@mongo_router.delete("/teacher/{teacher_id}", tags=['Teacher'])
async def delete_teacher(teacher_id: str):
    result = db.teacher.delete_one({"id": teacher_id})
    if result.deleted_count == 1:
        return {"message": "Teacher deleted successfully"}
    raise HTTPException(status_code=404, detail="Teacher not found")


# Student routes
@mongo_router.post("/student/", tags=['Student'])
async def create_student(student: Student):
    try:
        result = db.student.insert_one(student.dict())
        return {"id": str(result.inserted_id)}
    except DuplicateKeyError as e:
        if 'email' in str(e):
            raise HTTPException(status_code=400, detail="Student with this email already exists")
        raise HTTPException(status_code=400, detail="Student with this ID already exists")


@mongo_router.get("/student/{student_id}", tags=['Student'])
async def get_student(student_id: str):
    student = db.student.find_one({"id": student_id})
    if student:
        return object_id_str(student)
    raise HTTPException(status_code=404, detail="Student not found")


@mongo_router.delete("/student/{student_id}", tags=['Student'])
async def delete_student(student_id: str):
    result = db.student.delete_one({"id": student_id})
    if result.deleted_count == 1:
        return {"message": "Student deleted successfully"}
    raise HTTPException(status_code=404, detail="Student not found")


# Student Lessons routes
@mongo_router.post("/student_lesson/", tags=['Lessons'])
async def create_student_lesson(student_lesson: StudentLesson):
    result = db.student_lesson.insert_one(student_lesson.dict())
    return {"id": str(result.inserted_id)}


@mongo_router.get("/student_lesson/{student_id}/{teacher_id}", tags=['Lessons'])
async def get_student_lesson(student_id: str, teacher_id: str):
    student_lesson = db.student_lesson.find_one({"studentId": student_id, "teacherId": teacher_id})
    if student_lesson:
        return object_id_str(student_lesson)
    raise HTTPException(status_code=404, detail="Student Lesson not found")


@mongo_router.delete("/student_lesson/{student_id}/{teacher_id}", tags=['Lessons'])
async def delete_student_lesson(student_id: str, teacher_id: str):
    result = db.student_lesson.delete_one({"studentId": student_id, "teacherId": teacher_id})
    if result.deleted_count == 1:
        return {"message": "Student Lesson deleted successfully"}
    raise HTTPException(status_code=404, detail="Student Lesson not found")


# Comments routes
@mongo_router.post("/comments/", tags=['Comments'])
async def create_comments(comments: Comments):
    result = db.comments.insert_one(comments.dict())
    return {"id": str(result.inserted_id)}


@mongo_router.get("/comments/{student_id}/{teacher_id}/{audio_id}", tags=['Comments'])
async def get_comments(student_id: str, teacher_id: str, audio_id: str):
    comments = db.comments.find_one({"studentId": student_id, "teacherId": teacher_id, "audioId": audio_id})
    if comments:
        return object_id_str(comments)
    raise HTTPException(status_code=404, detail="Comments not found")


@mongo_router.delete("/comments/{student_id}/{teacher_id}/{audio_id}", tags=['Comments'])
async def delete_comments(student_id: str, teacher_id: str, audio_id: str):
    result = db.comments.delete_one({"studentId": student_id, "teacherId": teacher_id, "audioId": audio_id})
    if result.deleted_count == 1:
        return {"message": "Comments deleted successfully"}
    raise HTTPException(status_code=404, detail="Comments not found")


# Comment routes
@mongo_router.post("/comment/", tags=['Comments'])
async def create_comment(comment: Comment):
    result = db.comment.insert_one(comment.dict())
    return {"id": str(result.inserted_id)}


@mongo_router.get("/comment/{comment_id}", tags=['Comments'])
async def get_comment(comment_id: str):
    comment = db.comment.find_one({"id": comment_id})
    if comment:
        return object_id_str(comment)
    raise HTTPException(status_code=404, detail="Comment not found")


@mongo_router.delete("/comment/{comment_id}", tags=['Comments'])
async def delete_comment(comment_id: str):
    result = db.comment.delete_one({"id": comment_id})
    if result.deleted_count == 1:
        return {"message": "Comment deleted successfully"}
    raise HTTPException(status_code=404, detail="Comment not found")

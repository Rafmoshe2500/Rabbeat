from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# from routers.chat import chat_router
from routers import lessons, student_lessons, teacher_lesson, lesson_comment, lesson_status, lesson_chatbot
from routers.torah import torah_router
# from routers.mongo import mongo_router

app = FastAPI(title='Rabbeat')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.include_router(mongo_router)
app.include_router(torah_router)
app.include_router(lessons.router, prefix="/api")
app.include_router(student_lessons.router, prefix="/api")
app.include_router(teacher_lesson.router, prefix="/api")
app.include_router(lesson_comment.router, prefix="/api")
app.include_router(lesson_status.router, prefix="/api")
app.include_router(lesson_chatbot.router, prefix="/api")
# app.include_router(chat_router)
uvicorn.run(app, host="0.0.0.0", port=80)
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from routers.chat import chat_router
from routers import lessons, user_lessons, lesson_comment, lesson_chatbot, user, student_tests, study_zone
from routers.torah import torah_router

app = FastAPI(title='Rabbeat')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["rabbeat.cs.colman.ac.il*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(torah_router)
app.include_router(lessons.router, prefix="/api")
app.include_router(user_lessons.router, prefix="/api")
app.include_router(lesson_comment.router, prefix="/api")
app.include_router(lesson_chatbot.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(study_zone.router, prefix="/api")
app.include_router(student_tests.router, prefix="/api")
uvicorn.run(app, host="0.0.0.0", port=3000)

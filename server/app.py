import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.responses import JSONResponse

# from routers import lessons, user_lessons, lesson_comment, lesson_chatbot, user, student_tests, study_zone, profile
# from routers.chat import chat_router
from routers.torah import torah_router
from tools.consts import MB

app = FastAPI(title='Rabbeat')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])


@app.middleware("http")
async def increase_request_body_size(request: Request, call_next):
    BODY_SIZE_LIMIT = 100 * MB  # 100 MB
    if request.method == 'POST':
        request._body_size_limit = BODY_SIZE_LIMIT
    response = await call_next(request)
    return response


app.include_router(torah_router)
# app.include_router(lessons.router, prefix="/api")
# app.include_router(user_lessons.router, prefix="/api")
# app.include_router(lesson_comment.router, prefix="/api")
# app.include_router(lesson_chatbot.router, prefix="/api")
# app.include_router(user.router, prefix="/api")
# app.include_router(chat_router, prefix="/api")
# app.include_router(study_zone.router, prefix="/api")
# app.include_router(student_tests.router, prefix="/api")
# app.include_router(profile.router, prefix="/api")


@app.exception_handler(Exception)
async def validation_exception_handler(_, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": 'Oops. something went wrong. try again later.'}
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)

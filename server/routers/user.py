from typing import List

from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError
from starlette import status

from database.mongo import mongo_db
from exceptions.exceptions import NotFound, OperationFailed
from models.response import ResponseTeacherProfile
from models.user import UserRegister, UserCredentials, User
from tools.utils import create_jwt_token
from workflows.login import LoginWorkflow
from workflows.register import RegisterWorkflow

router = APIRouter(tags=["User"])


@router.post("/register", response_model=str, status_code=201, include_in_schema=False)
async def register(user: UserRegister):
    try:
        result = RegisterWorkflow(user).run()
        if not result:
            raise OperationFailed(detail="Failed to create user")
        token = create_jwt_token(user.dict())
        return token
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Mail or Id in use.")


@router.post("/login", response_model=str, include_in_schema=False)
async def login(user_cred: UserCredentials):
    result = LoginWorkflow(user_cred).run()
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    del result['_id']
    token = create_jwt_token(result)
    return token


@router.get("/user/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = mongo_db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/users", response_model=List[User])
async def get_all_users():
    return mongo_db.get_all_users()


@router.get("/teachers", response_model=List[ResponseTeacherProfile])
def get_teacher_with_profile_details():
    return mongo_db.get_all_teacher_with_profiles()


@router.get("/students/search")
async def search_student_by_email(email: str):
    student = mongo_db.get_user_by_email(email)
    if not student and student['type'] != 'student':
        raise NotFound(detail="Student not found")
    return {'id': student['id'], 'name': f'{student["firstName"]} {student["lastName"]}'}

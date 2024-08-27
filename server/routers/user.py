from typing import List

from fastapi import APIRouter, HTTPException, Query
from pymongo.errors import DuplicateKeyError
from starlette import status

from database.mongo import mongo_db
from exceptions.exceptions import BackendNotFound, OperationFailed
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
    return mongo_db.get_user_by_id(user_id)


@router.get("/users", response_model=List[User])
async def get_all_users():
    return mongo_db.get_all_users()


@router.get("/teachers", response_model=List[ResponseTeacherProfile])
def get_teacher_with_profile_details():
    return mongo_db.get_all_teacher_with_profiles()


@router.get("/students/search")
async def search_students(query: str = Query(..., min_length=1)):
    students = mongo_db.get_all_students(query)
    if not students:
        raise BackendNotFound(detail="Students not found")
    return [
        {
            'id': str(student['_id']),
            'name': f"{student['firstName']} {student['lastName']}",
            'email': student['email']
        }
        for student in students
    ]

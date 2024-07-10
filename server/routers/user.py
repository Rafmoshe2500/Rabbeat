from typing import List

from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError
from starlette import status
from starlette.responses import JSONResponse

from models.mongo import UserRegister, UserCredentials, User, UpdateProfile
from tools.utils import mongo_db, create_jwt_token
from workflows.login import LoginWorkflow
from workflows.register import RegisterWorkflow

router = APIRouter(tags=["User"])


@router.post("/register", response_model=str, include_in_schema=False)
async def register(user: UserRegister):
    try:
        result = RegisterWorkflow(user).run()
        if result:
            token = create_jwt_token(user.dict())
            return JSONResponse(status_code=201, content=token)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Mail or Id in use.")
    raise HTTPException(status_code=500, detail="Failed to create user")


@router.post("/login", response_model=str, include_in_schema=False)
async def login(user_cred: UserCredentials):
    result = LoginWorkflow(user_cred).run()
    if result:
        del result['_id']
        token = create_jwt_token(result)
        return token
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Failed to create user")


@router.get("/user/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = mongo_db.get_user_by_id(user_id)
    if user:
        return user
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.get("/users", response_model=List[User])
async def get_all_users():
    return mongo_db.get_all_users()


@router.get('/profile/{teacher_id}', response_model=dict)
async def get_profile(teacher_id: str):
    teacher: dict = mongo_db.get_user_by_id(teacher_id)
    profile: dict = mongo_db.get_teacher_profile(teacher_id)
    if profile:
        teacher.update(profile)
        return teacher
    HTTPException(status_code=404, detail="User has no have profile or is not a teacher")


@router.post('/profile/{teacher_id}')
async def update_profile(teacher_id, update: UpdateProfile):
    result = mongo_db.update_profile(teacher_id, update)
    if result:
        return JSONResponse(status_code=200, content={'message': 'Success to update profile'})
    HTTPException(status_code=500, detail='Failed to update profile')

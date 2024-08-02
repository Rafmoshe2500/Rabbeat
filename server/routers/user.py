from typing import List

from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError
from starlette import status

from database.mongo import mongo_db
from models.profile import UpdateProfile, CreateSample
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
            raise HTTPException(status_code=500, detail="Failed to create user")
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


@router.get('/profile/{user_id}')
async def get_profile(user_id: str):
    user: dict = mongo_db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile: dict = mongo_db.get_teacher_profile(user_id)
    if profile:
        user.update(profile)
    del user['_id']
    return user


@router.post('/profile/{teacher_id}')
async def update_profile(teacher_id: str, update: UpdateProfile):
    if update.key in ['address', 'phoneNumber']:
        result = mongo_db.update_user(teacher_id, update)
    else:
        result = mongo_db.update_profile(teacher_id, update)
    if not result:
        raise HTTPException(status_code=500, detail='Failed to update profile')
    return f'Success update profile {update.key}'


@router.get("/teachers", response_model=List[ResponseTeacherProfile])
def get_teacher_with_profile_details():
    return mongo_db.get_all_teacher_with_profiles()


@router.get("/students/search")
async def search_student_by_email(email: str):
    student = mongo_db.get_user_by_email(email)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {'id': student['id'], 'name': f'{student["firstName"]} {student["lastName"]}'}


@router.post("/profile/{teacher_id}/sample", status_code=201)
async def add_new_sample(teacher_id: str, sample: CreateSample):
    result = mongo_db.add_new_sample(sample)
    if result:
        profile = mongo_db.get_teacher_profile(teacher_id)
        profile['sampleIds'].append(str(result.inserted_id))
        result2 = mongo_db.update_profile(teacher_id, UpdateProfile(key='sampleIds', value=profile['sampleIds']))
        if result2:
            return "Success adding new sample"
        mongo_db.remove_sample(str(result.inserted_id))
    raise HTTPException(status_code=500, detail="Failed to add new sample")

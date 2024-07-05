from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError
from starlette import status
from starlette.responses import JSONResponse

from models.mongo import UserRegister, UserCredentials, User
from tools.utils import mongo_db
from workflows.login import LoginWorkflow
from workflows.register import RegisterWorkflow

router = APIRouter(tags=["User"])


@router.post("/register", include_in_schema=False)
async def register(user: UserRegister):
    try:
        result = RegisterWorkflow(user).run()
        if result:
            user = mongo_db.get_user_by_id(str(result.inserted_id))
            user['_id'] = str(user['_id'])
            return JSONResponse(status_code=201, content=user)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Mail or Id in use.")
    raise HTTPException(status_code=500, detail="Failed to create user")


@router.post("/login", include_in_schema=False)
async def login(user_cred: UserCredentials):
    result = LoginWorkflow(user_cred).run()
    if result:
        result['_id'] = str(result['_id'])
        return result
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Failed to create user")


@router.get("/user/{id}")
async def get_user_by_id(id: str):
    user = mongo_db.get_user_by_id(id)
    if user:
        user["_id"] = str(user["_id"])
        return user
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


@router.get("/users")
async def get_all_users():
    users = mongo_db.get_all_users()
    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No users found")
    for user in users:
        user["_id"] = str(user["_id"])
    return users

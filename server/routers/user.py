from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError

from models.mongo import UserRegister
from tools.utils import mongo_db
from workflows.register import RegisterWorkflow

router = APIRouter(tags=["User"])


@router.post("/register/")
async def register(user: UserRegister):
    try:
        result = RegisterWorkflow(user).run()
        if result.inserted_id:
            return {"message": "User successfully created", "id": str(result.inserted_id)}
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Mail or Id in use.")
    raise HTTPException(status_code=500, detail="Failed to create user")


@router.get("/user/{id}")
async def get_user_by_id(id: str):
    user = mongo_db.get_user_by_id(id)
    if user:
        user["_id"] = str(user["_id"])
        return user
    raise HTTPException(status_code=404, detail="User not found")


@router.get("/users/")
async def get_all_users():
    users = mongo_db.get_all_users()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    for user in users:
        user["_id"] = str(user["_id"])
    return users
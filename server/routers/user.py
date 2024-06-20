from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError

from models.mongo import User, UserRegister
from database.mongo import db

router = APIRouter(tags=["User"])


@router.post("/user/")
async def register(user: UserRegister):
    try:
        user_dict = user.dict()
        result = db.users.insert_one(user_dict)
        if result.inserted_id:
            return {"message": "User successfully created", "id": str(result.inserted_id)}
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Mail or Id in use.")
    raise HTTPException(status_code=500, detail="Failed to create user")


@router.get("/user/{id}")
async def get_user_by_id(id: str):
    user = db.users.find_one({"_id": ObjectId(id)})
    if user:
        user["_id"] = str(user["_id"])
        return user
    raise HTTPException(status_code=404, detail="User not found")


@router.get("/users/")
async def get_all_users():
    users = list(db.users.find())
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    for user in users:
        user["_id"] = str(user["_id"])
    return users
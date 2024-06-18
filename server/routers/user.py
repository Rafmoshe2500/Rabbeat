from fastapi import APIRouter, HTTPException
from models.mongo import User
from database.mongo import db

router = APIRouter(tags=["User"])


@router.post("/user/")
async def create_user(user: User):
    user_dict = user.dict()
    result = await db.users.insert_one(user_dict)
    if result.inserted_id:
        return {"message": "Client successfully created", "id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Failed to create user")


@router.get("/user/{id}")
async def get_user_by_id(id: str):
    user = await db.users.find_one({"_id": id})
    if user:
        user["_id"] = str(user["_id"])
        return user
    raise HTTPException(status_code=404, detail="Client not found")


@router.get("/users/")
async def get_all_users():
    users = await db.users.find().to_list(length=None)
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    for user in users:
        user["_id"] = str(user["_id"])
    return users
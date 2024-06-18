from fastapi import APIRouter, HTTPException
from models.mongo import Client
from database.mongo import db

router = APIRouter(tags=["Client"])


@router.post("/clients/")
async def create_client(client: Client):
    client_dict = client.dict()
    result = await db.clients.insert_one(client_dict)
    if result.inserted_id:
        return {"message": "Client successfully created", "id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Failed to create client")


@router.get("/clients/{id}")
async def get_client_by_id(id: str):
    client = await db.clients.find_one({"_id": id})
    if client:
        client["_id"] = str(client["_id"])
        return client
    raise HTTPException(status_code=404, detail="Client not found")

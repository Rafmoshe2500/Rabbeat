from fastapi import APIRouter

# mongo_router = APIRouter(prefix='/mongo')
torah_router = APIRouter(prefix='/api/torah', tags=["Torah"])
chat_router = APIRouter(prefix='/chat')

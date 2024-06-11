from fastapi import APIRouter

mongo_router = APIRouter(prefix='/mongo')
torah_router = APIRouter(prefix='/torah')
chat_router = APIRouter(prefix='/chat')
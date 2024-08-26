from fastapi import Request

from chatbot.bot import get_answer
from exceptions.exceptions import OperationFailed
from models.chat import ChatModule
from routers import chat_router
from tools.utils import decode_token


@chat_router.post('/', include_in_schema=True)
def get_prompt(chat: ChatModule, request: Request):
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header is None or not auth_header.startswith('Bearer '):
            raise

        token = auth_header[len("Bearer "):]
        d_token = decode_token(token)
        if d_token['type'] != 'student':
            raise

        response = get_answer(chat.message, chat.conversation_topic)
        return {'message': response.text}

    except Exception as e:
        raise OperationFailed(detail="Oops... something went wrong") from e

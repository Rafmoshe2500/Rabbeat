from chatbot.bot import get_answer
from models.chat import ChatModule
from routers import chat_router


@chat_router.post('/', include_in_schema=False)
def get_prompt(chat: ChatModule):
    response = get_answer(chat.message, chat.conversation_topic)
    return {'message': response.text}

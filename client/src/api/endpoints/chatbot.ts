import { getToken } from '../../utils/jwt-cookies';
import apiClient from '../config';

export const sendMessageToChatbot = async (
  message: ChatBotMessage
): Promise<ChatBotMessage> => {
  try {
    const token = getToken();
    const response = await apiClient.post<ChatBotMessage>('/chat/', message, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

  
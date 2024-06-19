import apiClient from '../config';

export const sendMessageToChatbot = async (message: ChatBotMessage): Promise<ChatBotMessage> => {
    try {
      const response = await apiClient.post<ChatBotMessage>('/chatbot', message);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
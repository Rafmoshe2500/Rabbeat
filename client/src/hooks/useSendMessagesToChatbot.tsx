// useSendMessagesToChatbot.tsx
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { sendMessageToChatbot } from "../api/endpoints/chatbot";

export const useSendMessageToChatbot = (): UseMutationResult<ChatBotMessage, Error, ChatBotMessage, unknown> => {
  return useMutation({
    mutationFn: (message: ChatBotMessage) => sendMessageToChatbot(message),
  });
};
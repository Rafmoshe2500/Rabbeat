import { useQuery } from "@tanstack/react-query";
import { sendMessageToChatbot } from "../api/endpoints/chatbot";

const createQueryKey = (keys: string[]) => [...keys] as const;

export const useSendMessageToChatbot = (message: ChatBotMessage) => {
  const queryKey = createQueryKey([message.message, message.conversation_topic]);

  return useQuery<ChatBotMessage[], Error>({
    queryKey,
    queryFn: async () => {
      const response = await sendMessageToChatbot(message);
      return [response];
    },
    enabled: !!message.message && !!message.conversation_topic
  });
};

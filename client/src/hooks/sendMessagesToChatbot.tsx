import { useQuery } from "@tanstack/react-query";
import { sendMessageToChatbot } from "../api/endpoints/chatbot";

const createQueryKey = (keys: string[]) => [...keys] as const;


export const useSendMessageToChatbot = () => {
  const queryKey = createQueryKey(["SendMessageToChatbot"]);

  return useQuery<ChatBotMessage[], Error>({
    queryKey,
    queryFn: sendMessageToChatbot,
  });
};

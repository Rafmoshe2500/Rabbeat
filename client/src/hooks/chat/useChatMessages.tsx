import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMessages, postMessage } from "../../api/endpoints/chat";

export const useChat = (chatId: string) => {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ["chat", chatId],
    queryFn: (context) => fetchMessages(context.queryKey[1]),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: Message) => postMessage(chatId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });

  return {
    messagesQuery,
    sendMessageMutation,
  };
};

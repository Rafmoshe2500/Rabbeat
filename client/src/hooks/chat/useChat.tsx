import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMessages,
  postMessage,
  clearChatNotifications,
  fetchChatNotifications,
} from "../../api/endpoints/chat";

export const useChat = (chatId: string, userType: User["type"]) => {
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

  const fetchChatNotificationsQuery = useQuery({
    queryKey: ["chatNotifications", chatId, userType],
    queryFn: (context) =>
      fetchChatNotifications(
        context.queryKey[1],
        context.queryKey[2] as User["type"]
      ),
  });

  const clearChatNotificationsMutation = useMutation({
    mutationFn: () => clearChatNotifications(chatId, userType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatNotifications", "students"] });
    },
  });

  return {
    messagesQuery,
    sendMessageMutation,
    clearChatNotificationsMutation,
    fetchChatNotificationsQuery,
  };
};

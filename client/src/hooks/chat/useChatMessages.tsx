import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMessages,
  //   postAudioMessage,
  postMessage,
} from "../../api/endpoints/chat";

export const useChat = (userId: string, lessonId: string) => {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ["messages", userId, lessonId],
    queryFn: (context) =>
      fetchMessages(context.queryKey[1], context.queryKey[2]),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: Message) => postMessage(message, userId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  //   const sendAudioMessageMutation = useMutation({
  //     mutationFn: postAudioMessage,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["messages"] });
  //     },
  //   });

  return {
    messagesQuery,
    sendMessageMutation,
    // sendAudioMessageMutation,
  };
};

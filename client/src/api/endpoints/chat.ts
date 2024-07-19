import {
  convertBlobToBase64,
  convertBase64ToBlob,
} from "../../utils/audio-parser";
import apiClient from "../config";

export const fetchMessages = async (chatId: string) => {
  const { data } = await apiClient.get<Array<Message>>(
    `/lesson/chat/${chatId}`
  );

  const messages = data.map((message) => {
    return message.type === "audio"
      ? { ...message, content: convertBase64ToBlob(message.content as string) }
      : message;
  });
  return messages;
};

export const postMessage = async (chatId: string, message: Message) => {
  const convertedMessage =
    message.type === "audio"
      ? {
          ...message,
          content: await convertBlobToBase64(message.content as Blob),
        }
      : message;
  const { data } = await apiClient.post(
    `/lesson/chat/${chatId}/message`,
    convertedMessage
  );
  return data;
};

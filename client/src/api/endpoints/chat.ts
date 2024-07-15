import {
  convertBlobToBase64,
  convertBase64ToBlob,
} from "../../utils/audio-parser";
import apiClient from "../config";

export const fetchMessages = async (studentId: string, lessonId: string) => {
  const { data } = await apiClient.get(
    `/lesson/${lessonId}/student/${studentId}/test-chat/messages`
  );

  const rawMessages: Array<Message> = data.messages;

  const messages = rawMessages.map((message) => {
    return message.type === "audio"
      ? { ...message, content: convertBase64ToBlob(message.content as string) }
      : message;
  });
  return messages;
};

export const postMessage = async (
  message: Message,
  studentId: string,
  lessonId: string
) => {
  const convertedMessage =
    message.type === "audio"
      ? { ...message, content: convertBlobToBase64(message.content as Blob) }
      : message;
  const { data } = await apiClient.post(
    `/lesson/${lessonId}/student/${studentId}/test-chat/messages`,
    { convertedMessage }
  );
  return data;
};

// export const postAudioMessage = async (audio: Blob) => {
//   const formData = new FormData();
//   formData.append("audio", audio);
//   const { data } = await apiClient.post("/api/audio", formData);
//   return data;
// };

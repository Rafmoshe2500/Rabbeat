import apiClient from "../config";
import { convertBase64ToBlob } from "../../utils/audio-parser";

export const updateTestAudio = async (
  testAudioId: string,
  testAudio: string
): Promise<string> => {
  try {
    const response = await apiClient.put<string>(`/test-audio/${testAudioId}`, {
      audio: testAudio,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTestAudio = async (testAudioId: string): Promise<Blob> => {
  try {
    const response = await apiClient.get<{ audio: string }>(
      `/test-audio/${testAudioId}`
    );
    const { audio } = response.data;
    const testAudio = convertBase64ToBlob(audio);
    return testAudio;
  } catch (error) {
    throw error;
  }
};

export const markAudioAsRead = async (audioId: string): Promise<void> => {
  const response = await apiClient.put(`/test-audio/${audioId}/read`);
  return response.data;
};

export const compareAudio = async (data: CompareAudio): Promise<CompareAudioResponse> => {
  const response = await apiClient.post<CompareAudioResponse>('/torah/compare-audio/', data);
  return response.data;
};
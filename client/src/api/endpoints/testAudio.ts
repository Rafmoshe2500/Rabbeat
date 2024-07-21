import apiClient from "../config";

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

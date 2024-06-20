import apiClient from "../config";

export const getTorahSection = async (
  pentateuch: string,
  startCh: string,
  startVerse: string,
  endCh: string,
  endVerse: string
): Promise<TorahSection> => {
  try {
    const response = await apiClient.get<TorahSection>(
      `/torah/pentateuch/Bereshit/1/1/2/1`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

import apiClient from "../config";

export const getTorahSection = async (
  pentateuch: string,
  startCh: string,
  startVerse: string,
  endCh: string,
  endVerse: string
): Promise<TorahSections> => {
  try {
    const response = await apiClient.get<TorahSections>(
      `/torah/pentateuch/${pentateuch}/${startCh}/${startVerse}/${endCh}/${endVerse}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTorahParashot = async (
  parasha: string,
  alia: string
): Promise<messageContext> => {
  try {
    const response = await apiClient.get<messageContext>(
      `/torah/alia/${parasha}/${alia}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const compareTexts = async (
  source: string,
  tested: string
): Promise<Words> => {
  try {
    const response = await apiClient.post<Words>(`torah/compare-two-texts`, {
      source,
      sttText: tested,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

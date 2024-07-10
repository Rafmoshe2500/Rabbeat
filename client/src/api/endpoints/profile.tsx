import apiClient from "../config";

export const getProfile = async (id: string): Promise<teacherProfile> => {
    if (!id) throw new Error("Profile ID is required");
    const response = await apiClient.get<teacherProfile>(`/profile/${id}`);
    return response.data;
  };
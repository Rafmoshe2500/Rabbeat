import apiClient from "../config";

export const getUser = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUserOrUpdate = async (user: User): Promise<User> => {
  try {
    const response = await apiClient.post<User>("/users", user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

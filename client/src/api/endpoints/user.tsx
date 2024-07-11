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

export const login = async (credentials: UserCredentials) => {
  const response = await apiClient.post<string>(`/login`, credentials);
    return response.data;
};

export const register = async (userData: UserRegister) => {
  const response = await apiClient.post<string>(`/register`, userData);
  return response.data;
};
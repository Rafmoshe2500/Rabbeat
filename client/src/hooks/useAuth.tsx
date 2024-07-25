import { useMutation } from '@tanstack/react-query';
import * as api from '../api/endpoints/user';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: UserCredentials) => api.login(credentials),
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: UserRegister) => api.register(userData),
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
};
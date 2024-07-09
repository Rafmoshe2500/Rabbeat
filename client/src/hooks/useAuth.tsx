// useAuth.tsx
import { useMutation } from '@tanstack/react-query';
import * as api from '../api/endpoints/user';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: UserCredentials) => api.login(credentials),
    onError: (error) => {
      // You can handle errors here if needed
      console.error('Login error:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: UserRegister) => api.register(userData),
    onError: (error) => {
      // You can handle errors here if needed
      console.error('Registration error:', error);
    },
  });
};
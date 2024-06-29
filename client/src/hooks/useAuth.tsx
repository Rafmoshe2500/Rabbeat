import { useState } from 'react';
import * as api from '../api/endpoints/user';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (credentials: UserCredentials): Promise<LoginUser | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(credentials);
      setLoading(false);
      console.log(response)
      return response;
    } catch (err) {
      console.log(err)
      setLoading(false);
      setError('Login failed. Please check your credentials.');
      return null;
    }
  };

  return { loginUser, loading, error };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (userData: UserRegister): Promise<LoginUser | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.register(userData);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError('Registration failed. Please try again.');
      return null;
    }
  };

  return { registerUser, loading, error };
};
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const login = async (credentials: any) => {
  const { data } = await apiClient.post('/login', credentials);
  return data;
};

export const register = async (userData: any) => {
  const { data } = await apiClient.post('/register', userData);
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post('/logout');
  return data;
};

export const updateProfile = async (userData: any) => {
  const { data } = await apiClient.put('/profile', userData);
  return data;
};

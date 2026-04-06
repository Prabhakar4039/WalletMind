import apiClient from './apiClient';

const API_URL = '/api/auth';

export const login = async (credentials: any) => {
  const { data } = await apiClient.post(`${API_URL}/login`, credentials);
  return data;
};

export const register = async (userData: any) => {
  const { data } = await apiClient.post(`${API_URL}/register`, userData);
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post(`${API_URL}/logout`);
  return data;
};

export const updateProfile = async (userData: any) => {
  const { data } = await apiClient.put(`${API_URL}/profile`, userData);
  return data;
};

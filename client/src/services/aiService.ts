import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAiInsights = async () => {
  const { data } = await apiClient.post('/insights');
  return data;
};

export const getCategorySuggestion = async (description: string) => {
  const { data } = await apiClient.post('/suggest-category', { description });
  return data;
};

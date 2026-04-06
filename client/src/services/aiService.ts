import apiClient from './apiClient';

const API_URL = '/api/ai';

export const getAiInsights = async () => {
  const { data } = await apiClient.post(`${API_URL}/insights`);
  return data;
};

export const getCategorySuggestion = async (description: string) => {
  const { data } = await apiClient.post(`${API_URL}/suggest-category`, { description });
  return data;
};

import apiClient from './apiClient';

const API_URL = '/api/budgets';

export const getBudgets = async () => {
  const { data } = await apiClient.get(API_URL);
  return data;
};

export const upsertBudget = async (budgetData: { category: string; amount: number; period?: string }) => {
  const { data } = await apiClient.post(API_URL, budgetData);
  return data;
};

export const deleteBudget = async (id: string) => {
  const { data } = await apiClient.delete(`${API_URL}/${id}`);
  return data;
};

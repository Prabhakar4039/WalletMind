import axios from 'axios';

const API_URL = 'http://localhost:5000/api/budgets';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getBudgets = async () => {
  const { data } = await apiClient.get('/');
  return data;
};

export const upsertBudget = async (budgetData: { category: string; amount: number; period?: string }) => {
  const { data } = await apiClient.post('/', budgetData);
  return data;
};

export const deleteBudget = async (id: string) => {
  const { data } = await apiClient.delete(`/${id}`);
  return data;
};

import apiClient from './apiClient';

const API_URL = '/api/transactions';

export const getTransactions = async (params: any = {}) => {
  const { data } = await apiClient.get(API_URL, { params });
  return data;
};

export const createTransaction = async (transactionData: any) => {
  const { data } = await apiClient.post(API_URL, transactionData);
  return data;
};

export const updateTransaction = async (id: string, transactionData: any) => {
  const { data } = await apiClient.put(`${API_URL}/${id}`, transactionData);
  return data;
};

export const deleteTransaction = async (id: string) => {
  const { data } = await apiClient.delete(`${API_URL}/${id}`);
  return data;
};

export const getTransactionStats = async () => {
  const { data } = await apiClient.get(`${API_URL}/stats`);
  return data;
};

export const exportTransactions = async () => {
  const { data } = await apiClient.get(`${API_URL}/export`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
};

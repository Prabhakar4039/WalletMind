import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getTransactions = async (params: any = {}) => {
  const { data } = await apiClient.get('/', { params });
  return data;
};

export const createTransaction = async (transactionData: any) => {
  const { data } = await apiClient.post('/', transactionData);
  return data;
};

export const updateTransaction = async (id: string, transactionData: any) => {
  const { data } = await apiClient.put(`/${id}`, transactionData);
  return data;
};

export const deleteTransaction = async (id: string) => {
  const { data } = await apiClient.delete(`/${id}`);
  return data;
};

export const getTransactionStats = async () => {
  const { data } = await apiClient.get('/stats');
  return data;
};

export const exportTransactions = async () => {
  const { data } = await apiClient.get('/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
};

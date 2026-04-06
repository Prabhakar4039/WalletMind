import { create } from 'zustand';
import { 
  getTransactions, 
  createTransaction as apiCreateTransaction, 
  updateTransaction as apiUpdateTransaction, 
  deleteTransaction as apiDeleteTransaction,
  getTransactionStats
} from '../services/transactionService';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface TransactionStore {
  transactions: Transaction[];
  stats: any[];
  loading: boolean;
  error: string | null;
  fetchTransactions: (params?: any) => Promise<void>;
  fetchStats: () => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  updateTransaction: (id: string, data: any) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  stats: [],
  loading: false,
  error: null,

  fetchTransactions: async (params) => {
    set({ loading: true });
    try {
      const data = await getTransactions(params);
      set({ transactions: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const data = await getTransactionStats();
      set({ stats: data });
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  },

  addTransaction: async (data) => {
    set({ loading: true });
    try {
      const newTransaction = await apiCreateTransaction(data);
      set((state) => ({ 
        transactions: [newTransaction, ...state.transactions],
        loading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateTransaction: async (id, data) => {
    set({ loading: true });
    try {
      const updated = await apiUpdateTransaction(id, data);
      set((state) => ({
        transactions: state.transactions.map((t) => (t._id === id ? updated : t)),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      await apiDeleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t._id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  }
}));

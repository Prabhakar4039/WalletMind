import React, { useState } from 'react';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { useTransactionStore } from '../store/transactionStore';
import { getCategorySuggestion } from '../services/aiService';
import { getBudgets } from '../services/budgetService';
import toast from 'react-hot-toast';
import GlassCard from './GlassCard';

interface TransactionFormProps {
  onSuccess: () => void;
  onClose: () => void;
  initialData?: any;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, onClose, initialData }) => {
  const { transactions, addTransaction, updateTransaction } = useTransactionStore();
  
  const [formData, setFormData] = useState({
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || '',
    type: (initialData?.type as 'income' | 'expense') || 'expense',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSuggestCategory = async () => {
    if (!formData.description) return;
    setAiLoading(true);
    try {
      const { category } = await getCategorySuggestion(formData.description);
      setFormData((prev) => ({ ...prev, category }));
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (initialData?._id) {
        await updateTransaction(initialData._id, payload);
        toast.success('Transaction updated!');
      } else {
        await addTransaction(payload);
        
        // Calculate budget breach using updated transactions from store
        if (formData.type === 'expense') {
          const budgets = await getBudgets();
          const catBudget = budgets.find((b: any) => b.category === formData.category);
          
          if (catBudget) {
            const catSpent = transactions
              .filter((t: any) => t.category === formData.category && t.type === 'expense')
              .reduce((acc: number, t: any) => acc + t.amount, 0) + payload.amount;
               
            if (catSpent > catBudget.amount) {
              toast.error(`Warning: You have exceeded your ${formData.category} budget!`, { icon: '🚨' });
            } else if (catSpent > catBudget.amount * 0.8) {
              toast.success(`Transaction saved. Approaching limit for ${formData.category}.`, { icon: '⚠️' });
            } else {
              toast.success('Transaction logged safely.');
            }
          } else {
            toast.success('Transaction logged.');
          }
        } else {
          toast.success('Income logged!');
        }
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
      <GlassCard className="w-full max-w-lg p-8 relative overflow-hidden">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className={`w-12 h-12 ${initialData?._id ? 'bg-primary/20' : 'bg-primary'} rounded-xl flex items-center justify-center`}>
            {initialData?._id ? <Plus className="text-primary rotate-45" size={24} /> : <Plus className="text-white" size={24} />}
          </div>
          <h2 className="text-2xl font-bold">{initialData?._id ? 'Edit Transaction' : 'Add Transaction'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                formData.type === 'expense' ? 'bg-danger text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                formData.type === 'income' ? 'bg-success text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Amount</label>
              <input
                type="number"
                required
                placeholder="0.00"
                className="input-field text-xl font-bold"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Date</label>
              <input
                type="date"
                required
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Description</label>
              <button
                type="button"
                onClick={handleSuggestCategory}
                disabled={aiLoading || !formData.description}
                className="text-[10px] flex items-center gap-1.5 text-primary hover:text-indigo-400 disabled:opacity-30 transition-all uppercase font-bold tracking-tighter"
              >
                {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Smart Suggest Category
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Starbucks Coffee"
              className="input-field"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              onBlur={handleSuggestCategory}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Category</label>
            <select
              className="input-field appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="Food">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Travel">Travel & Transport</option>
              <option value="Rent">Rent & Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health & Fitness</option>
              <option value="Salary">Salary/Income</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 glass-button">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : initialData?._id ? 'Update Entry' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default TransactionForm;

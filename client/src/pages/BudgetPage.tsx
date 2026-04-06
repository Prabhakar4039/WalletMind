import React, { useEffect, useState } from 'react';
import { getBudgets, upsertBudget, deleteBudget } from '../services/budgetService';
import { useTransactionStore } from '../store/transactionStore';
import GlassCard from '../components/GlassCard';
import { 
  Target, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Travel', 'Insurance', 'Other'];

const BudgetPage: React.FC = () => {
  const { transactions, fetchTransactions } = useTransactionStore();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const budgetData = await getBudgets();
      setBudgets(budgetData);
      await fetchTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertBudget({ category, amount: Number(amount) });
      setAmount('');
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const getSpentForCategory = (catName: string) => {
    return transactions
      .filter(t => t.category === catName && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  if (loading) return <div className="p-10 font-bold opacity-50">Loading Budget Center...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
              <Target className="text-primary" size={24} />
            </div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Financial Guardrails
            </h1>
          </div>
          <p className="text-gray-400 mt-2 font-medium italic">Define your limits. Master your discipline.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="glass-button h-12 flex items-center justify-center gap-2 group"
        >
          <Plus size={20} className={showForm ? 'rotate-45 transition-transform' : 'transition-transform'} />
          {showForm ? 'Cancel' : 'Set New Limit'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-8 bg-primary/5 border-primary/20">
              <form onSubmit={handleSaveBudget} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                  <select 
                    className="input-field h-12"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Monthly Limit ($)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 500" 
                    className="input-field h-12"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="glass-button h-12 bg-primary/20 border-primary/40 hover:bg-primary/30">
                  Enable Guardrail
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {budgets.map((budget) => {
          const spent = getSpentForCategory(budget.category);
          const percent = Math.min((spent / budget.amount) * 100, 100);
          const isOver = spent > budget.amount;

          return (
            <motion.div 
              key={budget._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group"
            >
              <GlassCard className={`p-6 relative overflow-hidden transition-all hover:translate-y-[-4px] ${isOver ? 'border-danger/40 bg-danger/5' : 'hover:border-primary/40'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-white">{budget.category}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Monthly Guardrail</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(budget._id)}
                    className="p-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-white">${spent.toLocaleString()}</span>
                    <span className="text-xs font-bold text-gray-500">of ${budget.amount.toLocaleString()}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isOver ? 'bg-danger shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-primary to-purple-500'}`}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {isOver ? (
                      <div className="flex items-center gap-2 text-danger font-bold text-[10px] uppercase tracking-wider">
                        <AlertCircle size={14} /> Critical Breach
                      </div>
                    ) : percent > 80 ? (
                      <div className="flex items-center gap-2 text-warning font-bold text-[10px] uppercase tracking-wider">
                        <TrendingDown size={14} /> Approaching Limit
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-success font-bold text-[10px] uppercase tracking-wider">
                        <CheckCircle2 size={14} /> Under Control
                      </div>
                    )}
                    <span className={`text-xs font-bold ${isOver ? 'text-danger' : 'text-primary'}`}>
                      {Math.round(percent)}%
                    </span>
                  </div>
                </div>

                {/* Decorative Icon in background */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform">
                  <Target size={120} />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}

        {budgets.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30 italic">
            <Target size={64} className="mx-auto mb-4" />
            <p className="text-xl">No guardrails set. You're flying blind.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, ArrowRight } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-white/5 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4 opacity-50">
        <ArrowRight size={48} className="rotate-45" />
        <p className="font-bold uppercase tracking-widest text-xs">Awaiting first entry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t, index) => (
        <motion.div
          key={t._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <CategoryIcon category={t.category} />
            <div>
              <h4 className="font-bold text-gray-100">{t.description}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] uppercase font-black tracking-tighter text-gray-500">{t.category}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[10px] font-bold text-gray-500">
                  {new Date(t.date).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className={`text-lg font-black tracking-tight ${
                t.type === 'income' ? 'text-success' : 'text-gray-100'
              }`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(t); }}
                className="p-2 text-gray-500 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(t._id); }}
                className="p-2 text-gray-500 hover:text-danger transition-colors hover:bg-danger/10 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;

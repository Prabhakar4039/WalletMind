import React, { useEffect, useState, useMemo } from 'react';
import { exportTransactions } from '../services/transactionService';
import { useTransactionStore } from '../store/transactionStore';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import FilterModal from '../components/FilterModal';
import EmptyState from '../components/EmptyState';
import { 
  Plus, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Filter as FilterIcon,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const TransactionsPage: React.FC = () => {
  const { 
    transactions, 
    loading, 
    fetchTransactions, 
    deleteTransaction: storeDeleteTransaction 
  } = useTransactionStore();

  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: 'All',
    type: 'All',
    startDate: '',
    endDate: ''
  });

  const loadData = async (filters = activeFilters) => {
    await fetchTransactions(filters);
  };

  useEffect(() => {
    loadData();
  }, [activeFilters]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await storeDeleteTransaction(id);
        toast.success('Entry removed');
      } catch (error) {
        toast.error('Failed to remove entry');
      }
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleExport = async () => {
    try {
      await exportTransactions();
      toast.success('CSV Export Generated');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const filteredTransactions = useMemo(() => transactions.filter((t: any) => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  ), [transactions, searchTerm]);

  const removeFilter = (key: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: key === 'category' || key === 'type' ? 'All' : ''
    }));
  };

  const hasActiveFilters = activeFilters.category !== 'All' || activeFilters.type !== 'All' || activeFilters.startDate || activeFilters.endDate;

  return (
    <div className="p-8 pb-32 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tighter">
            Financial Registry
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">Comprehensive audit of your transaction history.</p>
        </motion.div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text" 
              placeholder="Search by description..." 
              className="input-field pl-14 h-14"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="glass-button h-14 px-8 flex items-center justify-center gap-3 whitespace-nowrap min-w-[180px]"
          >
            <Plus size={20} />
            Log Entry
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <GlassCard className="p-4 flex items-center justify-between gap-4 border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilter(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              hasActiveFilters ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
            }`}
          >
            <FilterIcon size={16} />
            {hasActiveFilters ? 'Config Active' : 'Filter Horizon'}
          </button>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          
          <div className="flex items-center gap-2">
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-primary"><ListIcon size={18} /></button>
            <button className="p-3 bg-transparent rounded-xl text-gray-500 hover:bg-white/5 transition-colors"><LayoutGrid size={18} /></button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[10px] text-gray-700 font-black uppercase tracking-widest mr-2">{filteredTransactions.length} ENTRIES FOUND</span>
          
          <div className="flex items-center gap-2">
            <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-600 opacity-40 cursor-not-allowed"><ChevronLeft size={18} /></button>
            <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-600 opacity-40 cursor-not-allowed"><ChevronRight size={18} /></button>
          </div>
          
          <button 
            onClick={handleExport}
            className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 hover:bg-indigo-500/20 transition-all hover:scale-105 active:scale-95"
            title="Export CSV"
          >
            <Download size={18} />
          </button>
        </div>
      </GlassCard>

      {/* Active Filter Pills */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 px-2"
          >
            {activeFilters.category !== 'All' && (
              <span className="pill flex items-center gap-2 bg-primary/10 border-primary/20 text-primary">
                Category: {activeFilters.category}
                <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeFilter('category')} />
              </span>
            )}
            {activeFilters.type !== 'All' && (
              <span className="pill flex items-center gap-2 bg-success/10 border-success/20 text-success">
                Type: {activeFilters.type}
                <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeFilter('type')} />
              </span>
            )}
            {activeFilters.startDate && (
              <span className="pill flex items-center gap-2 bg-orange-500/10 border-orange-500/20 text-orange-500">
                From: {activeFilters.startDate}
                <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeFilter('startDate')} />
              </span>
            )}
            {activeFilters.endDate && (
              <span className="pill flex items-center gap-2 bg-orange-500/10 border-orange-500/20 text-orange-500">
                To: {activeFilters.endDate}
                <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeFilter('endDate')} />
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* List Container */}
      <GlassCard className="p-8 min-h-[400px]">
        {filteredTransactions.length === 0 && !loading ? (
          <EmptyState 
            onAdd={() => setShowForm(true)} 
            title={hasActiveFilters ? "No matches found" : "Registry Empty"} 
            message={hasActiveFilters ? "Try adjusting your filters or date horizon to find specific entries." : "Your transaction history is awaiting its first entry."} 
          />
        ) : (
          <TransactionList 
            transactions={filteredTransactions} 
            loading={loading} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </GlassCard>

      <FilterModal 
        isOpen={showFilter} 
        onClose={() => setShowFilter(false)} 
        onApply={setActiveFilters} 
        initialFilters={activeFilters}
      />

      <AnimatePresence>
        {showForm && (
          <TransactionForm 
            onSuccess={() => loadData()} 
            onClose={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }} 
            initialData={editingTransaction}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsPage;

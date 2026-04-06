import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Calendar, Tag, Layers, RefreshCcw } from 'lucide-react';
import GlassCard from './GlassCard';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: any;
}

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Rent', 'Entertainment', 'Health', 'Salary', 'Others'];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [tempFilters, setTempFilters] = useState(initialFilters);

  const handleReset = () => {
    setTempFilters({
      category: 'All',
      type: 'All',
      startDate: '',
      endDate: ''
    });
  };

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg relative z-10"
          >
            <GlassCard className="p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Filter size={120} />
              </div>

              <div className="flex justify-between items-center mb-8 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Filter size={20} />
                  </div>
                  <h2 className="text-2xl font-black">Refine Results</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-8 relative">
                {/* Category Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                    <Tag size={12} />
                    Category
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setTempFilters({ ...tempFilters, category: cat })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          tempFilters.category === cat
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                    <Layers size={12} />
                    Entry Type
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['All', 'income', 'expense'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTempFilters({ ...tempFilters, type: t })}
                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                          tempFilters.type === t
                            ? 'bg-white/10 border-white/20 text-white scale-[1.02]'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                    <Calendar size={12} />
                    Date Horizon
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-600 block px-1">START DATE</label>
                      <input
                        type="date"
                        value={tempFilters.startDate}
                        onChange={(e) => setTempFilters({ ...tempFilters, startDate: e.target.value })}
                        className="input-field text-xs h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-600 block px-1">END DATE</label>
                      <input
                        type="date"
                        value={tempFilters.endDate}
                        onChange={(e) => setTempFilters({ ...tempFilters, endDate: e.target.value })}
                        className="input-field text-xs h-12"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  >
                    <RefreshCcw size={18} />
                    Reset
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-[2] h-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all text-lg"
                  >
                    Apply Config
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;

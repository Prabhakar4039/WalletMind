import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Coffee, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onAdd: () => void;
  title?: string;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAdd, title = "Awaiting first entry...", message = "Your financial pulse starts here. Log a transaction to begin AI analysis." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-32 text-center relative"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full opacity-30" />
      
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center text-primary shadow-2xl backdrop-blur-xl group hover:scale-110 transition-transform">
          <Coffee size={40} className="group-hover:rotate-12 transition-transform" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white border-4 border-background">
          <Sparkles size={14} />
        </div>
      </div>

      <h3 className="text-2xl font-black mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-10 font-medium leading-relaxed italic">
        {message}
      </p>

      <button 
        onClick={onAdd}
        className="glass-button flex items-center gap-2 group px-8"
      >
        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
        Record Opening Balance
      </button>

      <div className="mt-12 flex gap-4 text-[10px] font-black uppercase tracking-widest text-gray-700">
        <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">Safe Encryption</span>
        <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">AI Powered</span>
        <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">Instant Sync</span>
      </div>
    </motion.div>
  );
};

export default EmptyState;

import React, { useEffect, useState } from 'react';
import { getAiInsights } from '../services/aiService';
import GlassCard from '../components/GlassCard';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  Lightbulb, 
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const Insights: React.FC = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await getAiInsights();
      setInsights(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[70vh] gap-8 animate-in text-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <BrainCircuit className="absolute inset-0 m-auto text-primary animate-pulse" size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-white tracking-tighter">Consulting Core Intelligence</h2>
          <p className="text-gray-500 font-medium italic max-w-sm">Synthesizing your financial history using LLaMA-powered heuristics...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="p-12 text-center opacity-40 py-32 flex flex-col items-center gap-6">
        <AlertTriangle size={64} className="text-gray-600" />
        <h2 className="text-2xl font-black tracking-widest uppercase">Intel Stack Depleted</h2>
        <p className="max-w-xs text-sm font-bold">Your financial data is currently insufficient to generate high-fidelity insights.</p>
        <button onClick={fetchInsights} className="glass-button text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <RefreshCw size={14} /> Retry Query
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-[20px] flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
              <BrainCircuit className="text-primary" size={24} />
            </div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tighter">
              AI Insight Pro
            </h1>
          </div>
          <p className="text-gray-500 font-medium italic mt-1 ml-1">Hyper-personalized financial strategies powered by Groq Intelligence.</p>
        </motion.div>
        
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="glass-button flex items-center gap-3 group px-8"
        >
          <Sparkles className="text-white group-hover:rotate-12 transition-transform" size={18} />
          <span className="font-black uppercase tracking-widest text-xs">Regenerate Analysis</span>
        </button>
      </div>

      {/* Main Analysis Summary */}
      <GlassCard className="p-12 bg-gradient-to-br from-primary/15 via-transparent to-purple-500/10 border-primary/30 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">
            <span className="w-10 h-[2px] bg-primary" />
            Executive Synthesis
          </div>
          <h2 className="text-3xl font-black leading-tight text-white italic max-w-4xl tracking-tight">
            "{insights.summary}"
          </h2>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Overspending Warnings */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black flex items-center gap-3">
              <AlertTriangle className="text-danger" size={24} />
              Critical Breaches
            </h3>
            <span className="pill bg-danger/10 border-danger/20 text-danger">{insights.overspending_warnings?.length} Detected</span>
          </div>
          
          <div className="space-y-4">
            {insights.overspending_warnings?.map((warning: string, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-danger/[0.03] border border-danger/20 rounded-[24px] flex items-center gap-5 group hover:bg-danger/[0.06] transition-all hover:translate-x-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-danger/20 flex items-center justify-center shrink-0 border border-danger/20 text-danger shadow-lg shadow-danger/10">
                  <TrendingUp className="text-danger group-hover:scale-110 transition-transform" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-danger/60 mb-1">Exposure Alert</p>
                  <span className="text-sm font-bold text-gray-100 group-hover:text-white transition-colors">{warning}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actionable Tips */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black flex items-center gap-3">
              <Lightbulb className="text-success" size={24} />
              Growth Strategies
            </h3>
            <span className="pill bg-success/10 border-success/20 text-success">{insights.saving_tips?.length} Optimized</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {insights.saving_tips?.map((tip: string, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex flex-col gap-6 hover:border-success/40 transition-all group hover:bg-white/[0.04] shadow-xl"
              >
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-success/20 rounded-2xl flex items-center justify-center text-success border border-success/20 group-hover:rotate-12 transition-transform shadow-lg shadow-success/10">
                    <Target size={28} />
                  </div>
                  <div className="flex items-center gap-2 text-success group-hover:translate-x-2 transition-transform">
                    <span className="text-[10px] font-black uppercase tracking-widest">Execute Plan</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
                <p className="text-base font-bold leading-relaxed italic text-gray-300 group-hover:text-white transition-colors">
                  {tip}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Categories Breakdown */}
      <GlassCard className="p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/5 blur-[80px]" />
        <h3 className="text-xl font-black mb-10 flex items-center gap-3 relative z-10">
          <Zap className="text-indigo-400" size={24} />
          Exposure Analysis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
          {insights.top_categories?.map((cat: string, i: number) => (
            <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-white/20 transition-all hover:bg-white/[0.08]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[60px]" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] italic">Impact Rank #{i+1}</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">{cat}</span>
              <div className="w-full h-3 bg-black/40 rounded-full mt-4 overflow-hidden p-[2px] border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - i * 25}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Insights;

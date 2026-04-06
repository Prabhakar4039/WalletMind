import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionStore } from '../store/transactionStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { getBudgets } from '../services/budgetService';
import GlassCard from '../components/GlassCard';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  Filter,
  Zap,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    transactions, 
    stats, 
    loading, 
    fetchTransactions, 
    fetchStats, 
    deleteTransaction: storeDeleteTransaction 
  } = useTransactionStore();

  const [budgets, setBudgets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const fetchData = async () => {
    try {
      const budgetData = await getBudgets();
      setBudgets(budgetData);
      await Promise.all([fetchTransactions(), fetchStats()]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBalance = useMemo(() => transactions.reduce((acc, t: any) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0), [transactions]);
  const totalIncome = useMemo(() => transactions.reduce((acc, t: any) => t.type === 'income' ? acc + t.amount : acc, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.reduce((acc, t: any) => t.type === 'expense' ? acc + t.amount : acc, 0), [transactions]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const chartData = useMemo(() => stats.length > 0 
    ? stats.map(s => ({
        name: new Date(s._id).toLocaleDateString(undefined, { weekday: 'short' }),
        income: s.income,
        expense: s.expense
      }))
    : [
        { name: 'Mon', income: 0, expense: 0 },
        { name: 'Tue', income: 0, expense: 0 },
        { name: 'Wed', income: 0, expense: 0 },
        { name: 'Thu', income: 0, expense: 0 },
        { name: 'Fri', income: 0, expense: 0 },
        { name: 'Sat', income: 0, expense: 0 },
        { name: 'Sun', income: 0, expense: 0 },
      ], [stats]);

  const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];

  const categoryData = useMemo(() => transactions
    .filter((t: any) => t.type === 'expense')
    .reduce((acc: any[], t: any) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, []), [transactions]);

  const budgetAlerts = useMemo(() => budgets.filter((b: any) => {
    const spent = transactions
      .filter((t: any) => t.category === b.category && t.type === 'expense')
      .reduce((acc, t: any) => acc + t.amount, 0);
    return spent >= b.amount * 0.8;
  }), [budgets, transactions]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await storeDeleteTransaction(id);
        toast.success('Removed');
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleEdit = (t: any) => {
    setEditingTransaction(t);
    setShowForm(true);
  };

  return (
    <div className="p-8 pb-32 space-y-10 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {greeting}, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Your financial pulse is looking stable today.
          </p>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/transactions')}
            className="glass-button-outline flex items-center gap-2 text-sm"
          >
            <Filter size={18} />
            Config
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="glass-button flex items-center gap-2 text-sm"
          >
            <Plus size={20} />
            Record Entry
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard className="p-10 relative overflow-hidden group bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
            <Wallet size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Total Liquidity</p>
            <h2 className="text-5xl font-black tracking-tighter">${totalBalance.toLocaleString()}</h2>
            <div className="mt-8 flex items-center gap-2 text-success bg-success/10 px-3 py-1.5 rounded-xl w-fit text-[10px] font-black border border-success/20">
              <TrendingUp size={14} />
              <span>+12.4% THIS MONTH</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-10 flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 bg-success/20 rounded-[20px] flex items-center justify-center text-success border border-success/20 group-hover:scale-110 transition-transform">
              <ArrowDownLeft size={28} />
            </div>
            <div className="mt-10">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Total Inflow</p>
              <h3 className="text-3xl font-black mt-2 text-success tracking-tight">${totalIncome.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-gray-600 flex items-center gap-1 uppercase">
            <TrendingUp size={12} className="text-success" /> 8 deposits logged
          </div>
        </GlassCard>

        <GlassCard className="p-10 flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 bg-danger/20 rounded-[20px] flex items-center justify-center text-danger border border-danger/20 group-hover:scale-110 transition-transform">
              <ArrowUpRight size={28} />
            </div>
            <div className="mt-10">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Total Outflow</p>
              <h3 className="text-3xl font-black mt-2 text-danger tracking-tight">${totalExpense.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-gray-600 flex items-center gap-1 uppercase">
            <TrendingDown size={12} className="text-danger" /> 14 purchases logged
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Chart */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <GlassCard className="p-10 h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Zap className="text-primary" size={20} />
                Financial Pulse
              </h3>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                {['Day', 'Week', 'Month'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Week' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 900 }} dy={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 900 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', backdropFilter: 'blur(20px)' }}
                    itemStyle={{ fontWeight: 'black', padding: '4px' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#6366F1" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={4} />
                  <Area type="monotone" dataKey="expense" stroke="#EF4444" fill="transparent" strokeWidth={3} strokeDasharray="6 6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black">Recent Movements</h3>
              <button 
                onClick={() => navigate('/transactions')}
                className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2 group"
              >
                Inspect All
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <TransactionList 
              transactions={transactions.slice(0, 5)} 
              loading={loading} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </GlassCard>
        </div>

        {/* Sidebar Cards */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          {budgetAlerts.length > 0 && (
            <GlassCard className="p-10 border-warning/30 bg-warning/[0.02]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <AlertTriangle className="text-warning" size={20} />
                  Guardrail Breach
                </h3>
              </div>
              <div className="space-y-8">
                {budgetAlerts.map((b: any) => {
                  const spent = transactions
                    .filter((t: any) => t.category === b.category && t.type === 'expense')
                    .reduce((acc, t: any) => acc + t.amount, 0);
                  const isOver = spent > b.amount;
                  return (
                    <div key={b._id} className="space-y-3 group">
                      <div className="flex justify-between items-end">
                        <span className="font-black text-gray-200 text-xs uppercase tracking-widest">{b.category}</span>
                        <span className={`text-[10px] font-black p-1 px-2 rounded-lg bg-black/40 border ${isOver ? 'text-danger border-danger/20' : 'text-warning border-warning/20'}`}>
                          ${spent.toLocaleString()} / ${b.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((spent / b.amount) * 100, 100)}%` }}
                          className={`h-full ${isOver ? 'bg-danger' : 'bg-warning'}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          )}

          <GlassCard className="p-10 flex flex-col items-center group">
            <h3 className="text-xl font-black self-start mb-10">Category Mix</h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((_, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    {categoryData.length === 0 && <Cell key="cell-empty" fill="rgba(255,255,255,0.03)" />}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', backdropFilter: 'blur(20px)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Expenses</p>
                <p className="text-xl font-black">${totalExpense.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full mt-10">
              {categoryData.slice(0, 4).map((c: any, i: number) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-10 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:border-primary/40 relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Zap className="text-primary shrink-0" size={24} />
              <h3 className="text-lg font-black italic">AI Strategy</h3>
            </div>
            <p className="text-sm text-gray-400 font-medium leading-relaxed italic relative z-10">
              "Your <b>Food</b> expenditure is up 14% vs last week. Consider a $50 daily cap to save roughly $120 by next Friday."
            </p>
            <button 
              onClick={() => navigate('/insights')}
              className="mt-8 text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-2 group relative z-10"
            >
              Consult Full Intelligence
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <TransactionForm 
            onSuccess={fetchData} 
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

export default Dashboard;

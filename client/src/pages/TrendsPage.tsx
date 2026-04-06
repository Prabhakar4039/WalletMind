import React, { useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { useTransactionStore } from '../store/transactionStore';
import { TrendingUp, BarChart3, PieChart, Activity, Download } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const TrendsPage: React.FC = () => {
  const { stats, fetchStats } = useTransactionStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const data = stats.length > 0 
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
      ];

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Monthly Trends
          </h1>
          <p className="text-gray-400 mt-1 font-medium">Deep analysis of your spending velocity.</p>
        </div>
        <button className="glass-button h-12 flex items-center gap-2">
          <Download size={18} />
          Full Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Activity size={14} /> Spending Velocity
          </div>
          <div className="text-3xl font-black text-white">+12.4%</div>
          <p className="text-xs text-gray-500">Increase in expenses vs last month</p>
        </GlassCard>
        
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-success font-bold text-xs uppercase tracking-widest">
            <BarChart3 size={14} /> Savings Ratio
          </div>
          <div className="text-3xl font-black text-white">41.2%</div>
          <p className="text-xs text-gray-500">Percentage of income saved</p>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-widest">
            <PieChart size={14} /> Burn Rate
          </div>
          <div className="text-3xl font-black text-white">$142/day</div>
          <p className="text-xs text-gray-500">Average daily expense this month</p>
        </GlassCard>
      </div>

      <GlassCard className="p-8">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
          <TrendingUp className="text-primary" size={24} />
          Income vs Expenses (7-Day Rolling)
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#666', fontWeight: 'bold' }}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: '#666', fontWeight: 'bold' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1f2e', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  padding: '12px'
                }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

export default TrendsPage;

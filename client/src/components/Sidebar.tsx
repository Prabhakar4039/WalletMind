import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Settings, 
  LogOut,
  BrainCircuit,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Registry', icon: <ArrowLeftRight size={20} />, path: '/transactions' },
    { name: 'Insight Pro', icon: <BrainCircuit size={20} />, path: '/insights' },
    { name: 'Guardrails', icon: <Activity size={20} />, path: '/budget' },
    { name: 'Velocity', icon: <TrendingUp size={20} />, path: '/trends' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 border-r border-white/5 bg-[#0b0f1a]/80 backdrop-blur-2xl p-8 flex flex-col gap-12 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4 px-2 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-12 h-12 bg-primary rounded-[18px] flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:rotate-12 transition-all duration-500">
          <BrainCircuit className="text-white" size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">Wallet</span>
          <span className="text-xl font-black tracking-tighter text-primary border-t-2 border-primary mt-1 leading-none">Mind</span>
        </div>
      </div>

      {/* User Status */}
      <div className="mx-2 p-5 rounded-[24px] bg-white/[0.03] border border-white/5 flex items-center gap-4 hover:bg-white/[0.06] transition-all cursor-pointer group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-primary flex items-center justify-center font-black text-lg shadow-xl shadow-indigo-500/10 group-hover:scale-105 transition-transform">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-black text-gray-100 truncate">{user?.name}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Plan</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-grow">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-4 mb-4">Core Ecosystem</p>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-primary/15 text-primary border border-primary/20 shadow-2xl shadow-primary/10' 
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'group-hover:scale-110 group-hover:text-gray-300'}`}>
                  {item.icon}
                </span>
                <span className={`text-[12px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-white' : ''}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-[-32px] w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                  />
                )}
                <ChevronRight size={14} className={`ml-auto transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-5 px-5 py-4 text-gray-600 hover:text-danger hover:bg-danger/5 rounded-2xl transition-all duration-300 group mt-auto border border-white/0 hover:border-danger/10"
      >
        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
        <span className="text-[12px] font-black uppercase tracking-widest">Sign Out</span>
      </button>
    </div>
  );
};

export default Sidebar;

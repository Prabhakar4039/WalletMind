import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Shield, Bell, CreditCard, User, Save, Loader2, Camera } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { updateProfile } from '../services/authService';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'USD',
    avatar: user?.avatar || '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        currency: formData.currency,
        avatar: formData.avatar
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await updateProfile(updateData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Account Settings
          </h1>
          <p className="text-gray-400 mt-1 font-medium">Customize your financial dashboard and identity.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="pr-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active ID</p>
            <p className="text-sm font-bold truncate w-32">{user?._id.slice(-8)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <User className="text-primary" size={24} />
              Personal Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Avatar URL</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                />
                <button type="button" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <Camera size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Shield className="text-danger" size={24} />
              Security & Privacy
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-8">
          <GlassCard className="p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <CreditCard className="text-success" size={24} />
              Preferences
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Base Currency</label>
              <select 
                className="input-field appearance-none cursor-pointer"
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Date Format</label>
              <select className="input-field appearance-none cursor-pointer">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </GlassCard>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary rounded-2xl flex items-center justify-center gap-3 font-black text-white shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Save size={24} />
                Save Changes
              </>
            )}
          </button>

          <GlassCard className="p-6 border-danger/30 bg-danger/5">
            <div className="flex items-start gap-4">
              <Bell className="text-danger mt-1" size={20} />
              <div>
                <p className="text-sm font-bold text-white">Critical Notifications</p>
                <p className="text-xs text-gray-500 mt-1">You will be alerted if expenses exceed 80% of any monthly budget.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </form>

      <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest px-2">
        <span>WalletMind v1.0.4-stable</span>
        <span>Registered User ID: {user?._id}</span>
      </div>
    </div>
  );
};

export default SettingsPage;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import Insights from './pages/Insights';
import BudgetPage from './pages/BudgetPage';
import TrendsPage from './pages/TrendsPage';
import SettingsPage from './pages/SettingsPage';
import TransactionForm from './components/TransactionForm';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="flex bg-background min-h-screen text-white relative">
      <Sidebar />
      <main className="ml-72 flex-1 relative min-h-screen">
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1a1f2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)'
          }
        }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 z-50 group hover:shadow-primary/60 transition-all border-4 border-white/10"
      >
        <Plus size={32} className="text-white" />
        <span className="absolute right-20 px-4 py-2 bg-primary rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
          Quick Entry
        </span>
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <TransactionForm 
            onSuccess={() => {}} 
            onClose={() => setShowForm(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Layout><TransactionsPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/insights" 
          element={
            <ProtectedRoute>
              <Layout><Insights /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/budget" 
          element={
            <ProtectedRoute>
              <Layout><BudgetPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trends" 
          element={
            <ProtectedRoute>
              <Layout><TrendsPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout><SettingsPage /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

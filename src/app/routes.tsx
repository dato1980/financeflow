import React, { useState } from 'react';
import { createBrowserRouter, Navigate, useLocation, useNavigate } from 'react-router';
import { AppLayout } from './components/AppLayout';
import { RequireAuth } from './components/RequireAuth';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { GoalSimulator } from './pages/GoalSimulator';
import { Budgets } from './pages/Budgets';
import { Analytics } from './pages/Analytics';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Landing } from './pages/Landing';
import { useAuth } from './lib/AuthContext';

function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate((location.state as { from?: string } | null)?.from || '/app');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">F</div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="text-center text-slate-500 mb-8">Use your own account so financial records stay isolated.</p>
        <form className="space-y-4" onSubmit={submit}>
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            {mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full text-center text-slate-600 text-sm mt-8">
          {mode === 'login' ? "Don't have an account? Register" : 'Already registered? Sign in'}
        </button>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  {
    Component: RequireAuth,
    children: [{
      path: '/app',
      Component: AppLayout,
      children: [
        { index: true, Component: Dashboard },
        { path: 'transactions', Component: Transactions },
        { path: 'budgets', Component: Budgets },
        { path: 'analytics', Component: Analytics },
        { path: 'goals', Component: Goals },
        { path: 'goals/simulator', Component: GoalSimulator },
        { path: 'settings', Component: Settings },
        { path: '*', Component: () => <Navigate to="/app" replace /> },
      ],
    }],
  },
  { path: '*', Component: () => <Navigate to="/" replace /> },
]);

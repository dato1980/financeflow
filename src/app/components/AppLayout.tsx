import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Wallet, 
  PieChart, 
  Target, 
  Tags, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { Button, Input } from './ui';
import { useAuth } from '../lib/AuthContext';

const navItems = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/app/budgets', label: 'Budgets', icon: Wallet },
  { path: '/app/analytics', label: 'Analytics', icon: PieChart },
  { path: '/app/goals', label: 'Financial Goals', icon: Target },
];

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 fixed inset-y-0 z-10">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">F</div>
          <span className="text-xl font-bold text-slate-900">FinanceFlow</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavLink
              to="/app/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              Settings
            </NavLink>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
          
          <div className="mt-4 flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* Topbar Desktop & Mobile Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden md:flex items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="md:hidden font-bold text-lg text-slate-900">FinanceFlow</div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
              {new Date().toLocaleString('en', { month: 'long', year: 'numeric' })}
            </div>
            <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Button size="sm" className="hidden sm:flex gap-2" onClick={() => navigate('/app/transactions')}>
              <Plus className="w-4 h-4" /> Add
            </Button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden sm:hidden">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-10 bg-black/20" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute top-16 left-0 bottom-0 w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
              <nav className="p-4 space-y-1 h-full overflow-y-auto pb-20">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                        isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 z-20 pb-safe">
        {[
          { path: '/app', icon: LayoutDashboard, label: 'Home', exact: true },
          { path: '/app/transactions', icon: ArrowLeftRight, label: 'Transact' },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full gap-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
        
        <div className="relative -top-5">
          <button className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {[
          { path: '/app/goals', icon: Target, label: 'Goals' },
          { path: '/app/analytics', icon: PieChart, label: 'Stats' },
        ].map((item) => (
           <NavLink
           key={item.path}
           to={item.path}
           className={({ isActive }) =>
             `flex flex-col items-center justify-center w-16 h-full gap-1 text-[10px] font-medium transition-colors ${
               isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
             }`
           }
         >
           <item.icon className="w-5 h-5" />
           {item.label}
         </NavLink>
        ))}
      </div>
    </div>
  );
}

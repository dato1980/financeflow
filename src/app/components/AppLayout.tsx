import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PieChart,
  Target,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  AlertTriangle,
  CheckCircle2,
  Target as TargetIcon,
  ReceiptText,
  Loader2
} from 'lucide-react';
import { Button } from './ui';
import { useAuth } from '../lib/AuthContext';
import { api, Budget, formatGel, Goal, Transaction } from '../lib/api';

const navItems = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/app/budgets', label: 'Budgets', icon: Wallet },
  { path: '/app/analytics', label: 'Analytics', icon: PieChart },
  { path: '/app/goals', label: 'Financial Goals', icon: Target },
];

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  href: string;
  kind: 'danger' | 'warning' | 'success' | 'info';
  icon: React.ElementType;
};

type NotificationDashboard = {
  summary: { income: number; expenses: number };
  budgets: Budget[];
  goals: Goal[];
  recentTransactions: Transaction[];
};

const getNotificationStorageKey = (userId?: string) => `financeflow-read-notifications-${userId || 'guest'}`;

const buildNotifications = (data: NotificationDashboard | null): NotificationItem[] => {
  if (!data) return [];

  const budgetAlerts = data.budgets
    .filter((budget) => (budget.percentage || 0) >= 80)
    .map((budget) => {
      const percentage = budget.percentage || 0;
      const overBudget = percentage >= 100;
      return {
        id: `budget-${budget._id}-${Math.round(percentage)}`,
        title: overBudget ? `${budget.category} budget exceeded` : `${budget.category} budget near limit`,
        message: `${formatGel(budget.spent || 0)} spent of ${formatGel(budget.limit)}.`,
        href: '/app/budgets',
        kind: overBudget ? 'danger' : 'warning',
        icon: AlertTriangle,
      } satisfies NotificationItem;
    });

  const goalAlerts = data.goals
    .filter((goal) => goal.status === 'At Risk')
    .map((goal) => ({
      id: `goal-${goal._id}-${Math.round(goal.requiredMonthly || 0)}`,
      title: `${goal.name} is at risk`,
      message: `Required monthly saving is ${formatGel(goal.requiredMonthly || 0)}.`,
      href: '/app/goals',
      kind: 'warning',
      icon: TargetIcon,
    } satisfies NotificationItem));

  const availableMonthly = data.summary.income - data.summary.expenses;
  const cashFlowAlert: NotificationItem | null = availableMonthly <= 0
    ? {
        id: `cash-flow-${Math.round(availableMonthly)}`,
        title: 'Monthly cash flow needs attention',
        message: `Expenses are ${availableMonthly < 0 ? formatGel(Math.abs(availableMonthly)) + ' above income' : 'equal to income'} this month.`,
        href: '/app/analytics',
        kind: availableMonthly < 0 ? 'danger' : 'warning',
        icon: AlertTriangle,
      }
    : null;

  const latestTransaction = data.recentTransactions[0];
  const transactionNotice: NotificationItem | null = latestTransaction
    ? {
        id: `transaction-${latestTransaction._id}`,
        title: 'Latest transaction recorded',
        message: `${latestTransaction.name} ${latestTransaction.type === 'Income' ? 'added' : 'spent'} ${formatGel(latestTransaction.amount)}.`,
        href: '/app/transactions',
        kind: 'success',
        icon: ReceiptText,
      }
    : null;

  const allClear: NotificationItem = {
    id: 'all-clear',
    title: 'No urgent alerts',
    message: 'Budgets and goals look steady based on current records.',
    href: '/app',
    kind: 'info',
    icon: CheckCircle2,
  };

  const items = [
    ...budgetAlerts,
    ...goalAlerts,
    ...(cashFlowAlert ? [cashFlowAlert] : []),
    ...(transactionNotice ? [transactionNotice] : []),
  ].slice(0, 6);

  return items.length ? items : [allClear];
};

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [headerSearch, setHeaderSearch] = React.useState('');
  const [notificationsData, setNotificationsData] = React.useState<NotificationDashboard | null>(null);
  const [notificationsLoading, setNotificationsLoading] = React.useState(true);
  const [notificationsError, setNotificationsError] = React.useState('');
  const [readNotificationIds, setReadNotificationIds] = React.useState<string[]>([]);
  const notificationsRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const notificationItems = React.useMemo(() => buildNotifications(notificationsData), [notificationsData]);
  const actionableItems = notificationItems.filter((item) => item.id !== 'all-clear');
  const unreadCount = actionableItems.filter((item) => !readNotificationIds.includes(item.id)).length;

  React.useEffect(() => {
    if (location.pathname !== '/app/transactions') {
      setHeaderSearch('');
      return;
    }

    const params = new URLSearchParams(location.search);
    setHeaderSearch(params.get('search') || '');
  }, [location.pathname, location.search]);

  React.useEffect(() => {
    const storageKey = getNotificationStorageKey(user?.id);
    try {
      setReadNotificationIds(JSON.parse(localStorage.getItem(storageKey) || '[]'));
    } catch {
      setReadNotificationIds([]);
    }
  }, [user?.id]);

  React.useEffect(() => {
    if (!isNotificationsOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNotificationsOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isNotificationsOpen]);

  React.useEffect(() => {
    let active = true;
    setNotificationsLoading(true);
    setNotificationsError('');
    api.get<NotificationDashboard>('/analytics/dashboard')
      .then((response) => {
        if (active) setNotificationsData(response.data);
      })
      .catch(() => {
        if (active) {
          setNotificationsData(null);
          setNotificationsError('Unable to load notifications right now.');
        }
      })
      .finally(() => {
        if (active) setNotificationsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  const saveReadNotificationIds = (ids: string[]) => {
    setReadNotificationIds(ids);
    localStorage.setItem(getNotificationStorageKey(user?.id), JSON.stringify(ids));
  };

  const markNotificationsRead = () => {
    saveReadNotificationIds([...new Set([...readNotificationIds, ...actionableItems.map((item) => item.id)])]);
  };

  const openNotification = (item: NotificationItem) => {
    if (item.id !== 'all-clear') {
      saveReadNotificationIds([...new Set([...readNotificationIds, item.id])]);
    }
    setIsNotificationsOpen(false);
    navigate(item.href);
  };

  const searchTransactions = (value: string) => {
    setHeaderSearch(value);
    const query = value.trim();
    navigate(query ? `/app/transactions?search=${encodeURIComponent(query)}` : '/app/transactions');
  };

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
                  value={headerSearch}
                  onChange={(event) => searchTransactions(event.target.value)}
                  onFocus={() => {
                    if (location.pathname !== '/app/transactions') navigate('/app/transactions');
                  }}
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
            <div ref={notificationsRef} className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((open) => !open)}
                className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={isNotificationsOpen}
                aria-haspopup="dialog"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] leading-4 font-bold rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <div
                  role="dialog"
                  aria-label="Notifications"
                  className="absolute right-0 top-full mt-2 z-[80] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
                      <p className="text-xs text-slate-500">{unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'Everything is read'}</p>
                    </div>
                    {actionableItems.length > 0 && (
                      <button type="button" onClick={markNotificationsRead} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto py-2">
                    {notificationsLoading ? (
                      <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading notifications...
                      </div>
                    ) : notificationsError ? (
                      <div className="flex items-start gap-3 px-4 py-6 text-sm text-slate-500">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                        <span>{notificationsError}</span>
                      </div>
                    ) : (
                      notificationItems.map((item) => {
                        const Icon = item.icon;
                        const isUnread = item.id !== 'all-clear' && !readNotificationIds.includes(item.id);
                        const colorClass = item.kind === 'danger'
                          ? 'bg-red-50 text-red-600'
                          : item.kind === 'warning'
                            ? 'bg-amber-50 text-amber-600'
                            : item.kind === 'success'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-600';
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => openNotification(item)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 focus:outline-none focus:bg-slate-50"
                          >
                            <div className="flex gap-3">
                              <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                                <Icon className="w-4 h-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-start justify-between gap-3">
                                  <span className="text-sm font-medium text-slate-900">{item.title}</span>
                                  {isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-slate-500">{item.message}</span>
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
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

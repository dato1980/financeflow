import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowDownRight, ArrowUpRight, PiggyBank, Target, TrendingUp, Wallet, AlertCircle } from 'lucide-react';
import { Cell, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { api, Budget, formatGel, Goal, Transaction } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

type DashboardData = {
  summary: { balance: number; income: number; expenses: number; savingsRate: number };
  monthly: { name: string; income: number; expense: number }[];
  categories: { name: string; value: number }[];
  budgets: Budget[];
  goals: Goal[];
  recentTransactions: Transaction[];
};

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/analytics/dashboard').then((response) => setData(response.data));
  }, []);

  if (!data) return <div className="text-slate-500">Loading dashboard...</div>;
  const activeGoal = data.goals[0];
  const totalCategorySpend = data.categories.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, {user?.name}. Here is your financial overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Total Balance', formatGel(data.summary.balance), Wallet, 'bg-blue-50 text-blue-600'],
          ['Monthly Income', formatGel(data.summary.income), ArrowUpRight, 'bg-emerald-50 text-emerald-600'],
          ['Monthly Expenses', formatGel(data.summary.expenses), ArrowDownRight, 'bg-rose-50 text-rose-600'],
          ['Savings Rate', `${data.summary.savingsRate.toFixed(1)}%`, PiggyBank, 'bg-purple-50 text-purple-600'],
        ].map(([label, value, Icon, color]: any) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-green-600 font-medium">
                <TrendingUp className="w-4 h-4" /><span>Live</span><span className="text-slate-400 font-normal ml-1">from your records</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Income vs Expenses</CardTitle></CardHeader>
          <CardContent>
            <div style={{ height: 288 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => formatGel(value)} />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} name="Expense" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            {data.categories.length ? (
              <>
                <div className="relative" style={{ height: 192 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.categories} cx="50%" cy="50%" innerRadius={58} outerRadius={80} dataKey="value">
                        {data.categories.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatGel(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-sm text-slate-500">Total</span>
                    <span className="text-lg font-bold text-slate-900">{formatGel(totalCategorySpend)}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {data.categories.slice(0, 4).map((category, idx) => (
                    <div key={category.name} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{category.name}</span>
                      <span className="font-medium" style={{ color: COLORS[idx % COLORS.length] }}>
                        {formatGel(category.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : <p className="text-sm text-slate-500">Add expense transactions to see category analytics.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/app/transactions" className="text-sm font-medium text-indigo-600">View All</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentTransactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between hover:bg-slate-50 p-2 -mx-2 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tx.name}</p>
                    <p className="text-xs text-slate-500">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`text-sm font-semibold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'Income' ? '+' : '-'}{formatGel(tx.amount)}
                  </div>
                </div>
              ))}
              {!data.recentTransactions.length && <p className="text-sm text-slate-500">No transactions yet.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Budget Limits</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {data.budgets.slice(0, 4).map((budget) => (
                <div key={budget._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{budget.category}</span>
                    <span className="text-slate-500">{formatGel(budget.spent || 0)} / {formatGel(budget.limit)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${(budget.percentage || 0) >= 100 ? 'bg-red-500' : (budget.percentage || 0) >= 80 ? 'bg-yellow-400' : 'bg-blue-500'}`} style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }} />
                  </div>
                </div>
              ))}
              {!data.budgets.length && <p className="text-sm text-slate-500">Create category limits on the Budgets page.</p>}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white">Active Goal</CardTitle>
                {activeGoal && <Badge className="bg-white/20 text-white border-none">{activeGoal.status}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              {activeGoal ? (
                <>
                  <h3 className="text-xl font-bold">{activeGoal.name}</h3>
                  <div className="mt-4 flex justify-between text-sm mb-1">
                    <span>{formatGel(activeGoal.currentSaved)} saved</span>
                    <span>Target: {formatGel(activeGoal.targetAmount)}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: `${Math.min((activeGoal.currentSaved / activeGoal.targetAmount) * 100, 100)}%` }} />
                  </div>
                  <div className="mt-4 bg-white/10 rounded-lg p-3 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                    <p className="text-sm text-indigo-50">Required monthly saving: {formatGel(activeGoal.requiredMonthly || 0)}.</p>
                  </div>
                  <Button variant="secondary" className="w-full mt-4 bg-white text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('/app/goals/simulator')}>
                    Open Goal Simulator
                  </Button>
                </>
              ) : (
                <Button variant="secondary" className="w-full bg-white text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('/app/goals')}>
                  Create Financial Goal
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { api, formatGel } from '../lib/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function Analytics() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.get('/analytics/dashboard').then((response) => setData(response.data)); }, []);
  if (!data) return <div className="text-slate-500">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Analytics</h1><p className="text-sm text-slate-500">Three core views required by the project: cash flow, category split, and budget progress.</p></div>
      <Card><CardHeader><CardTitle>Six Month Cash Flow</CardTitle></CardHeader><CardContent><div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%"><BarChart data={data.monthly}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value: number) => formatGel(value)} /><Legend />
          <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} /><Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
        </BarChart></ResponsiveContainer>
      </div></CardContent></Card>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Expense Categories</CardTitle></CardHeader><CardContent><div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.categories} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
            {data.categories.map((item: any, index: number) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}
          </Pie><Tooltip formatter={(value: number) => formatGel(value)} /><Legend /></PieChart></ResponsiveContainer>
        </div></CardContent></Card>
        <Card><CardHeader><CardTitle>Budget Progress</CardTitle></CardHeader><CardContent className="space-y-4">
          {data.budgets.map((budget: any) => <div key={budget._id}>
            <div className="flex justify-between text-sm mb-1"><span>{budget.category}</span><span>{formatGel(budget.spent || 0)} / {formatGel(budget.limit)}</span></div>
            <div className="h-3 bg-slate-100 rounded-full"><div className="h-3 bg-indigo-500 rounded-full" style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }} /></div>
          </div>)}
          {!data.budgets.length && <p className="text-sm text-slate-500">No budgets configured yet.</p>}
        </CardContent></Card>
      </div>
    </div>
  );
}

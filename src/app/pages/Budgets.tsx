import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { api, Budget, formatGel } from '../lib/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../components/ui';
import { transactionCategories } from '../constants';

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [form, setForm] = useState({ category: '', limit: '' });
  const [categoryOpen, setCategoryOpen] = useState(false);
  const load = () => api.get('/analytics/dashboard').then((response) => setBudgets(response.data.budgets));
  useEffect(() => { load(); }, []);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/budgets', { category: form.category, limit: Number(form.limit) });
    setForm({ category: '', limit: '' });
    setCategoryOpen(false);
    load();
  };
  const remove = async (id: string) => { await api.delete(`/budgets/${id}`); load(); };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div><h1 className="text-2xl font-bold text-slate-900">Budgets</h1><p className="text-sm text-slate-500">Set monthly category limits and catch overspending early.</p></div>
      <Card><CardHeader><CardTitle>Add category limit</CardTitle></CardHeader><CardContent>
        <form onSubmit={add} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
          <div
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setCategoryOpen(false);
            }}
          >
            <div className="relative">
              <Input
                required
                autoComplete="off"
                className="pr-10"
                placeholder="Choose or type a category"
                value={form.category}
                onFocus={() => setCategoryOpen(true)}
                onChange={(e) => {
                  setForm({ ...form, category: e.target.value });
                  setCategoryOpen(true);
                }}
              />
              <button
                type="button"
                aria-label="Show category options"
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((current) => !current)}
                className="absolute right-0 top-0 h-10 w-10 grid place-items-center text-slate-500 hover:text-slate-900"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {categoryOpen && (
              <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                {transactionCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, category });
                      setCategoryOpen(false);
                    }}
                    className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-indigo-50 ${
                      form.category === category ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Input required type="number" min="1" placeholder="Monthly limit" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} />
          <Button><Plus className="w-4 h-4 mr-2" />Add</Button>
        </form>
      </CardContent></Card>
      <div className="grid md:grid-cols-2 gap-4">
        {budgets.map((budget) => (
          <Card key={budget._id}><CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div><h3 className="font-semibold">{budget.category}</h3><p className="text-sm text-slate-500 mt-1">{formatGel(budget.spent || 0)} of {formatGel(budget.limit)}</p></div>
              <button onClick={() => remove(budget._id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mt-4"><div className={`h-3 rounded-full ${(budget.percentage || 0) >= 100 ? 'bg-rose-500' : (budget.percentage || 0) >= 80 ? 'bg-amber-400' : 'bg-indigo-500'}`} style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }} /></div>
            <p className={`text-xs mt-2 ${(budget.percentage || 0) >= 80 ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>{(budget.percentage || 0).toFixed(0)}% used{(budget.percentage || 0) >= 80 ? ' • Limit warning' : ''}</p>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

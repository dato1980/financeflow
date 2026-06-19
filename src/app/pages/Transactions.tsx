import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ArrowDownRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Edit2, Plus, Search, Trash2, X } from 'lucide-react';
import { Badge, Button, Card, CardContent, Input } from '../components/ui';
import { transactionCategories } from '../constants';
import { api, formatGel, isoDate, Transaction } from '../lib/api';

const methods = ['Card', 'Cash', 'Bank transfer'];
const PAGE_SIZE = 10;

const emptyForm = {
  name: '', category: '', type: 'Expense' as 'Income' | 'Expense',
  amount: '', date: isoDate(new Date()), method: 'Card',
};

export function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchChoices, setSearchChoices] = useState<string[]>(transactionCategories);
  const [searchOpen, setSearchOpen] = useState(false);
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    const nextParams = new URLSearchParams(searchParams);
    const query = value.trim();
    if (query) nextParams.set('search', query);
    else nextParams.delete('search');
    setSearchParams(nextParams, { replace: true });
  };

  const load = async () => {
    const response = await api.get('/transactions', { params: { search, type, page, limit: PAGE_SIZE } });
    const result = response.data as {
      items: Transaction[];
      total: number;
      page: number;
      pages: number;
    };
    setTransactions(result.items);
    setTotal(result.total);
    setTotalPages(result.pages);
    if (result.page !== page) setPage(result.page);
    setSearchChoices((current) => Array.from(new Set([
      ...current,
      ...result.items.flatMap((transaction) => [transaction.name, transaction.category]),
    ])).sort((a, b) => a.localeCompare(b)));
  };

  useEffect(() => {
    const nextSearch = searchParams.get('search') || '';
    setSearch((current) => current === nextSearch ? current : nextSearch);
    setPage(1);
  }, [searchParams]);

  useEffect(() => { const id = setTimeout(load, 200); return () => clearTimeout(id); }, [search, type, page]);
  const visibleSearchChoices = searchChoices.filter((choice) =>
    choice.toLowerCase().includes(search.toLowerCase()),
  );
  const firstItem = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastItem = Math.min(page * PAGE_SIZE, total);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter((pageNumber) =>
    pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1,
  );

  const showForm = (transaction?: Transaction) => {
    setEditing(transaction || null);
    setForm(transaction ? { ...transaction, amount: String(transaction.amount), date: isoDate(transaction.date) } : emptyForm);
    setCategoryOpen(false);
    setMethodOpen(false);
    setOpen(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editing) await api.put(`/transactions/${editing._id}`, payload);
      else await api.post('/transactions', payload);
      setOpen(false);
      if (!editing && page !== 1) setPage(1);
      else await load();
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    if (transactions.length === 1 && page > 1) setPage((current) => current - 1);
    else await load();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-slate-900">Transactions</h1><p className="text-sm text-slate-500">Manage income and expenses.</p></div>
        <Button onClick={() => showForm()}><Plus className="w-4 h-4 mr-2" />Add Transaction</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50 rounded-t-xl">
            <div
              className="relative flex-1 sm:max-w-sm"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false);
              }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  updateSearch(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search transactions..."
                className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                aria-label="Show search choices"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((current) => !current)}
                className="absolute right-0 top-0 h-full w-10 grid place-items-center text-slate-500 hover:text-slate-900"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${searchOpen ? 'rotate-180' : ''}`} />
              </button>
              {searchOpen && (
                <div className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      updateSearch('');
                      setSearchOpen(false);
                    }}
                    className="block w-full rounded px-3 py-2 text-left text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    All transactions
                  </button>
                  {visibleSearchChoices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => {
                        updateSearch(choice);
                        setSearchOpen(false);
                      }}
                      className="block w-full rounded px-3 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50"
                    >
                      {choice}
                    </button>
                  ))}
                  {!visibleSearchChoices.length && (
                    <p className="px-3 py-2 text-sm text-slate-500">No matching choices.</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex bg-slate-200/50 p-1 rounded-lg">
              {['All', 'Income', 'Expense'].map((item) => (
                <button key={item} onClick={() => { setType(item); setPage(1); }} className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md ${type === item ? 'bg-white shadow-sm' : 'text-slate-600'}`}>{item}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-slate-100 text-sm text-slate-500">
                <th className="py-4 px-6 font-medium">Transaction</th><th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Date</th><th className="py-4 px-6 font-medium">Amount</th><th className="py-4 px-6" />
              </tr></thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-4 px-6"><div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'Income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {tx.type === 'Income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div><p className="font-medium text-slate-900">{tx.name}</p><p className="text-xs text-slate-500">{tx.method}</p></div>
                    </div></td>
                    <td className="py-4 px-6"><Badge variant="outline">{tx.category}</Badge></td>
                    <td className="py-4 px-6 text-sm text-slate-600">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className={`py-4 px-6 font-semibold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.type === 'Income' ? '+' : '-'}{formatGel(tx.amount)}</td>
                    <td className="py-4 px-6"><div className="flex justify-end gap-1">
                      <button onClick={() => showForm(tx)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => remove(tx._id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!transactions.length && <div className="p-12 text-center text-slate-500">No transactions found.</div>}
          </div>
          {total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-4 sm:px-6 py-4">
              <p className="text-sm text-slate-500">
                Showing {firstItem}-{lastItem} of {total} transactions
              </p>
              <div className="flex items-center gap-1" aria-label="Transaction pages">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Previous page"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="px-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {pageNumbers.map((pageNumber, index) => (
                  <React.Fragment key={pageNumber}>
                    {index > 0 && pageNumber - pageNumbers[index - 1] > 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}
                    <Button
                      variant={pageNumber === page ? 'primary' : 'ghost'}
                      size="sm"
                      aria-current={pageNumber === page ? 'page' : undefined}
                      onClick={() => setPage(pageNumber)}
                      className="min-w-8 px-2"
                    >
                      {pageNumber}
                    </Button>
                  </React.Fragment>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Next page"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="px-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 grid place-items-center p-4">
          <form onSubmit={save} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between"><h2 className="text-xl font-bold">{editing ? 'Edit transaction' : 'Add transaction'}</h2><button type="button" onClick={() => setOpen(false)}><X /></button></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm text-slate-700">Name<Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <div
                className="relative text-sm text-slate-700"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setCategoryOpen(false);
                }}
              >
                <label htmlFor="transaction-category">Category</label>
                <div className="relative">
                  <Input
                    id="transaction-category"
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
              <label className="text-sm text-slate-700">Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="w-full h-10 border rounded-md px-3"><option>Expense</option><option>Income</option></select></label>
              <label className="text-sm text-slate-700">Amount<Input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label>
              <label className="text-sm text-slate-700">Date<Input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <div
                className="relative text-sm text-slate-700"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setMethodOpen(false);
                }}
              >
                <label htmlFor="transaction-method">Method</label>
                <div className="relative">
                  <Input
                    id="transaction-method"
                    autoComplete="off"
                    className="pr-10"
                    placeholder="Choose or type a method"
                    value={form.method}
                    onFocus={() => setMethodOpen(true)}
                    onChange={(e) => {
                      setForm({ ...form, method: e.target.value });
                      setMethodOpen(true);
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Show payment method options"
                    aria-expanded={methodOpen}
                    onClick={() => setMethodOpen((current) => !current)}
                    className="absolute right-0 top-0 h-10 w-10 grid place-items-center text-slate-500 hover:text-slate-900"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${methodOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {methodOpen && (
                  <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                    {methods.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, method });
                          setMethodOpen(false);
                        }}
                        className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-indigo-50 ${
                          form.method === method ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button></div>
          </form>
        </div>
      )}
    </div>
  );
}

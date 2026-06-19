import { supabase } from './supabase';

export type Transaction = {
  _id: string;
  name: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
  date: string;
  method: string;
};

export type Budget = { _id: string; category: string; limit: number; spent?: number; percentage?: number };
export type Goal = {
  _id: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
  deadline: string;
  remainingAmount?: number;
  requiredMonthly?: number;
  availableMonthly?: number;
  status?: string;
};

export type GoalPlan = {
  affordable: boolean;
  availableMonthly: number;
  totalRequiredMonthly: number;
  monthlyShortfall: number;
  coveragePercentage: number;
};

type ApiResponse<T = any> = { data: T };

type TransactionRow = {
  id: string;
  name: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number | string;
  date: string;
  method: string | null;
};

type BudgetRow = {
  id: string;
  category: string;
  limit_amount: number | string;
};

type GoalRow = {
  id: string;
  name: string;
  target_amount: number | string;
  current_saved: number | string;
  deadline: string;
};

const MAX_BUDGET_LIMIT = 1000000;
const toNumber = (value: number | string | null | undefined) => Number(value || 0);
const toBudgetLimit = (value: number | string | null | undefined) =>
  Math.max(1, Math.min(MAX_BUDGET_LIMIT, toNumber(value)));

const mapTransaction = (row: TransactionRow): Transaction => ({
  _id: row.id,
  name: row.name,
  category: row.category,
  type: row.type,
  amount: toNumber(row.amount),
  date: row.date,
  method: row.method || 'Card',
});

const mapBudget = (row: BudgetRow): Budget => ({
  _id: row.id,
  category: row.category,
  limit: toNumber(row.limit_amount),
});

const mapGoal = (row: GoalRow): Goal => ({
  _id: row.id,
  name: row.name,
  targetAmount: toNumber(row.target_amount),
  currentSaved: toNumber(row.current_saved),
  deadline: row.deadline,
});

const getCurrentUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('You must be signed in.');
  return data.user.id;
};

const monthBounds = (value = new Date()) => {
  const date = new Date(value);
  return {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 1),
  };
};

const monthsUntil = (deadline: string) => {
  const now = new Date();
  const end = new Date(deadline);
  return Math.max(1, (end.getFullYear() - now.getFullYear()) * 12 + end.getMonth() - now.getMonth());
};

const fetchTransactions = async () => {
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: true });
  if (error) throw error;
  return (data || []).map((row) => mapTransaction(row as TransactionRow));
};

const fetchBudgets = async () => {
  const { data, error } = await supabase.from('budgets').select('*').order('category', { ascending: true });
  if (error) throw error;
  return (data || []).map((row) => mapBudget(row as BudgetRow));
};

const fetchGoals = async () => {
  const { data, error } = await supabase.from('goals').select('*').order('deadline', { ascending: true });
  if (error) throw error;
  return (data || []).map((row) => mapGoal(row as GoalRow));
};

const buildDashboard = async () => {
  const [transactions, budgets, goals] = await Promise.all([fetchTransactions(), fetchBudgets(), fetchGoals()]);
  const { start, end } = monthBounds();
  const monthly = transactions.filter((tx) => {
    const date = new Date(tx.date);
    return date >= start && date < end;
  });
  const income = monthly.filter((tx) => tx.type === 'Income').reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = monthly.filter((tx) => tx.type === 'Expense').reduce((sum, tx) => sum + tx.amount, 0);
  const balance = transactions.reduce((sum, tx) => sum + (tx.type === 'Income' ? tx.amount : -tx.amount), 0);
  const categoryMap = new Map<string, number>();
  monthly
    .filter((tx) => tx.type === 'Expense')
    .forEach((tx) => categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount));

  const availableMonthly = income - expenses;
  const enrichedGoals = goals.map((goal) => {
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentSaved);
    const requiredMonthly = remainingAmount / monthsUntil(goal.deadline);
    return {
      ...goal,
      remainingAmount,
      requiredMonthly,
      availableMonthly,
      status: availableMonthly >= requiredMonthly ? 'On Track' : 'At Risk',
    };
  });
  const totalRequiredMonthly = enrichedGoals.reduce((sum, goal) => sum + (goal.requiredMonthly || 0), 0);
  const monthlyShortfall = Math.max(0, totalRequiredMonthly - availableMonthly);

  const sixMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const bounds = monthBounds(date);
    const items = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= bounds.start && txDate < bounds.end;
    });
    return {
      name: date.toLocaleString('en', { month: 'short' }),
      income: items.filter((tx) => tx.type === 'Income').reduce((sum, tx) => sum + tx.amount, 0),
      expense: items.filter((tx) => tx.type === 'Expense').reduce((sum, tx) => sum + tx.amount, 0),
    };
  });

  return {
    summary: { balance, income, expenses, savingsRate: income ? ((income - expenses) / income) * 100 : 0 },
    monthly: sixMonths,
    categories: [...categoryMap].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    budgets: budgets.map((budget) => {
      const spent = categoryMap.get(budget.category) || 0;
      return { ...budget, spent, percentage: (spent / budget.limit) * 100 };
    }),
    goals: enrichedGoals,
    goalPlan: {
      affordable: monthlyShortfall === 0,
      availableMonthly,
      totalRequiredMonthly,
      monthlyShortfall,
      coveragePercentage: totalRequiredMonthly
        ? Math.max(0, Math.min(100, (availableMonthly / totalRequiredMonthly) * 100))
        : 100,
    },
    recentTransactions: [...transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5),
  };
};

const simulateGoal = async (payload: { targetAmount: number; currentSaved?: number; deadlineMonths: number }) => {
  const transactions = await fetchTransactions();
  const { start, end } = monthBounds();
  const monthly = transactions.filter((tx) => {
    const date = new Date(tx.date);
    return date >= start && date < end;
  });
  const income = monthly.filter((tx) => tx.type === 'Income').reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = monthly.filter((tx) => tx.type === 'Expense').reduce((sum, tx) => sum + tx.amount, 0);
  const availableMonthly = income - expenses;
  const requiredMonthly = Math.max(0, payload.targetAmount - (payload.currentSaved || 0)) / Math.max(1, payload.deadlineMonths);
  const expenseCategories = new Map<string, number>();
  monthly
    .filter((tx) => tx.type === 'Expense')
    .forEach((tx) => expenseCategories.set(tx.category, (expenseCategories.get(tx.category) || 0) + tx.amount));
  const recommendations = [...expenseCategories]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => ({ category, currentSpend: amount, potentialSaving: amount * 0.2 }));

  return { income, expenses, availableMonthly, requiredMonthly, difference: availableMonthly - requiredMonthly, recommendations };
};

const getCollection = async (path: string, params: Record<string, unknown> = {}) => {
  if (path === '/transactions') {
    const page = Math.max(1, Number.parseInt(String(params.page || '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(String(params.limit || '10'), 10) || 10));
    const search = String(params.search || '').trim().toLowerCase();
    const type = String(params.type || 'All');
    const all = (await fetchTransactions())
      .filter((tx) => type === 'All' || tx.type === type)
      .filter((tx) => !search || tx.name.toLowerCase().includes(search) || tx.category.toLowerCase().includes(search))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
    const total = all.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, pages);
    const items = all.slice((currentPage - 1) * limit, currentPage * limit);
    return { items, total, page: currentPage, pages, limit };
  }

  if (path === '/budgets') return fetchBudgets();
  if (path === '/goals') return fetchGoals();
  if (path === '/analytics/dashboard') return buildDashboard();
  throw new Error(`Unknown API path: ${path}`);
};

const insertRecord = async (path: string, payload: any) => {
  const userId = await getCurrentUserId();
  if (path === '/transactions') {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        name: payload.name,
        category: payload.category,
        type: payload.type,
        amount: payload.amount,
        date: payload.date,
        method: payload.method || 'Card',
      })
      .select()
      .single();
    if (error) throw error;
    return mapTransaction(data as TransactionRow);
  }
  if (path === '/budgets') {
    const { data, error } = await supabase
      .from('budgets')
      .insert({ user_id: userId, category: payload.category, limit_amount: toBudgetLimit(payload.limit) })
      .select()
      .single();
    if (error) throw error;
    return mapBudget(data as BudgetRow);
  }
  if (path === '/goals') {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        name: payload.name,
        target_amount: payload.targetAmount,
        current_saved: payload.currentSaved || 0,
        deadline: payload.deadline,
      })
      .select()
      .single();
    if (error) throw error;
    return mapGoal(data as GoalRow);
  }
  if (path === '/analytics/simulate') return simulateGoal(payload);
  throw new Error(`Unknown API path: ${path}`);
};

const updateRecord = async (path: string, payload: any) => {
  const [, collection, id] = path.split('/');
  if (collection === 'transactions') {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        name: payload.name,
        category: payload.category,
        type: payload.type,
        amount: payload.amount,
        date: payload.date,
        method: payload.method || 'Card',
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapTransaction(data as TransactionRow);
  }
  if (collection === 'budgets') {
    const { data, error } = await supabase
      .from('budgets')
      .update({ category: payload.category, limit_amount: toBudgetLimit(payload.limit) })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapBudget(data as BudgetRow);
  }
  if (collection === 'goals') {
    const { data, error } = await supabase
      .from('goals')
      .update({
        name: payload.name,
        target_amount: payload.targetAmount,
        current_saved: payload.currentSaved || 0,
        deadline: payload.deadline,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapGoal(data as GoalRow);
  }
  throw new Error(`Unknown API path: ${path}`);
};

const deleteRecord = async (path: string) => {
  const [, collection, id] = path.split('/');
  const table = collection as 'transactions' | 'budgets' | 'goals';
  if (!['transactions', 'budgets', 'goals'].includes(table)) throw new Error(`Unknown API path: ${path}`);
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return null;
};

export const api = {
  get: async <T = any>(path: string, config?: { params?: Record<string, unknown> }): Promise<ApiResponse<T>> => ({
    data: await getCollection(path, config?.params) as T,
  }),
  post: async <T = any>(path: string, payload?: unknown): Promise<ApiResponse<T>> => ({
    data: await insertRecord(path, payload) as T,
  }),
  put: async <T = any>(path: string, payload?: unknown): Promise<ApiResponse<T>> => ({
    data: await updateRecord(path, payload) as T,
  }),
  delete: async <T = any>(path: string): Promise<ApiResponse<T>> => ({
    data: await deleteRecord(path) as T,
  }),
};

export const formatGel = (value: number) =>
  new Intl.NumberFormat('ka-GE', { style: 'currency', currency: 'GEL', maximumFractionDigits: 0 }).format(value || 0);

export const isoDate = (value: string | Date) => new Date(value).toISOString().slice(0, 10);

import { supabase } from './supabase';

const currentMonthDate = (day: number, monthOffset = 0) => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + monthOffset, day).toISOString().slice(0, 10);
};

const transaction = (
  name: string,
  category: string,
  type: 'Income' | 'Expense',
  amount: number,
  day: number,
  monthOffset = 0,
  method = 'Card',
) => ({
  name,
  category,
  type,
  amount,
  date: currentMonthDate(day, monthOffset),
  method,
});

export async function seedDemoData(userId: string) {
  const { count, error: countError } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (countError) throw countError;
  if (count && count > 0) return;

  const currentMonthTransactions = [
    transaction('Part-time campus job', 'Income', 'Income', 1350, 1, 0, 'Bank transfer'),
    transaction('Monthly family support', 'Income', 'Income', 900, 2, 0, 'Bank transfer'),
    transaction('Logo design project', 'Freelance', 'Income', 480, 4, 0, 'Bank transfer'),
    transaction('Tutoring session', 'Freelance', 'Income', 160, 7, 0, 'Bank transfer'),
    transaction('Shared apartment rent', 'Housing', 'Expense', 720, 2, 0, 'Bank transfer'),
    transaction('Weekly groceries', 'Food', 'Expense', 185, 3),
    transaction('University cafeteria', 'Food', 'Expense', 42, 5),
    transaction('Weekend groceries', 'Food', 'Expense', 76, 8),
    transaction('Metro and bus pass', 'Transport', 'Expense', 65, 3),
    transaction('Late-night taxi', 'Transport', 'Expense', 24, 6),
    transaction('Cloud storage and music', 'Subscriptions', 'Expense', 38, 4),
    transaction('Programming textbook', 'Education', 'Expense', 96, 5),
    transaction('Online course', 'Education', 'Expense', 72, 7),
    transaction('Coffee with classmates', 'Entertainment', 'Expense', 34, 6),
    transaction('Pharmacy purchase', 'Health', 'Expense', 47, 7),
    transaction('Mobile phone plan', 'Utilities', 'Expense', 35, 7),
    transaction('Cinema ticket', 'Entertainment', 'Expense', 28, 8),
    transaction('Household supplies', 'Shopping', 'Expense', 54, 8),
  ];

  const historicalTransactions = Array.from({ length: 6 }, (_, index) => {
    const monthOffset = -(index + 1);
    const variation = index * 18;
    return [
      transaction('Part-time campus job', 'Income', 'Income', 1280 + variation, 1, monthOffset, 'Bank transfer'),
      transaction('Monthly family support', 'Income', 'Income', 900, 2, monthOffset, 'Bank transfer'),
      transaction('Freelance design work', 'Freelance', 'Income', 260 + index * 45, 12, monthOffset, 'Bank transfer'),
      transaction('Shared apartment rent', 'Housing', 'Expense', 720, 3, monthOffset, 'Bank transfer'),
      transaction('Groceries', 'Food', 'Expense', 240 + index * 9, 6, monthOffset),
      transaction('Cafes and lunch', 'Food', 'Expense', 105 + index * 7, 18, monthOffset),
      transaction('Public transport', 'Transport', 'Expense', 62 + index * 3, 8, monthOffset),
      transaction('Study supplies', 'Education', 'Expense', 55 + index * 14, 10, monthOffset),
      transaction('Streaming and software', 'Subscriptions', 'Expense', 38, 14, monthOffset),
      transaction('Social activities', 'Entertainment', 'Expense', 82 + index * 8, 21, monthOffset),
      transaction('Phone and internet', 'Utilities', 'Expense', 68, 24, monthOffset),
      transaction('Health and personal care', 'Health', 'Expense', 44 + index * 5, 26, monthOffset),
    ];
  }).flat();

  const budgets = [
    { category: 'Food', limit_amount: 420 },
    { category: 'Transport', limit_amount: 100 },
    { category: 'Education', limit_amount: 180 },
    { category: 'Entertainment', limit_amount: 140 },
    { category: 'Subscriptions', limit_amount: 55 },
    { category: 'Health', limit_amount: 100 },
    { category: 'Housing', limit_amount: 750 },
    { category: 'Shopping', limit_amount: 160 },
    { category: 'Utilities', limit_amount: 90 },
  ];

  const today = new Date();
  const goals = [
    {
      name: 'Buy a Laptop',
      target_amount: 3000,
      current_saved: 1250,
      deadline: new Date(today.getFullYear(), today.getMonth() + 8, 1).toISOString().slice(0, 10),
    },
    {
      name: 'Summer Trip',
      target_amount: 1800,
      current_saved: 540,
      deadline: new Date(today.getFullYear(), today.getMonth() + 12, 1).toISOString().slice(0, 10),
    },
    {
      name: 'Emergency Fund',
      target_amount: 5000,
      current_saved: 2100,
      deadline: new Date(today.getFullYear(), today.getMonth() + 18, 1).toISOString().slice(0, 10),
    },
  ];

  const { error: transactionError } = await supabase
    .from('transactions')
    .insert([...currentMonthTransactions, ...historicalTransactions].map((item) => ({ ...item, user_id: userId })));
  if (transactionError) throw transactionError;

  const { error: budgetError } = await supabase
    .from('budgets')
    .insert(budgets.map((item) => ({ ...item, user_id: userId })));
  if (budgetError) throw budgetError;

  const { error: goalError } = await supabase
    .from('goals')
    .insert(goals.map((item) => ({ ...item, user_id: userId })));
  if (goalError) throw goalError;
}

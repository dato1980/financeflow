export const mockTransactions = [
  { id: '1', name: 'Salary', category: 'Income', type: 'Income', amount: 2000, date: '2026-06-01', method: 'Bank transfer' },
  { id: '2', name: 'Groceries', category: 'Food', type: 'Expense', amount: 120, date: '2026-06-03', method: 'Card' },
  { id: '3', name: 'Bus Card', category: 'Transport', type: 'Expense', amount: 30, date: '2026-06-04', method: 'Card' },
  { id: '4', name: 'Netflix', category: 'Subscriptions', type: 'Expense', amount: 25, date: '2026-06-05', method: 'Card' },
  { id: '5', name: 'Restaurant', category: 'Food', type: 'Expense', amount: 80, date: '2026-06-07', method: 'Card' },
  { id: '6', name: 'Freelance Project', category: 'Freelance', type: 'Income', amount: 500, date: '2026-06-10', method: 'Bank transfer' },
  { id: '7', name: 'Gym', category: 'Health', type: 'Expense', amount: 70, date: '2026-06-12', method: 'Card' },
  { id: '8', name: 'Books', category: 'Education', type: 'Expense', amount: 90, date: '2026-06-13', method: 'Card' },
];

export const mockBudgets = [
  { id: '1', category: 'Food', limit: 500, spent: 420 },
  { id: '2', category: 'Transport', limit: 150, spent: 90 },
  { id: '3', category: 'Entertainment', limit: 200, spent: 180 },
  { id: '4', category: 'Subscriptions', limit: 80, spent: 95 },
  { id: '5', category: 'Education', limit: 250, spent: 90 },
];

export const mockGoals = [
  {
    id: '1',
    name: 'Buy a Laptop',
    targetAmount: 3000,
    currentSaved: 600,
    deadlineMonths: 10,
    requiredMonthly: 240,
    availableMonthly: 180,
    status: 'At Risk',
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentSaved: 2000,
    deadlineMonths: 15,
    requiredMonthly: 200,
    availableMonthly: 250,
    status: 'On Track',
    color: '#10b981',
  }
];

# FinanceFlow

FinanceFlow is a bachelor project web application for personal finance management. It helps users track income and expenses, control monthly category budgets, analyze spending behavior, and evaluate whether financial goals are realistic based on their current cash flow.

## Project Goal

The goal of the project is to create a fully functional, practical technology product that solves a real everyday problem: organizing personal finances in one simple system.

The application demonstrates:

- Practical use of modern web technologies
- Authentication and user-specific data isolation
- Relational data modeling with Supabase/PostgreSQL
- Interactive dashboards and data visualization
- CRUD functionality for real user workflows
- Deployment-ready frontend architecture

## Main Features

- User registration and login with Supabase Auth
- User-isolated records through Supabase Row Level Security
- Income and expense transaction management
- Search, filter, pagination, create, edit, and delete transactions
- Monthly category budget limits
- Budget progress warnings at high usage levels
- Financial goals with target amount, saved amount, and deadline
- Dashboard summary with balance, income, expenses, and savings rate
- Analytics charts for cash flow, categories, and budget progress
- Goal simulator that compares required monthly savings with available monthly money
- Responsive desktop and mobile layout
- Demo account for presentation

## Demo Account

Use this account during presentation or testing:

```txt
Email: alex@example.com
Password: password123
```

The demo account contains sample transactions, budgets, and financial goals.

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React icons
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Vercel deployment configuration

## System Architecture

FinanceFlow is implemented as a single-page application.

```txt
User Browser
    |
    v
React + Vite Frontend
    |
    | Supabase JS Client
    v
Supabase
    |-- Authentication
    |-- PostgreSQL Database
    |-- Row Level Security Policies
```

There is no separate Express/Node backend. Supabase provides authentication, database access, and authorization rules.

## Database Design

The application uses three main tables in Supabase:

### transactions

Stores income and expense records.

Important fields:

- `id`
- `user_id`
- `name`
- `category`
- `type`
- `amount`
- `date`
- `method`

### budgets

Stores monthly category limits.

Important fields:

- `id`
- `user_id`
- `category`
- `limit_amount`

### goals

Stores financial goals.

Important fields:

- `id`
- `user_id`
- `name`
- `target_amount`
- `current_saved`
- `deadline`

Each table references `auth.users(id)` through `user_id`. Row Level Security ensures each authenticated user can only access their own records.

The full schema is available in:

```txt
supabase-schema.sql
```

## Security

The project uses Supabase Row Level Security policies:

- Users can only read their own records
- Users can only create records for their own account
- Users can only update their own records
- Users can only delete their own records

Local environment variables are stored in `.env`, which is excluded from GitHub by `.gitignore`.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dato1980/financeflow.git
cd financeflow
```

2. Install dependencies:

```bash
npm install
```

3. Create a Supabase project.

4. Open Supabase SQL Editor and run the SQL from:

```txt
supabase-schema.sql
```

5. Create a `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

6. Start the development server:

```bash
npm run dev
```

7. Open the local site:

```txt
http://127.0.0.1:5173/
```

## Available Scripts

```bash
npm run dev
```

Starts the local Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run check
```

Runs TypeScript validation and production build.

## User Guide

### Register or Sign In

Users can create a new account or sign in with an existing account. Each user has separate finance records.

### Transactions

Users can:

- Add income or expense transactions
- Choose category, amount, date, and payment method
- Search transactions
- Filter by income or expense
- Edit existing transactions
- Delete transactions

### Budgets

Users can:

- Create monthly category limits
- See how much was spent in each category
- View percentage usage
- Receive visual warnings when spending approaches or exceeds a limit

### Goals

Users can:

- Create financial goals
- Set target amount
- Set current saved amount
- Set deadline
- See required monthly saving
- Compare goals with available monthly cash flow

### Analytics

Users can view:

- Six-month income vs expense chart
- Expense category distribution
- Budget progress

### Goal Simulator

The simulator calculates:

- Required monthly saving
- Available monthly money
- Difference between required and available amount
- Suggested categories where spending could be reduced

## Testing and QA

The following QA checks were performed:

- TypeScript validation passed
- Production build passed
- Production dependency audit passed with zero vulnerabilities
- Supabase CRUD smoke test passed for transactions, budgets, and goals
- Local route smoke test passed for `/`, `/login`, and `/app`
- `.env`, `node_modules`, `dist`, and log files are ignored by Git
- Double-submit prevention added to transaction, budget, and goal forms

Run QA locally:

```bash
npm run check
npm audit --omit=dev
```

## Deployment

The project is ready for Vercel deployment.

Vercel settings:

```txt
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Required Vercel environment variables:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

The `vercel.json` file includes a rewrite rule so React Router pages work after refresh.

## Project Scope

In scope:

- Personal finance tracking
- Manual transaction entry
- Budget management
- Financial goal tracking
- Analytics and visualizations
- Supabase authentication and database persistence
- Responsive web interface

Out of scope:

- Bank account integration
- Automatic transaction import
- Payment processing
- Multi-currency exchange conversion
- Native mobile application

## Limitations and Future Improvements

Possible future improvements:

- Add automated unit and integration tests
- Add export to CSV/PDF
- Add recurring transactions
- Add multi-currency support
- Add profile editing
- Add email/password reset screens
- Add server-side reporting functions or Supabase RPC functions
- Add more advanced goal recommendations

## Repository

```txt
https://github.com/dato1980/financeflow
```

## Author

Bachelor project for Computer Science.

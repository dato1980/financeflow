# FinanceFlow

Personal finance application based on the supplied Figma design and bachelor-thesis requirements.

## Features

- Supabase Auth with user-isolated records through Row Level Security
- Income and expense CRUD with search and type filtering
- Monthly category budgets with 80% and 100% warnings
- Dashboard and analytics for cash flow, category spending, and budget progress
- Financial goals with progress tracking
- Goal simulator based on real monthly cash flow and high-spend category recommendations
- Responsive desktop and mobile navigation

## Stack

React 18, TypeScript, Vite, Tailwind CSS, Recharts, and Supabase.

## Setup

1. Create a Supabase project.
2. Run the SQL in `supabase-schema.sql` from the Supabase SQL Editor.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
6. Run `npm run dev`.

Client: `http://localhost:5173`

Run `npm run check` for TypeScript validation and a production build.

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  type text not null check (type in ('Income', 'Expense')),
  amount numeric not null check (amount > 0),
  date date not null,
  method text not null default 'Card',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  limit_amount numeric not null check (limit_amount > 0 and limit_amount <= 1000000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric not null check (target_amount > 0),
  current_saved numeric not null default 0 check (current_saved >= 0),
  deadline date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.goals enable row level security;

drop policy if exists "Users can manage own transactions" on public.transactions;
drop policy if exists "Users can manage own budgets" on public.budgets;
drop policy if exists "Users can manage own goals" on public.goals;

create policy "Users can manage own transactions"
on public.transactions
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can manage own budgets"
on public.budgets
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can manage own goals"
on public.goals
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

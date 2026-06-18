import React from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  LineChart,
  LockKeyhole,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
} from 'lucide-react';
import heroImage from '../../assets/financeflow-hero.jpg';

const features = [
  {
    title: 'Track income and expenses',
    description: 'Log income, bills, subscriptions, and daily spending with categories that stay easy to scan.',
    icon: CircleDollarSign,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Control monthly budgets',
    description: 'Set category limits and see exactly when Food, Transport, or Subscriptions need attention.',
    icon: WalletCards,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Understand your habits',
    description: 'Charts turn your transaction history into simple answers about what changed this month.',
    icon: BarChart3,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Plan realistic goals',
    description: 'Run a savings goal against income, expenses, deadline, and possible category reductions.',
    icon: Target,
    color: 'bg-rose-50 text-rose-600',
  },
];

const stats = [
  ['4 core tools', 'Tracking, budgets, analytics, and goals'],
  ['GEL ready', 'Built around Georgian Lari examples'],
  ['Mobile first', 'Fast checks from any screen size'],
];

const workflow = [
  ['Add records', 'Capture salary, groceries, transport, and other transactions manually.'],
  ['Watch limits', 'See budget progress before a category becomes a problem.'],
  ['Run a goal', 'Compare required monthly saving with available money.'],
];

function MiniDashboard() {
  return (
    <div className="rounded-xl border border-white/20 bg-white/95 p-4 text-slate-900 shadow-xl shadow-slate-950/20 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live overview</p>
          <p className="mt-1 text-2xl font-bold">₾4,280</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">+24%</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          ['Income', '₾2,500', 'text-emerald-600'],
          ['Spent', '₾1,120', 'text-rose-600'],
          ['Left', '₾680', 'text-indigo-600'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className={`mt-1 text-sm font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-20 items-end gap-2">
        {[42, 68, 50, 82, 58, 74, 64].map((height, index) => (
          <div key={height + index} className="flex flex-1 flex-col justify-end gap-1">
            <div className="rounded-t bg-indigo-500" style={{ height: `${height}%` }} />
            <div className="rounded-t bg-emerald-400" style={{ height: `${Math.max(height - 28, 16)}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/15 bg-slate-950/55 text-white backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-lg font-bold text-indigo-700">F</div>
            <span className="text-lg font-bold">FinanceFlow</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-white/80 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#workflow" className="transition-colors hover:text-white">Workflow</a>
            <a href="#simulator" className="transition-colors hover:text-white">Simulator</a>
          </nav>
          <Link
            to="/login"
            className="rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-100"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main>
        <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden pt-20 text-white">
          <img
            src={heroImage}
            alt="Finance dashboard displayed on a tablet beside budgeting tools"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.88),rgba(15,23,42,0.56),rgba(15,23,42,0.2))]" />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Clear money planning for students and everyday budgets
              </div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Take Control of Your Personal Finances
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
                Track spending, set monthly limits, review analytics, and test whether a savings goal is realistic before committing to it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-indigo-500 px-6 text-base font-bold text-white shadow-lg shadow-indigo-950/30 transition-colors hover:bg-indigo-400"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/app"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/35 bg-white/10 px-6 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/18"
                >
                  View Demo
                </Link>
              </div>
            </div>

            <div className="grid max-w-4xl gap-3 sm:grid-cols-3">
              {stats.map(([value, label]) => (
                <div key={value} className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-xl font-bold">{value}</p>
                  <p className="mt-1 text-sm leading-5 text-white/75">{label}</p>
                </div>
              ))}
            </div>

            <div className="hidden max-w-md md:block">
              <MiniDashboard />
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">Built for clarity</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">Everything a practical finance app needs, without banking complexity</h2>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <LockKeyhole className="h-4 w-4 text-emerald-600" />
                Your records stay tied to your own account
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-md ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">Daily flow</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">From transaction entry to better decisions</h2>
              <p className="mt-4 leading-7 text-slate-600">
                FinanceFlow is designed around the actions people actually repeat: add a record, check a limit, understand the month, and adjust a goal.
              </p>
            </div>

            <div className="grid gap-4">
              {workflow.map(([title, description], index) => (
                <div key={title} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[3rem_1fr]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-900 text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                    <p className="mt-1 leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="simulator" className="border-y border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
                <Sparkles className="h-4 w-4" />
                Signature feature
              </div>
              <h2 className="text-3xl font-bold text-slate-950">The goal simulator turns “I hope I can” into a concrete plan</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Enter a target amount, current savings, deadline, income, and expenses. FinanceFlow shows the monthly saving required, what is available, and how to make the goal achievable.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Compare required saving with available monthly money',
                  'See On Track, At Risk, and Unrealistic statuses',
                  'Get recommendations like extending the deadline or reducing spending',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Buy a laptop</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">At Risk</p>
                </div>
                <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">Needs adjustment</div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ['Target', '₾3,000'],
                  ['Saved', '₾600'],
                  ['Required', '₾240/mo'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
                  <span>Current progress</span>
                  <span>20%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div className="h-3 w-1/5 rounded-full bg-indigo-600" />
                </div>
              </div>
              <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <LineChart className="h-5 w-5" />
                  Make it realistic
                </div>
                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  Reduce Entertainment by 20% and extend the deadline by 2 months to lower the monthly pressure.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-base font-bold text-indigo-700">F</div>
              <span className="font-bold">FinanceFlow</span>
            </div>
            <p className="mt-2 text-sm text-white/65">Manual tracking, budget control, analytics, and goal simulation.</p>
          </div>
          <Link to="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-bold text-slate-950 hover:bg-slate-100">
            Start planning
          </Link>
        </div>
      </footer>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { api, formatGel, Goal, GoalPlan, isoDate } from '../lib/api';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../components/ui';

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalPlan, setGoalPlan] = useState<GoalPlan | null>(null);
  const [form, setForm] = useState({ name: '', targetAmount: '', currentSaved: '0', deadline: isoDate(new Date(new Date().setMonth(new Date().getMonth() + 12))) });
  const [isSaving, setIsSaving] = useState(false);
  const load = () => api.get('/analytics/dashboard').then((response) => {
    setGoals(response.data.goals);
    setGoalPlan(response.data.goalPlan);
  });
  useEffect(() => { load(); }, []);
  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await api.post('/goals', { ...form, targetAmount: Number(form.targetAmount), currentSaved: Number(form.currentSaved) });
      setForm({ name: '', targetAmount: '', currentSaved: '0', deadline: form.deadline });
      await load();
    } finally {
      setIsSaving(false);
    }
  };
  const remove = async (id: string) => { await api.delete(`/goals/${id}`); load(); };
  const highestRequirements = [...goals]
    .sort((a, b) => (b.requiredMonthly || 0) - (a.requiredMonthly || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between gap-4 flex-col sm:flex-row"><div><h1 className="text-2xl font-bold text-slate-900">Financial Goals</h1><p className="text-sm text-slate-500">Create measurable goals and compare them with your real monthly cash flow.</p></div><Link className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 font-medium text-white hover:bg-indigo-700" to="/app/goals/simulator">Open Simulator</Link></div>
      <Card><CardHeader><CardTitle>Create goal</CardTitle></CardHeader><CardContent>
        <form onSubmit={add} className="grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3">
          <Input required placeholder="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input required type="number" min="1" placeholder="Target amount" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
          <Input type="number" min="0" placeholder="Current saved" value={form.currentSaved} onChange={(e) => setForm({ ...form, currentSaved: e.target.value })} />
          <Input required type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <Button disabled={isSaving}><Plus className="w-4 h-4 mr-2" />{isSaving ? 'Adding...' : 'Add'}</Button>
        </form>
      </CardContent></Card>
      {goals.length > 0 && goalPlan && (
        <Card className={goalPlan.affordable ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-300 bg-amber-50/60'}>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              {goalPlan.affordable
                ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                : <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />}
              <div className="flex-1">
                <h2 className="font-semibold text-slate-900">
                  {goalPlan.affordable ? 'Your goals fit your monthly cash flow' : 'Your monthly cash is not enough for all goals'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  All goals require {formatGel(goalPlan.totalRequiredMonthly)} per month, while your current income after expenses leaves {formatGel(goalPlan.availableMonthly)}.
                  {!goalPlan.affordable && ` You are short by ${formatGel(goalPlan.monthlyShortfall)} per month.`}
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
                  <div className="rounded-lg bg-white/80 border p-3"><p className="text-slate-500">All goals require</p><p className="font-semibold text-slate-900">{formatGel(goalPlan.totalRequiredMonthly)}/month</p></div>
                  <div className="rounded-lg bg-white/80 border p-3"><p className="text-slate-500">You have available</p><p className="font-semibold text-slate-900">{formatGel(goalPlan.availableMonthly)}/month</p></div>
                  <div className="rounded-lg bg-white/80 border p-3"><p className="text-slate-500">{goalPlan.affordable ? 'Capacity used' : 'Monthly shortfall'}</p><p className={`font-semibold ${goalPlan.affordable ? 'text-emerald-700' : 'text-amber-700'}`}>{goalPlan.affordable ? `${goalPlan.coveragePercentage.toFixed(0)}% covered` : formatGel(goalPlan.monthlyShortfall)}</p></div>
                </div>
                {!goalPlan.affordable && (
                  <div className="mt-4 text-sm text-slate-700">
                    <p className="font-medium">Suggested adjustments</p>
                    <p className="mt-1">Free up {formatGel(goalPlan.monthlyShortfall)} monthly, extend one or more deadlines, or prioritize fewer goals. The largest monthly requirements are {highestRequirements.map((goal) => `${goal.name} (${formatGel(goal.requiredMonthly || 0)})`).join(', ')}.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid lg:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.currentSaved / goal.targetAmount) * 100, 100);
          return <Card key={goal._id}><CardContent className="p-5">
            <div className="flex justify-between items-start"><div><h3 className="font-semibold text-lg">{goal.name}</h3><p className="text-sm text-slate-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p></div><div className="flex gap-3 items-center"><Badge variant={goal.status === 'On Track' ? 'success' : 'warning'}>{goal.status}</Badge><button onClick={() => remove(goal._id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button></div></div>
            <div className="flex justify-between text-sm mt-5 mb-1"><span>{formatGel(goal.currentSaved)} saved</span><span>{formatGel(goal.targetAmount)}</span></div>
            <div className="h-3 bg-slate-100 rounded-full"><div className="h-3 bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} /></div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm"><div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-500">Required/month</p><p className="font-semibold">{formatGel(goal.requiredMonthly || 0)}</p></div><div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-500">Available/month</p><p className="font-semibold">{formatGel(goal.availableMonthly || 0)}</p></div></div>
          </CardContent></Card>;
        })}
      </div>
    </div>
  );
}

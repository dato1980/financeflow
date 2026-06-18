import React, { useState } from 'react';
import { ArrowLeft, Calculator, Calendar, PieChart as PieChartIcon, Target } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useNavigate } from 'react-router';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '../components/ui';
import { api, formatGel } from '../lib/api';

export function GoalSimulator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ targetAmount: '3000', currentSaved: '600', deadlineMonths: '10' });
  const [result, setResult] = useState<any>(null);
  const run = async () => {
    const response = await api.post('/analytics/simulate', {
      targetAmount: Number(form.targetAmount),
      currentSaved: Number(form.currentSaved),
      deadlineMonths: Number(form.deadlineMonths),
    });
    setResult(response.data);
  };
  const status = result?.difference >= 0 ? 'On Track' : result?.difference > -100 ? 'At Risk' : 'Unrealistic';
  const chartData = result ? [
    { name: 'Required Saving', amount: result.requiredMonthly, fill: '#3b82f6' },
    { name: 'Available Money', amount: result.availableMonthly, fill: result.difference >= 0 ? '#10b981' : '#ef4444' },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="w-5 h-5" /></button><div><h1 className="text-2xl font-bold text-slate-900">Financial Goal Simulator</h1><p className="text-sm text-slate-500">Uses your current month income and expenses from the database.</p></div></div>
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 h-fit"><CardHeader><CardTitle className="flex gap-2"><Calculator className="w-5 h-5 text-indigo-500" />Simulation Inputs</CardTitle></CardHeader><CardContent className="space-y-4">
          <label className="text-sm text-slate-700">Target Amount<Input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} /></label>
          <label className="text-sm text-slate-700">Current Saved<Input type="number" value={form.currentSaved} onChange={(e) => setForm({ ...form, currentSaved: e.target.value })} /></label>
          <label className="text-sm text-slate-700">Deadline Months<Input type="number" value={form.deadlineMonths} onChange={(e) => setForm({ ...form, deadlineMonths: e.target.value })} /></label>
          <Button className="w-full" onClick={run}>Run Simulation</Button>
        </CardContent></Card>
        <div className="lg:col-span-8 space-y-6">
          {!result ? <Card className="p-12 text-center bg-slate-50/50 border-dashed border-2"><div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><Target className="w-8 h-8" /></div><h3 className="text-xl font-bold">Ready to test your goal?</h3><p className="text-slate-500 mt-2">Run the simulation to compare required savings with your real monthly cash flow.</p></Card> : <>
            <Card className={`border-l-4 ${status === 'On Track' ? 'border-l-emerald-500' : status === 'At Risk' ? 'border-l-amber-500' : 'border-l-rose-500'}`}><CardContent className="p-6"><Badge variant={status === 'On Track' ? 'success' : status === 'At Risk' ? 'warning' : 'danger'}>{status}</Badge><h2 className="text-xl font-bold mt-3">{status === 'On Track' ? 'You can reach this goal.' : 'This goal needs adjustments.'}</h2><p className="text-slate-600 mt-1">Difference: {formatGel(result.difference)} per month.</p></CardContent></Card>
            <div className="grid sm:grid-cols-3 gap-4">{[['Required', result.requiredMonthly], ['Available', result.availableMonthly], ['Difference', result.difference]].map(([label, value]: any) => <Card key={label}><CardContent className="p-5 text-center"><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold">{formatGel(value)}</p></CardContent></Card>)}</div>
            <div className="grid md:grid-cols-2 gap-6"><Card><CardHeader><CardTitle>Monthly Capability</CardTitle></CardHeader><CardContent><div style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value: number) => formatGel(value)} /><Bar dataKey="amount" radius={[4, 4, 0, 0]}>{chartData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div></CardContent></Card>
            <Card><CardHeader><CardTitle>Recommendations</CardTitle></CardHeader><CardContent className="space-y-4">{result.recommendations.map((item: any) => <div key={item.category} className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex gap-3"><PieChartIcon className="w-5 h-5 text-indigo-600 shrink-0" /><div><p className="text-sm font-medium text-indigo-900">Reduce {item.category}</p><p className="text-xs text-indigo-700 mt-1">A 20% cut could save about {formatGel(item.potentialSaving)} monthly.</p></div></div>)}<div className="p-4 rounded-lg bg-slate-50 border flex gap-3"><Calendar className="w-5 h-5 text-slate-600" /><p className="text-sm text-slate-600">Extending the deadline lowers the required monthly saving.</p></div></CardContent></Card></div>
          </>}
        </div>
      </div>
    </div>
  );
}

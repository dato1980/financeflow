import React from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { useAuth } from '../lib/AuthContext';

export function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Settings</h1><p className="text-sm text-slate-500">Account and session details.</p></div>
      <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="space-y-2">
        <p><span className="text-slate-500">Name:</span> {user?.name}</p>
        <p><span className="text-slate-500">Email:</span> {user?.email}</p>
        <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
      </CardContent></Card>
    </div>
  );
}

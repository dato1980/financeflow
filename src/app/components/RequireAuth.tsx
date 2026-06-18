import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../lib/AuthContext';

export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-500">Loading your workspace...</div>;
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

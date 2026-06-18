import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './supabase';

type User = { id: string; name: string; email: string };
type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const profileFromSupabaseUser = (supabaseUser: SupabaseUser): User => {
  const email = supabaseUser.email || '';
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || email.split('@')[0] || 'User',
    email,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => setUser(data.session?.user ? profileFromSupabaseUser(data.session.user) : null))
      .finally(() => setIsLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? profileFromSupabaseUser(session.user) : null);
      setIsLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(profileFromSupabaseUser(data.user));
      }
    },
    register: async (name, email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      if (!data.session) {
        throw new Error('Account created. Check your email to confirm it before signing in.');
      }
      if (data.user) {
        setUser(profileFromSupabaseUser(data.user));
      }
    },
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
    },
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

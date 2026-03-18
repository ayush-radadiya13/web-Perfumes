'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, loginUser, registerUser } from '../lib/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'lp_user_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const t = localStorage.getItem(STORAGE_KEY);
      if (t) setToken(t);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!mounted || !token) {
      setUser(null);
      return;
    }
    let cancelled = false;
    getMe(token)
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {
            /* ignore */
          }
        }
      });
    return () => {
      cancelled = true;
    };
  }, [mounted, token]);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    setToken(data.token);
    try {
      localStorage.setItem(STORAGE_KEY, data.token);
    } catch {
      /* ignore */
    }
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    setToken(data.token);
    try {
      localStorage.setItem(STORAGE_KEY, data.token);
    } catch {
      /* ignore */
    }
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      mounted,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [token, user, loading, mounted, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth inside AuthProvider');
  return ctx;
}

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API, authHeaders } from "@/lib/api";

const Ctx = createContext(null);
const KEY = "perfume_user_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async (t) => {
    const r = await fetch(`${API}/auth/me`, { headers: authHeaders(t) });
    if (!r.ok) {
      setToken(null);
      setUser(null);
      localStorage.removeItem(KEY);
      return;
    }
    const j = await r.json();
    setUser(j.user);
  }, []);

  useEffect(() => {
    const t = localStorage.getItem(KEY);
    if (t) {
      setToken(t);
      loadMe(t).finally(() => setLoading(false));
    } else setLoading(false);
  }, [loadMe]);

  const login = async (email, password) => {
    const r = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || "Login failed");
    localStorage.setItem(KEY, j.token);
    setToken(j.token);
    setUser(j.user);
  };

  const register = async (name, email, password) => {
    const r = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.message || j.errors?.[0]?.msg || "Register failed");
    localStorage.setItem(KEY, j.token);
    setToken(j.token);
    setUser(j.user);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, token, loading, login, register, logout }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}

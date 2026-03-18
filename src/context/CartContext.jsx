"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const Ctx = createContext(null);
const KEY = "perfume_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const add = (line) => {
    const qty = line.quantity ?? 1;
    setItems((prev) => {
      const i = prev.findIndex((p) => p.productId === line.productId);
      let next;
      if (i >= 0) {
        next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + qty };
      } else {
        next = [...prev, { ...line, quantity: qty }];
      }
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const remove = (productId) => {
    persist(items.filter((p) => p.productId !== productId));
  };

  const setQty = (productId, quantity) => {
    if (quantity < 1) return remove(productId);
    persist(items.map((p) => (p.productId === productId ? { ...p, quantity } : p)));
  };

  const clear = () => {
    setItems([]);
    localStorage.removeItem(KEY);
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>{children}</Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}

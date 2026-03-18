'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'perfumes_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, mounted]);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const id = String(product._id);
      const i = prev.findIndex((x) => x.productId === id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + qty };
        return next;
      }
      return [...prev, { productId: id, name: product.name, price: product.price, quantity: qty, image: product.images?.[0] }];
    });
  }, []);

  const updateQty = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((x) => x.productId !== productId);
      return prev.map((x) => (x.productId === productId ? { ...x, quantity } : x));
    });
  }, []);

  const remove = useCallback((productId) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, x) => s + x.price * x.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, updateQty, remove, clear, total, mounted }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart inside CartProvider');
  return ctx;
}

'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

export default function AddToCart({ product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');

  if (product.stock <= 0) {
    return <p className="text-red-400">Currently unavailable</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <select
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="border border-white/10 rounded-xl px-3 py-2.5 bg-white/5 text-cream focus:ring-2 focus:ring-gold/40 focus:outline-none"
      >
        {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          add(product, qty);
          setMsg('Added to cart');
          setTimeout(() => setMsg(''), 2000);
        }}
        className="btn-gold px-8 py-3"
      >
        Add to cart
      </button>
      {msg && <span className="text-sm text-emerald-400">{msg}</span>}
    </div>
  );
}

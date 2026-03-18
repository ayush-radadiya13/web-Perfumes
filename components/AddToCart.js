'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

export default function AddToCart({ product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');

  if (product.stock <= 0) {
    return <p className="text-red-700">Currently unavailable</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <select
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="border rounded px-3 py-2 bg-white"
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
        className="px-8 py-3 bg-ink text-cream font-semibold rounded hover:bg-plum transition"
      >
        Add to cart
      </button>
      {msg && <span className="text-sm text-green-700">{msg}</span>}
    </div>
  );
}

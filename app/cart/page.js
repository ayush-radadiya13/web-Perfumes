'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../components/CartProvider';
import { BASE } from '../../lib/api';
import { formatINR } from '../../lib/currency';

function imgUrl(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${BASE}${src.startsWith('/') ? '' : '/'}${src}`;
}

export default function CartPage() {
  const { items, updateQty, remove, total, mounted } = useCart();

  if (!mounted) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-cream-muted">Loading cart…</div>;
  }

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-cream-muted">Your cart is empty.</p>
        <Link href="/products" className="inline-block mt-6 text-gold hover:text-gold-light transition-colors">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-cream mb-8">Cart</h1>
      <ul className="space-y-6">
        {items.map((line) => (
          <li key={line.productId} className="flex gap-4 items-center border-b border-white/10 pb-6">
            <div className="w-20 h-24 relative bg-white/5 rounded-xl overflow-hidden shrink-0 border border-white/5">
              {line.image ? (
                <Image src={imgUrl(line.image)} alt="" fill className="object-cover" sizes="80px" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-cream truncate">{line.name}</p>
              <p className="text-gold">{formatINR(line.price)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => updateQty(line.productId, parseInt(e.target.value, 10) || 0)}
              className="w-16 border border-white/10 rounded-lg px-2 py-1.5 bg-white/5 text-cream focus:ring-2 focus:ring-gold/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => remove(line.productId)}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-between items-center">
        <p className="text-xl font-semibold text-cream">Total: <span className="text-gold">{formatINR(total)}</span></p>
        <Link href="/checkout" className="btn-gold px-8 py-3">
          Checkout
        </Link>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../components/CartProvider';
import { BASE } from '../../lib/api';

function imgUrl(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${BASE}${src.startsWith('/') ? '' : '/'}${src}`;
}

export default function CartPage() {
  const { items, updateQty, remove, total, mounted } = useCart();

  if (!mounted) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center">Loading cart…</div>;
  }

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
        <Link href="/products" className="inline-block mt-6 text-plum underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl mb-8">Cart</h1>
      <ul className="space-y-6">
        {items.map((line) => (
          <li key={line.productId} className="flex gap-4 items-center border-b border-ink/10 pb-6">
            <div className="w-20 h-24 relative bg-ink/5 rounded overflow-hidden shrink-0">
              {line.image ? (
                <Image src={imgUrl(line.image)} alt="" fill className="object-cover" sizes="80px" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{line.name}</p>
              <p className="text-gold">${Number(line.price).toFixed(2)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => updateQty(line.productId, parseInt(e.target.value, 10) || 0)}
              className="w-16 border rounded px-2 py-1"
            />
            <button
              type="button"
              onClick={() => remove(line.productId)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        <Link
          href="/checkout"
          className="px-8 py-3 bg-ink text-cream font-semibold rounded hover:bg-plum"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { getMyOrders } from '../../lib/api';
import { orderStatusLabel } from '../../lib/orderStatus';

export default function OrdersPage() {
  const { token, isAuthenticated, mounted } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }
    getMyOrders(token)
      .then(setOrders)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [mounted, isAuthenticated, token]);

  if (!mounted || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-ink/50">Loading orders…</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-ink mb-4">Order history</h1>
        <p className="text-ink/60 mb-8">Sign in to see your orders and tracking.</p>
        <Link
          href="/login?next=/orders"
          className="inline-block px-8 py-3 bg-ink text-cream rounded-lg font-semibold hover:bg-plum transition"
        >
          Sign in
        </Link>
        <p className="mt-6 text-sm text-ink/50">
          New here?{' '}
          <Link href="/register" className="text-plum underline">
            Register
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl text-ink">Your orders</h1>
          <p className="text-ink/55 text-sm mt-1">Track shipments and download receipts.</p>
        </div>
        <Link href="/products" className="text-sm text-plum font-medium hover:underline shrink-0">
          Shop again →
        </Link>
      </div>

      {err && <p className="text-red-600 mb-6">{err}</p>}

      {!orders.length && !err && (
        <div className="rounded-2xl border border-ink/10 bg-white/80 p-12 text-center text-ink/60">
          <p className="mb-4">No orders yet.</p>
          <Link href="/products" className="text-plum font-semibold underline">
            Browse perfumes
          </Link>
        </div>
      )}

      <ul className="space-y-4">
        {orders.map((o) => (
          <li
            key={o._id}
            className="rounded-2xl border border-ink/10 bg-white shadow-sm shadow-ink/5 overflow-hidden hover:border-gold/30 transition"
          >
            <Link href={`/orders/${o._id}`} className="block p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="font-mono text-sm text-gold font-semibold">{o.orderNumber}</p>
                  <p className="text-xs text-ink/45 mt-1">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    }) : ''}
                  </p>
                  <ul className="mt-4 space-y-1">
                    {(o.items || []).slice(0, 4).map((line, i) => (
                      <li key={i} className="text-sm text-ink/80">
                        {line.name} × {line.quantity}
                      </li>
                    ))}
                    {(o.items || []).length > 4 && (
                      <li className="text-xs text-ink/45">+{(o.items || []).length - 4} more</li>
                    )}
                  </ul>
                </div>
                <div className="md:text-right shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      o.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : o.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : o.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {orderStatusLabel(o.status)}
                  </span>
                  <p className="mt-4 text-xl font-display text-ink">${Number(o.total).toFixed(2)}</p>
                  <span className="text-sm text-plum font-medium mt-2 inline-block">View details →</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

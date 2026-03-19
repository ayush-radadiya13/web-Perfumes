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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-cream-muted">Loading orders…</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-cream mb-4">Order history</h1>
        <p className="text-cream-muted mb-8">Sign in to see your orders and tracking.</p>
        <Link href="/login?next=/orders" className="btn-gold inline-block px-8 py-3">
          Sign in
        </Link>
        <p className="mt-6 text-sm text-cream-muted">
          New here?{' '}
          <Link href="/register" className="text-gold hover:text-gold-light transition-colors">
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
          <h1 className="font-display text-3xl text-cream">Your orders</h1>
          <p className="text-cream-muted text-sm mt-1">Track shipments and download receipts.</p>
        </div>
        <Link href="/products" className="text-sm text-gold font-medium hover:text-gold-light transition-colors shrink-0">
          Shop again →
        </Link>
      </div>

      {err && <p className="text-red-400 mb-6">{err}</p>}

      {!orders.length && !err && (
        <div className="rounded-2xl glass-card p-12 text-center text-cream-muted">
          <p className="mb-4">No orders yet.</p>
          <Link href="/products" className="text-gold font-semibold hover:text-gold-light transition-colors">
            Browse perfumes
          </Link>
        </div>
      )}

      <ul className="space-y-4">
        {orders.map((o) => (
          <li
            key={o._id}
            className="rounded-2xl glass-card overflow-hidden hover:shadow-gold-glow-sm hover:border-gold/30 transition-all duration-300"
          >
            <Link href={`/orders/${o._id}`} className="block p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="font-mono text-sm text-gold font-semibold">{o.orderNumber}</p>
                  <p className="text-xs text-cream-muted mt-1">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    }) : ''}
                  </p>
                  <ul className="mt-4 space-y-1">
                    {(o.items || []).slice(0, 4).map((line, i) => (
                      <li key={i} className="text-sm text-cream/80">
                        {line.name} × {line.quantity}
                      </li>
                    ))}
                    {(o.items || []).length > 4 && (
                      <li className="text-xs text-cream-muted">+{(o.items || []).length - 4} more</li>
                    )}
                  </ul>
                </div>
                <div className="md:text-right shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      o.status === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : o.status === 'shipped'
                          ? 'bg-blue-500/20 text-blue-400'
                          : o.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gold/20 text-gold'
                    }`}
                  >
                    {orderStatusLabel(o.status)}
                  </span>
                  <p className="mt-4 text-xl font-display text-cream">${Number(o.total).toFixed(2)}</p>
                  <span className="text-sm text-gold font-medium mt-2 inline-block">View details →</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

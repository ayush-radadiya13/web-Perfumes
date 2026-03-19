'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import OrderTrackingBar from '../../../components/OrderTrackingBar';
import { getOrderById } from '../../../lib/api';
import { orderStatusLabel } from '../../../lib/orderStatus';
import { downloadOrderPdf } from '../../../lib/orderPdf';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isAuthenticated, mounted } = useAuth();
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!id || !token) return;
    setLoading(true);
    getOrderById(id, token)
      .then(setOrder)
      .catch(() => setErr('Order not found or access denied'))
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    load();
  }, [mounted, isAuthenticated, load]);

  const onPdf = () => {
    if (order) downloadOrderPdf(order);
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-cream-muted mb-6">Sign in to view this order.</p>
        <Link href={`/login?next=/orders/${id}`} className="btn-gold inline-block px-6 py-3">
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-cream-muted">Loading order…</div>
    );
  }

  if (err || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-red-400 mb-4">{err || 'Not found'}</p>
        <button type="button" onClick={() => router.push('/orders')} className="text-gold hover:text-gold-light transition-colors">
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-20">
      <Link href="/orders" className="text-sm text-gold hover:text-gold-light transition-colors mb-6 inline-block">
        ← All orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-cream">Order {order.orderNumber}</h1>
          <p className="text-sm text-cream-muted mt-1">
            Placed{' '}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
              : ''}
          </p>
        </div>
        <span
          className={`inline-flex self-start px-4 py-1.5 rounded-full text-sm font-semibold ${
            order.status === 'delivered'
              ? 'bg-emerald-500/20 text-emerald-400'
              : order.status === 'shipped'
                ? 'bg-blue-500/20 text-blue-400'
                : order.status === 'cancelled'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-gold/20 text-gold'
          }`}
        >
          {orderStatusLabel(order.status)}
        </span>
      </div>

      <section className="rounded-2xl glass-card p-6 md:p-8 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cream-muted mb-4">Tracking</h2>
        <OrderTrackingBar status={order.status} />
      </section>

      <section className="rounded-2xl glass-card p-6 md:p-8 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cream-muted mb-4">Ship to</h2>
        <p className="text-cream font-medium">{order.customerName}</p>
        {order.shippingAddress && (
          <p className="text-cream/80 text-sm mt-2 whitespace-pre-line">{order.shippingAddress}</p>
        )}
        {order.customerEmail && (
          <p className="text-cream-muted text-sm mt-2">{order.customerEmail}</p>
        )}
      </section>

      <section className="rounded-2xl glass-card p-6 md:p-8 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cream-muted mb-4">Products</h2>
        <ul className="divide-y divide-white/10">
          {(order.items || []).map((line, i) => (
            <li key={i} className="flex justify-between gap-4 py-4 first:pt-0">
              <div>
                <p className="font-medium text-cream">{line.name}</p>
                <p className="text-sm text-cream-muted">${Number(line.price).toFixed(2)} each</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-cream/70">× {line.quantity}</p>
                <p className="font-semibold text-cream">
                  ${(Number(line.price) * line.quantity).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-sm">
          <div className="flex justify-between text-cream-muted">
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Discount</span>
              <span>-${Number(order.discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-cream pt-2">
            <span>Total</span>
            <span className="text-gold">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </section>

      <button type="button" onClick={onPdf} className="btn-gold px-8 py-3.5">
        Download PDF
      </button>
    </div>
  );
}

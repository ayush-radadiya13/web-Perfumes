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
        <p className="text-ink/70 mb-6">Sign in to view this order.</p>
        <Link
          href={`/login?next=/orders/${id}`}
          className="inline-block px-6 py-3 bg-ink text-cream rounded-lg font-medium"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-ink/50">Loading order…</div>
    );
  }

  if (err || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-red-600 mb-4">{err || 'Not found'}</p>
        <button type="button" onClick={() => router.push('/orders')} className="text-plum underline">
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-20">
      <Link href="/orders" className="text-sm text-plum hover:underline mb-6 inline-block">
        ← All orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-ink">Order {order.orderNumber}</h1>
          <p className="text-sm text-ink/50 mt-1">
            Placed{' '}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
              : ''}
          </p>
        </div>
        <span
          className={`inline-flex self-start px-4 py-1.5 rounded-full text-sm font-semibold ${
            order.status === 'delivered'
              ? 'bg-emerald-100 text-emerald-800'
              : order.status === 'shipped'
                ? 'bg-blue-100 text-blue-800'
                : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-900'
          }`}
        >
          {orderStatusLabel(order.status)}
        </span>
      </div>

      <section className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8 mb-8 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink/45 mb-4">Tracking</h2>
        <OrderTrackingBar status={order.status} />
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8 mb-8 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink/45 mb-4">Ship to</h2>
        <p className="text-ink font-medium">{order.customerName}</p>
        {order.shippingAddress && (
          <p className="text-ink/70 text-sm mt-2 whitespace-pre-line">{order.shippingAddress}</p>
        )}
        {order.customerEmail && (
          <p className="text-ink/55 text-sm mt-2">{order.customerEmail}</p>
        )}
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8 mb-8 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink/45 mb-4">Products</h2>
        <ul className="divide-y divide-ink/8">
          {(order.items || []).map((line, i) => (
            <li key={i} className="flex justify-between gap-4 py-4 first:pt-0">
              <div>
                <p className="font-medium text-ink">{line.name}</p>
                <p className="text-sm text-ink/50">${Number(line.price).toFixed(2)} each</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-ink/60">× {line.quantity}</p>
                <p className="font-semibold text-ink">
                  ${(Number(line.price) * line.quantity).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-ink/10 space-y-2 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount</span>
              <span>-${Number(order.discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-ink pt-2">
            <span>Total</span>
            <span className="text-gold">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onPdf}
        className="w-full sm:w-auto px-8 py-3.5 bg-ink text-cream rounded-xl font-semibold hover:bg-plum transition shadow-lg shadow-ink/15"
      >
        Download PDF
      </button>
    </div>
  );
}

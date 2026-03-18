'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import { getOrderById } from '../../../lib/api';
import { downloadOrderPdf } from '../../../lib/orderPdf';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { token, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!orderId) {
      setErr('Missing order');
      return;
    }
    if (isAuthenticated && token) {
      getOrderById(orderId, token)
        .then(setOrder)
        .catch(() => {
          try {
            const raw = sessionStorage.getItem('lastOrder');
            const o = raw ? JSON.parse(raw) : null;
            if (o && String(o._id) === String(orderId)) setOrder(o);
            else setErr('Could not load order');
          } catch {
            setErr('Could not load order');
          }
        });
    } else {
      try {
        const raw = sessionStorage.getItem('lastOrder');
        const o = raw ? JSON.parse(raw) : null;
        if (o && String(o._id) === String(orderId)) setOrder(o);
        else setErr('Sign in to view this order in your history, or keep this page open.');
      } catch {
        setErr('Could not load order details');
      }
    }
  }, [orderId, isAuthenticated, token]);

  if (!orderId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-ink/70">No order specified.</p>
        <Link href="/products" className="text-plum underline mt-4 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (err && !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-amber-800">{err}</p>
        <Link href="/orders" className="text-plum underline mt-4 inline-block">
          My orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="animate-pulse text-ink/50">Loading your confirmation…</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 text-3xl mb-6">
        ✓
      </div>
      <h1 className="font-display text-3xl text-ink mb-2">Order placed</h1>
      <p className="text-ink/70 mb-2">
        Thank you! Your order <strong className="text-ink font-mono text-sm">{order.orderNumber}</strong> is confirmed.
      </p>
      <p className="text-lg font-semibold text-gold mb-8">Total: ${Number(order.total).toFixed(2)}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
        <button
          type="button"
          onClick={() => downloadOrderPdf(order)}
          className="inline-flex items-center justify-center px-6 py-3 border border-ink/20 rounded-lg font-medium hover:bg-white transition"
        >
          Download PDF
        </button>
        {isAuthenticated && (
          <Link
            href={`/orders/${order._id}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-ink text-cream rounded-lg font-medium hover:bg-plum transition"
          >
            View order & tracking
          </Link>
        )}
        <Link
          href="/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-ink/20 rounded-lg font-medium hover:bg-cream transition"
        >
          Order history
        </Link>
        <Link href="/products" className="inline-flex items-center justify-center text-plum underline py-3">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-ink/50">Loading…</div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

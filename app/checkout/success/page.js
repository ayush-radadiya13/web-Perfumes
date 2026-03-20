'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import { getOrderById } from '../../../lib/api';
import { downloadOrderPdf } from '../../../lib/orderPdf';
import { formatINR } from '../../../lib/currency';

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
        <p className="text-cream-muted">No order specified.</p>
        <Link href="/products" className="text-gold hover:text-gold-light transition-colors mt-4 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (err && !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-amber-400">{err}</p>
        <Link href="/orders" className="text-gold hover:text-gold-light transition-colors mt-4 inline-block">
          My orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="animate-pulse text-cream-muted">Loading your confirmation…</div>
      </div>
    );
  }

  if (order.paymentStatus === 'failed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-400/90 mb-2">This order was not paid.</p>
        <p className="text-sm text-cream-muted mb-6 font-mono">{order.orderNumber}</p>
        <Link href="/checkout" className="btn-gold inline-flex items-center justify-center px-6 py-3">
          Return to checkout
        </Link>
      </div>
    );
  }

  const paid = order.paymentStatus === 'paid' || order.paymentStatus === undefined;
  if (!paid) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gold/40 border-t-gold animate-spin mx-auto mb-6" />
        <p className="text-cream-muted mb-2">Waiting for payment confirmation…</p>
        <p className="text-xs font-mono text-cream/50">{order.orderNumber}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl mb-6 ring-2 ring-emerald-500/30">
        ✓
      </div>
      <h1 className="font-display text-3xl text-cream mb-2">Order confirmed</h1>
      <p className="text-cream-muted mb-2">
        Thank you! Your order <strong className="text-cream font-mono text-sm">{order.orderNumber}</strong> is paid and
        confirmed.
      </p>
      {order.transactionId ? (
        <p className="text-xs font-mono text-cream/60 mb-2">
          Transaction <span className="text-cream/80">{order.transactionId}</span>
        </p>
      ) : null}
      <p className="text-lg font-semibold text-gold mb-8">Total: {formatINR(order.total)}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
        <button
          type="button"
          onClick={() => downloadOrderPdf(order)}
          className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl font-medium text-cream hover:bg-white/10 transition-colors"
        >
          Download PDF
        </button>
        {isAuthenticated && (
          <Link
            href={`/orders/${order._id}`}
            className="btn-gold inline-flex items-center justify-center px-6 py-3"
          >
            View order & tracking
          </Link>
        )}
        <Link
          href="/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl font-medium text-cream hover:bg-white/10 transition-colors"
        >
          Order history
        </Link>
        <Link href="/products" className="inline-flex items-center justify-center text-gold hover:text-gold-light transition-colors py-3">
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
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-cream-muted">Loading…</div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

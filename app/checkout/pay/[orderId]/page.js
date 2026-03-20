'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { completeDummyPayment, getPaymentOrderSummary } from '../../../../lib/api';
import { formatINR } from '../../../../lib/currency';

function PayContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params.orderId;
  const token = searchParams.get('token');

  const [summary, setSummary] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const data = await getPaymentOrderSummary(orderId, token);
      if (!data.payable) {
        if (data.failed) {
          router.replace(`/checkout/failure?orderId=${orderId}`);
          return;
        }
        router.replace(`/checkout/success?orderId=${orderId}`);
        return;
      }
      setSummary(data.order);
    } catch (e) {
      setLoadError(e.message || 'Could not load payment');
    }
  }, [orderId, token, router]);

  useEffect(() => {
    if (!orderId || !token) {
      setLoadError('Invalid payment link');
      return;
    }
    load();
  }, [orderId, token, load]);

  async function handleOutcome(outcome) {
    if (!token || processing) return;
    setActionError('');
    setProcessing(true);
    try {
      const res = await completeDummyPayment({
        orderId,
        paymentToken: token,
        outcome,
      });
      if (outcome === 'success') {
        try {
          sessionStorage.setItem('lastOrder', JSON.stringify(res.order));
        } catch {
          /* ignore */
        }
        router.push(`/checkout/success?orderId=${orderId}`);
        return;
      }
      router.push(`/checkout/failure?orderId=${orderId}`);
    } catch (e) {
      setActionError(e.message || 'Payment request failed');
    } finally {
      setProcessing(false);
    }
  }

  if (!orderId || !token) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-400/90">Invalid payment link.</p>
        <Link href="/checkout" className="text-gold hover:text-gold-light mt-6 inline-block transition-colors">
          Back to checkout
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-400/90">{loadError}</p>
        <Link href="/checkout" className="text-gold hover:text-gold-light mt-6 inline-block transition-colors">
          Back to checkout
        </Link>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center justify-center gap-4">
        <div
          className="h-10 w-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin"
          aria-hidden
        />
        <p className="text-cream-muted text-sm">Preparing secure payment…</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-cream-muted mb-2">Test gateway</p>
      <h1 className="font-display text-3xl text-cream mb-2">Complete payment</h1>
      <p className="text-sm text-cream-muted mb-8">
        Review your order, then simulate payment. Confirmation happens only after a successful verification on our
        server.
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-8 space-y-4">
        <div className="flex justify-between text-sm text-cream-muted">
          <span>Order</span>
          <span className="font-mono text-cream">{summary.orderNumber}</span>
        </div>
        {summary.customerName ? (
          <div className="flex justify-between text-sm text-cream-muted">
            <span>Bill to</span>
            <span className="text-cream text-right">{summary.customerName}</span>
          </div>
        ) : null}
        <ul className="border-t border-white/10 pt-4 space-y-2 text-sm text-cream/90">
          {(summary.items || []).map((line, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span className="truncate">
                {line.name} × {line.quantity}
              </span>
              <span className="text-cream-muted shrink-0">{formatINR(Number(line.price) * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-white/10 pt-4 flex justify-between items-baseline gap-4">
          <span className="text-cream-muted text-sm">Total due</span>
          <span className="text-2xl font-semibold text-gold tabular-nums">{formatINR(summary.total)}</span>
        </div>
      </div>

      {actionError ? <p className="text-red-400 text-sm mb-4">{actionError}</p> : null}

      <div className="space-y-3">
        <button
          type="button"
          disabled={processing}
          onClick={() => handleOutcome('success')}
          className="btn-gold w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {processing ? (
            <>
              <span
                className="h-4 w-4 rounded-full border-2 border-cream/30 border-t-cream animate-spin"
                aria-hidden
              />
              Processing…
            </>
          ) : (
            'Pay now'
          )}
        </button>
        <button
          type="button"
          disabled={processing}
          onClick={() => handleOutcome('failure')}
          className="w-full py-3.5 rounded-xl border border-white/15 text-cream-muted hover:bg-white/5 hover:text-cream transition-colors disabled:opacity-60"
        >
          Fail payment
        </button>
      </div>

      <p className="text-xs text-cream-muted/80 mt-8 text-center">
        Dummy gateway for testing · 1–2s delay · Transaction ID issued on success only
      </p>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-24 text-center text-cream-muted flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          Loading…
        </div>
      }
    >
      <PayContent />
    </Suspense>
  );
}

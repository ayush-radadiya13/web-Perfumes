'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/15 text-red-400 text-3xl mb-6 ring-2 ring-red-500/25">
        ×
      </div>
      <h1 className="font-display text-3xl text-cream mb-3">Payment failed</h1>
      <p className="text-cream-muted mb-2">
        We could not charge your order. Nothing has been confirmed and inventory has been released.
      </p>
      {orderId ? (
        <p className="text-xs font-mono text-cream/60 mb-8">
          Reference: <span className="text-cream/80">{orderId}</span>
        </p>
      ) : (
        <div className="mb-8" />
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
        <Link href="/checkout" className="btn-gold inline-flex items-center justify-center px-6 py-3">
          Try again
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl font-medium text-cream hover:bg-white/10 transition-colors"
        >
          Back to cart
        </Link>
        <Link href="/products" className="inline-flex items-center justify-center text-gold hover:text-gold-light transition-colors py-3">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-cream-muted">Loading…</div>
      }
    >
      <FailureContent />
    </Suspense>
  );
}

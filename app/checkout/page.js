'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../components/CartProvider';
import { useAuth } from '../../components/AuthProvider';
import { createOrder } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear, mounted } = useCart();
  const { token, isAuthenticated, user } = useAuth();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    const fd = new FormData(e.target);
    setLoading(true);
    try {
      const res = await createOrder(
        {
          items: items.map((x) => ({ productId: x.productId, quantity: x.quantity })),
          customerName: fd.get('customerName'),
          customerEmail: fd.get('customerEmail'),
          shippingAddress: fd.get('shippingAddress'),
          offerCode: fd.get('offerCode') || undefined,
        },
        token || null
      );
      const order = res.order;
      try {
        sessionStorage.setItem(
          'lastOrder',
          JSON.stringify({
            ...order,
            customerName: fd.get('customerName'),
            shippingAddress: fd.get('shippingAddress'),
          })
        );
      } catch {
        /* ignore */
      }
      clear();
      router.push(`/checkout/success?orderId=${order._id}`);
    } catch (er) {
      setErr(er.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return <div className="max-w-xl mx-auto px-4 py-16 text-cream-muted">Loading…</div>;

  if (!items.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-cream">
        <p>Cart is empty.</p>
        <Link href="/products" className="text-gold hover:text-gold-light transition-colors mt-4 inline-block">
          Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl mb-2 text-cream">Checkout</h1>
      <p className="text-sm text-cream-muted mb-8">
        {isAuthenticated ? (
          <>Signed in as <strong className="text-cream">{user?.name}</strong>. This order will appear in your history.</>
        ) : (
          <>
            <Link href="/login" className="text-gold font-medium hover:text-gold-light transition-colors">
              Sign in
            </Link>{' '}
            to save this order to your account.
          </>
        )}
      </p>
      <p className="mb-6 text-cream/90">
        Subtotal: <strong className="text-gold">${total.toFixed(2)}</strong>
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="customerName"
          required
          placeholder="Full name"
          defaultValue={user?.name || ''}
          className="w-full border border-white/10 rounded-xl px-4 py-3 bg-white/5 text-cream placeholder:text-cream-muted focus:ring-2 focus:ring-gold/40 focus:border-gold/50 outline-none transition"
        />
        <input
          name="customerEmail"
          type="email"
          required
          placeholder="Email"
          defaultValue={user?.email || ''}
          className="w-full border border-white/10 rounded-xl px-4 py-3 bg-white/5 text-cream placeholder:text-cream-muted focus:ring-2 focus:ring-gold/40 focus:border-gold/50 outline-none transition"
        />
        <textarea
          name="shippingAddress"
          required
          rows={3}
          placeholder="Shipping address"
          className="w-full border border-white/10 rounded-xl px-4 py-3 bg-white/5 text-cream placeholder:text-cream-muted focus:ring-2 focus:ring-gold/40 focus:border-gold/50 outline-none transition resize-none"
        />
        <input
          name="offerCode"
          placeholder="Offer code (optional)"
          className="w-full border border-white/10 rounded-xl px-4 py-3 bg-white/5 text-cream placeholder:text-cream-muted focus:ring-2 focus:ring-gold/40 focus:border-gold/50 outline-none transition"
        />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full py-3.5"
        >
          {loading ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </div>
  );
}

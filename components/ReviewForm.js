'use client';

import { useState } from 'react';
import { submitReview } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    const fd = new FormData(e.target);
    setLoading(true);
    try {
      await submitReview({
        productId,
        customerName: fd.get('customerName'),
        customerEmail: fd.get('customerEmail'),
        rating: fd.get('rating'),
        comment: fd.get('comment'),
      });
      e.target.reset();
      router.refresh();
    } catch (er) {
      setErr(er.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        name="customerName"
        required
        placeholder="Your name"
        className="w-full border border-white/10 rounded-xl px-3 py-2.5 bg-white/5 text-cream placeholder:text-cream-muted focus:ring-2 focus:ring-gold/40 focus:outline-none"
      />
      <input
        name="customerEmail"
        type="email"
        placeholder="Email (optional)"
        className="w-full border border-white/10 rounded-xl px-3 py-2.5 bg-white/5 text-cream placeholder:text-cream-muted focus:ring-2 focus:ring-gold/40 focus:outline-none"
      />
      <select
        name="rating"
        required
        className="w-full border border-white/10 rounded-xl px-3 py-2.5 bg-white/5 text-cream focus:ring-2 focus:ring-gold/40 focus:outline-none"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} stars
          </option>
        ))}
      </select>
      <textarea
        name="comment"
        rows={3}
        placeholder="Comment"
        className="w-full border border-white/10 rounded-xl px-3 py-2.5 bg-white/5 text-cream placeholder:text-cream-muted focus:ring-2 focus:ring-gold/40 focus:outline-none resize-none"
      />
      {err && <p className="text-sm text-red-400">{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold px-6 py-2.5 disabled:opacity-50"
      >
        {loading ? 'Sending…' : 'Submit review'}
      </button>
    </form>
  );
}

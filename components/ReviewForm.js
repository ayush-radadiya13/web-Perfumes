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
        className="w-full border rounded px-3 py-2"
      />
      <input name="customerEmail" type="email" placeholder="Email (optional)" className="w-full border rounded px-3 py-2" />
      <select name="rating" required className="w-full border rounded px-3 py-2">
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} stars
          </option>
        ))}
      </select>
      <textarea name="comment" rows={3} placeholder="Comment" className="w-full border rounded px-3 py-2" />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-plum text-cream rounded disabled:opacity-50"
      >
        {loading ? 'Sending…' : 'Submit review'}
      </button>
    </form>
  );
}

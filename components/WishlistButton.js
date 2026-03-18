'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useWishlist } from './WishlistProvider';

export default function WishlistButton({ productId, className = '' }) {
  const { isAuthenticated, mounted } = useAuth();
  const { isInWishlist, toggle, loading } = useWishlist();
  const router = useRouter();
  const [animating, setAnimating] = useState(false);
  const [busy, setBusy] = useState(false);

  const active = isInWishlist(productId);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!mounted || !isAuthenticated) {
      router.push('/login?next=/wishlist');
      return;
    }
    setBusy(true);
    setAnimating(true);
    try {
      await toggle(productId);
    } catch (err) {
      if (err?.message === 'LOGIN_REQUIRED') router.push('/login');
    } finally {
      setBusy(false);
      setTimeout(() => setAnimating(false), 320);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy || loading}
      title={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`
        flex h-10 w-10 items-center justify-center rounded-full
        bg-cream/90 text-lg shadow-md backdrop-blur-sm
        border border-ink/10 transition-all duration-200
        hover:bg-white hover:border-plum/30 hover:shadow-lg
        disabled:opacity-60
        ${animating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
    >
      <span
        className={`inline-block transition-transform duration-200 ${animating ? 'scale-110' : ''}`}
        aria-hidden
      >
        {active ? '❤️' : '♡'}
      </span>
    </button>
  );
}

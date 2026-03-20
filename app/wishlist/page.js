'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { useWishlist } from '../../components/WishlistProvider';
import { useCart } from '../../components/CartProvider';
import { BASE } from '../../lib/api';
import { formatINR } from '../../lib/currency';

function imgUrl(src) {
  if (!src) return '/placeholder.jpg';
  if (src.startsWith('http')) return src;
  return `${BASE}${src.startsWith('/') ? '' : '/'}${src}`;
}

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, mounted } = useAuth();
  const { products, remove, clear, loading, hydrated, saleAlerts } = useWishlist();
  const { add } = useCart();

  useEffect(() => {
    if (!mounted || !hydrated) return;
    if (!isAuthenticated) router.replace('/login?next=/wishlist');
  }, [mounted, hydrated, isAuthenticated, router]);

  if (!mounted || !hydrated || !isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-cream-muted">
        {loading ? 'Loading your wishlist…' : 'Checking session…'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-cream">Your wishlist</h1>
          <p className="text-cream-muted mt-2 text-sm">Saved fragrances, synced across devices.</p>
        </div>
        {products.length > 0 && (
          <button
            type="button"
            onClick={() => clear()}
            className="text-sm text-gold hover:text-gold-light transition-colors"
          >
            Clear wishlist
          </button>
        )}
      </div>

      {saleAlerts.length > 0 && (
        <div className="mb-8 p-4 rounded-xl glass-card border-gold/30 text-sm">
          <p className="font-medium text-cream mb-2">✨ On sale now</p>
          <ul className="space-y-1 text-cream/80">
            {saleAlerts.map((p) => (
              <li key={p._id}>
                <Link href={`/products/${p.slug}`} className="text-gold hover:text-gold-light transition-colors">
                  {p.name}
                </Link>{' '}
                — now {formatINR(p.price)}
                {p.compareAtPrice != null && (
                  <span className="line-through text-cream-muted ml-1">
                    {formatINR(p.compareAtPrice)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!products.length ? (
        <div className="text-center py-20 border border-dashed border-white/20 rounded-xl glass-card">
          <p className="text-4xl mb-4" aria-hidden>
            ♡
          </p>
          <p className="text-cream-muted mb-6">Your wishlist is empty.</p>
          <Link href="/products" className="btn-gold inline-block px-8 py-3">
            Discover perfumes
          </Link>
        </div>
      ) : (
        <ul className="space-y-6">
          {products.map((p) => (
            <li
              key={p._id}
              className="flex gap-4 sm:gap-6 p-4 rounded-xl glass-card hover:shadow-gold-glow-sm transition-all duration-300"
            >
              <Link
                href={`/products/${p.slug}`}
                className="relative w-24 h-32 sm:w-28 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/5"
              >
                {p.images?.[0] ? (
                  <Image
                    src={imgUrl(p.images[0])}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-cream-muted/50">
                    No image
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Link href={`/products/${p.slug}`}>
                    <h2 className="font-display text-lg text-cream hover:text-gold transition-colors">{p.name}</h2>
                  </Link>
                  <p className="text-xs text-gold/90 uppercase tracking-wider mt-1">{p.category?.name}</p>
                  <p className="mt-2 font-semibold text-gold">{formatINR(p.price)}</p>
                  {p.stock <= 0 && (
                    <p className="text-xs text-red-400 mt-1">Out of stock</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={p.stock <= 0}
                    onClick={() => add(p, 1)}
                    className="btn-gold px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Move to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p._id)}
                    className="px-4 py-2 border border-white/20 text-cream text-sm rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

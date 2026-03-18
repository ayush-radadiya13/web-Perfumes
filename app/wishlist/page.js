'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { useWishlist } from '../../components/WishlistProvider';
import { useCart } from '../../components/CartProvider';
import { BASE } from '../../lib/api';

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
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-ink/50">
        {loading ? 'Loading your wishlist…' : 'Checking session…'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-ink">Your wishlist</h1>
          <p className="text-ink/50 mt-2 text-sm">Saved fragrances, synced across devices.</p>
        </div>
        {products.length > 0 && (
          <button
            type="button"
            onClick={() => clear()}
            className="text-sm text-plum hover:underline transition"
          >
            Clear wishlist
          </button>
        )}
      </div>

      {saleAlerts.length > 0 && (
        <div className="mb-8 p-4 rounded-lg border border-gold/40 bg-gold/5 text-sm">
          <p className="font-medium text-ink mb-2">✨ On sale now</p>
          <ul className="space-y-1 text-ink/80">
            {saleAlerts.map((p) => (
              <li key={p._id}>
                <Link href={`/products/${p.slug}`} className="text-plum hover:underline">
                  {p.name}
                </Link>{' '}
                — now ${Number(p.price).toFixed(2)}
                {p.compareAtPrice != null && (
                  <span className="line-through text-ink/40 ml-1">
                    ${Number(p.compareAtPrice).toFixed(2)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!products.length ? (
        <div className="text-center py-20 border border-dashed border-ink/15 rounded-xl bg-cream/50">
          <p className="text-4xl mb-4" aria-hidden>
            ♡
          </p>
          <p className="text-ink/60 mb-6">Your wishlist is empty.</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-ink text-cream font-semibold rounded-sm hover:bg-plum transition"
          >
            Discover perfumes
          </Link>
        </div>
      ) : (
        <ul className="space-y-6">
          {products.map((p) => (
            <li
              key={p._id}
              className="flex gap-4 sm:gap-6 p-4 rounded-xl border border-ink/10 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/products/${p.slug}`}
                className="relative w-24 h-32 sm:w-28 sm:h-36 shrink-0 rounded-lg overflow-hidden bg-ink/5"
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
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-ink/30">
                    No image
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Link href={`/products/${p.slug}`}>
                    <h2 className="font-display text-lg text-ink hover:text-plum transition">{p.name}</h2>
                  </Link>
                  <p className="text-xs text-plum uppercase tracking-wider mt-1">{p.category?.name}</p>
                  <p className="mt-2 font-semibold text-gold">${Number(p.price).toFixed(2)}</p>
                  {p.stock <= 0 && (
                    <p className="text-xs text-red-600 mt-1">Out of stock</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={p.stock <= 0}
                    onClick={() => {
                      add(p, 1);
                    }}
                    className="px-4 py-2 bg-ink text-cream text-sm font-medium rounded-lg hover:bg-plum transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Move to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p._id)}
                    className="px-4 py-2 border border-ink/15 text-sm rounded-lg hover:bg-ink/5 transition"
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

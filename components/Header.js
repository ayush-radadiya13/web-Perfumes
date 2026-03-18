'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { useAuth } from './AuthProvider';
import { useWishlist } from './WishlistProvider';

export default function Header() {
  const { items } = useCart();
  const { user, isAuthenticated, logout, mounted } = useAuth();
  const { count: wishCount } = useWishlist();
  const [open, setOpen] = useState(false);

  const count = items.reduce((n, x) => n + x.quantity, 0);

  return (
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-ink/10">
        <div className="max-w-8xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="font-display text-xl tracking-wide text-ink shrink-0">
            Lumière <span className="text-gold">Parfums</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium flex-wrap justify-end">

            <Link href="/" className="hover:text-plum transition hidden sm:inline">Home</Link>
            <Link href="/products" className="hover:text-plum transition hidden sm:inline">Shop</Link>
            <Link href="/categories" className="hover:text-plum transition hidden md:inline">Categories</Link>
            <Link href="/collections" className="hover:text-plum transition hidden lg:inline">Collections</Link>
            <Link href="/orders" className="hover:text-plum transition">Orders</Link>
            <Link
              href="/wishlist"
              className="relative hover:text-plum transition inline-flex items-center gap-1"
              title="Wishlist"
            >
              <span className="text-base" aria-hidden>
                ♡
              </span>
              {wishCount > 0 && (
                <span className="text-xs font-semibold bg-plum/15 text-plum px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
                href="/cart"
                className="relative px-3 py-1 rounded-full bg-ink text-cream hover:bg-plum transition shrink-0"
            >
              Cart {count > 0 && <span className="ml-1 opacity-80">({count})</span>}
            </Link>
            {!mounted ? null : isAuthenticated ? (
                <div className="relative">
                  <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 text-ink/70 hover:text-plum transition"
                  >
                    👤 <span className="hidden sm:inline">{user?.name}</span>
                  </button>

                  {open && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                        <Link
                            href="/orders"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => setOpen(false)}
                        >
                          My Orders
                        </Link>

                        <button
                            onClick={() => {
                              logout();
                              setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                        >
                          Logout
                        </button>
                      </div>
                  )}
                </div>
            ) : (
                <div className="relative">
                  <button
                      onClick={() => setOpen(!open)}
                      className="text-ink/70 hover:text-plum transition"
                  >
                    Account
                  </button>

                  {open && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                        <Link
                            href="/login"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => setOpen(false)}
                        >
                          Login
                        </Link>

                        <Link
                            href="/register"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => setOpen(false)}
                        >
                          Register
                        </Link>
                      </div>
                  )}
                </div>
            )}


          </nav>
        </div>
      </header>
  );
}
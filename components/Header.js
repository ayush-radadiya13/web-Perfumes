'use client';

import Link from 'next/link';
import {useState} from 'react';
import {useCart} from './CartProvider';
import {useAuth} from './AuthProvider';
import {useWishlist} from './WishlistProvider';

export default function Header() {
    const {items} = useCart();
    const {user, isAuthenticated, logout, mounted} = useAuth();
    const {count: wishCount} = useWishlist();
    const [open, setOpen] = useState(false);

    const count = items.reduce((n, x) => n + x.quantity, 0);

    return (
        <header className="sticky top-0 z-50 glass border-b border-white/[0.08]">
            <div className="max-w-8xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* LEFT - Logo */}
                <div className="flex-shrink-0">
                    <Link
                        href="/"
                        className="font-display text-xl tracking-wide text-cream hover:text-gold transition-colors duration-300"
                    >
                        Lumière <span className="text-gold">Perfumes</span>
                    </Link>
                </div>

                {/* CENTER - Navigation */}
                <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
                    <Link href="/" className="text-cream/90 hover:text-gold transition-colors">
                        Home
                    </Link>
                    <Link href="/products" className="text-cream/90 hover:text-gold transition-colors">
                        Shop
                    </Link>
                    <Link href="/categories" className="text-cream/90 hover:text-gold transition-colors">
                        Categories
                    </Link>
                    <Link href="/collections" className="text-cream/90 hover:text-gold transition-colors">
                        Collections
                    </Link>
                    <Link href="/orders" className="text-cream/90 hover:text-gold transition-colors">
                        Orders
                    </Link>
                </nav>

                {/* RIGHT - Actions */}
                <div className="flex items-center gap-4">

                    {/* Wishlist */}
                    <Link
                        href="/wishlist"
                        className="relative hover:text-gold transition-colors inline-flex items-center gap-1"
                    >
                        <span className="text-3xl">♡</span>
                        {wishCount > 0 && (
                            <span className="text-xs font-semibold bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">
          {wishCount}
        </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative inline-flex items-center justify-center p-2 text-white hover:text-gold transition-colors"
                        aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                            <path d="M3 6h18" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {count > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold/20 text-xs font-semibold text-gold px-1.5">
                                {count > 99 ? '99+' : count}
                            </span>
                        )}
                    </Link>

                    {/* Account */}
                    {!mounted ? null : isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 text-cream-muted hover:text-gold"
                            >
                                👤 <span className="hidden sm:inline">{user?.name}</span>
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-40 glass-card rounded-xl overflow-hidden z-50">
                                    <Link
                                        href="/orders"
                                        className="block px-4 py-2.5 hover:bg-white/10 text-sm text-cream"
                                        onClick={() => setOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-white/10 text-sm text-red-400"
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
                                className="text-cream-muted hover:text-gold"
                            >
                                Account
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-40 glass-card rounded-xl overflow-hidden z-50">
                                    <Link
                                        href="/login"
                                        className="block px-4 py-2.5 hover:bg-white/10 text-sm text-cream"
                                        onClick={() => setOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-4 py-2.5 hover:bg-white/10 text-sm text-cream"
                                        onClick={() => setOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

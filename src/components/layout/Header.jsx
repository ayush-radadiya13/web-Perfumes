"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/20 bg-[#0f0f12]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-xl tracking-wide text-amber-100">
          Lumière <span className="text-amber-500">Parfums</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-stone-300">
          <Link href="/shop" className="hover:text-amber-400 transition">
            Shop
          </Link>
          <Link href="/collections" className="hover:text-amber-400 transition">
            Collections
          </Link>
          <Link href="/cart" className="relative hover:text-amber-400 transition">
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-xs text-black">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link href="/orders" className="hover:text-amber-400 transition">
                Orders
              </Link>
              <span className="text-stone-500">{user.name}</span>
              <button type="button" onClick={logout} className="text-amber-500 hover:text-amber-300">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-amber-400 transition">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-amber-600/50 px-4 py-1.5 text-amber-400 hover:bg-amber-600/10"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { imageUrl } from "@/lib/api";

export default function CartPage() {
  const { items, remove, setQty, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-2xl text-stone-100">Your cart is empty</h1>
        <Link href="/shop" className="mt-6 inline-block text-amber-500 hover:text-amber-400">
          Continue shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-stone-100">Cart</h1>
      <ul className="mt-8 divide-y divide-stone-800">
        {items.map((line) => (
          <li key={line.productId} className="flex gap-4 py-6">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-900">
              <Image
                src={imageUrl(line.image)}
                alt={line.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${line.productId}`} className="font-medium text-stone-200 hover:text-amber-400">
                {line.name}
              </Link>
              <p className="text-amber-500">${line.price.toFixed(2)}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => setQty(line.productId, Number(e.target.value))}
                  className="w-16 rounded border border-stone-700 bg-stone-900 px-2 py-1 text-sm"
                />
                <button type="button" onClick={() => remove(line.productId)} className="text-sm text-red-400">
                  Remove
                </button>
              </div>
            </div>
            <p className="text-stone-300">${(line.price * line.quantity).toFixed(2)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-between border-t border-stone-800 pt-6">
        <button type="button" onClick={clear} className="text-sm text-stone-500 hover:text-stone-400">
          Clear cart
        </button>
        <p className="text-xl text-stone-100">
          Total: <span className="text-amber-500">${total.toFixed(2)}</span>
        </p>
      </div>
      <Link
        href="/checkout"
        className="mt-8 block w-full rounded-full bg-amber-600 py-3 text-center font-medium text-black hover:bg-amber-500"
      >
        Checkout
      </Link>
    </div>
  );
}

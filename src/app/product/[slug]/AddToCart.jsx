"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCart({ productId, name, price, image }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        className="w-20 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-stone-200"
      />
      <button
        type="button"
        onClick={() => {
          add({ productId, name, price, image, quantity: qty });
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        }}
        className="rounded-full bg-amber-600 px-8 py-3 font-medium text-black hover:bg-amber-500"
      >
        Add to cart
      </button>
      {done && <span className="text-sm text-green-500">Added!</span>}
    </div>
  );
}

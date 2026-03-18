"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { API, authHeaders } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formKeys = ["fullName", "line1", "city", "postalCode", "country"];

export default function CheckoutPage() {
  const { user, token } = useAuth();
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-stone-400">Please log in to checkout.</p>
        <Link href="/login" className="mt-4 inline-block text-amber-500">
          Log in
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-stone-400">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block text-amber-500">
          Shop
        </Link>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const body = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: form,
      };
      const r = await fetch(`${API}/orders`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Order failed");
      clear();
      router.push("/orders");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-stone-100">Checkout</h1>
      <p className="mt-2 text-stone-500">Total: ${total.toFixed(2)}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {formKeys.map((k) => (
          <div key={k}>
            <label className="block text-xs text-stone-500 capitalize">{k.replace("line1", "Address")}</label>
            <input
              required
              className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-stone-200"
              value={form[k]}
              onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
            />
          </div>
        ))}
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber-600 py-3 font-medium text-black disabled:opacity-50"
        >
          {loading ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}

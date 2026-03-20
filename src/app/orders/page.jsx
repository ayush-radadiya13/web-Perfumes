"use client";

import { useAuth } from "@/context/AuthContext";
import { API, authHeaders } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/currency";

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/orders/my`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((j) => setOrders(j.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Link href="/login" className="text-amber-500">
          Log in to see orders
        </Link>
      </div>
    );
  }

  if (loading) return <div className="p-20 text-center text-stone-500">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-stone-100">My orders</h1>
      <ul className="mt-8 space-y-6">
        {orders.map((o) => (
          <li key={o._id} className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="text-stone-400">{new Date(o.createdAt).toLocaleString()}</span>
              <span className="rounded bg-stone-800 px-2 py-0.5 text-xs uppercase text-amber-500">{o.status}</span>
            </div>
            <p className="mt-2 text-lg text-amber-500">${o.totalAmount.toFixed(2)}</p>
            <ul className="mt-4 text-sm text-stone-400">
              {o.items.map((i, idx) => (
                <li key={idx}>
                  {i.name} × {i.quantity} @ {formatINR(i.price)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {orders.length === 0 && <p className="mt-8 text-stone-500">No orders yet.</p>}
    </div>
  );
}

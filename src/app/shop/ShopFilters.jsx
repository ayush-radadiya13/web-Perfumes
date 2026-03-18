"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function ShopFilters({ categories }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  function setFilter(key, value) {
    const n = new URLSearchParams(sp.toString());
    if (value) n.set(key, value);
    else n.delete(key);
    start(() => router.push(`/shop?${n}`));
  }

  return (
    <div className="mt-6 flex flex-wrap items-end gap-4">
      <div>
        <label className="block text-xs text-stone-500">Category</label>
        <select
          className="mt-1 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-200"
          value={sp.get("category") || ""}
          onChange={(e) => setFilter("category", e.target.value)}
          disabled={pending}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setFilter("search", String(fd.get("search") || ""));
        }}
      >
        <input
          name="search"
          defaultValue={sp.get("search") || ""}
          placeholder="Search..."
          className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600"
        />
        <button
          type="submit"
          className="rounded-lg bg-amber-600/90 px-4 py-2 text-sm font-medium text-black"
        >
          Search
        </button>
      </form>
    </div>
  );
}

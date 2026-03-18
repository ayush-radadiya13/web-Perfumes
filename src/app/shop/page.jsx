import { Suspense } from "react";
import { API } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import ShopFilters from "./ShopFilters";

async function fetchProducts(searchParams) {
  const q = new URLSearchParams();
  q.set("limit", "24");
  if (searchParams.category) q.set("category", searchParams.category);
  if (searchParams.collection) q.set("collection", searchParams.collection);
  if (searchParams.search) q.set("search", searchParams.search);
  const r = await fetch(`${API}/products?${q}`, { next: { revalidate: 30 } });
  if (!r.ok) return { data: [], total: 0 };
  return r.json();
}

async function fetchCategories() {
  const r = await fetch(`${API}/categories`, { next: { revalidate: 300 } });
  if (!r.ok) return [];
  const j = await r.json();
  return j.data || [];
}

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;
  const [{ data, total }, categories] = await Promise.all([fetchProducts(sp), fetchCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-stone-100">Shop</h1>
      <p className="mt-2 text-stone-500">{total} products</p>
      <Suspense fallback={null}>
        <ShopFilters categories={categories} />
      </Suspense>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
      </div>
      {data.length === 0 && <p className="mt-8 text-stone-500">No products match your filters.</p>}
    </div>
  );
}

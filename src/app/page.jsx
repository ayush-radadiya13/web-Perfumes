import Link from "next/link";
import { API } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

async function getFeatured() {
  try {
    const r = await fetch(`${API}/products?featured=true&limit=8`, { next: { revalidate: 60 } });
    if (!r.ok) return [];
    const j = await r.json();
    return j.data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const featured = await getFeatured();

  return (
    <>
      <section className="relative overflow-hidden border-b border-amber-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600/80">Art of scent</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-light tracking-tight text-stone-100 sm:text-6xl">
            Perfumes that define your presence
          </h1>
          <p className="mt-6 max-w-lg text-stone-400">
            Explore floral, woody, and fresh compositions. Secure checkout and fast delivery.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-amber-600 px-8 py-3 text-sm font-medium text-black transition hover:bg-amber-500"
            >
              Shop all
            </Link>
            <Link
              href="/collections"
              className="rounded-full border border-stone-600 px-8 py-3 text-sm text-stone-300 hover:border-amber-600/50"
            >
              Collections
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl text-stone-100">Featured</h2>
          <Link href="/shop" className="text-sm text-amber-500 hover:text-amber-400">
            View all →
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.length === 0 ? (
            <p className="col-span-full text-stone-500">
              No products yet. Start the API and run <code className="text-amber-600">npm run seed</code> in backend.
            </p>
          ) : (
            featured.map((p) => <ProductCard key={p._id} p={p} />)
          )}
        </div>
      </section>
    </>
  );
}

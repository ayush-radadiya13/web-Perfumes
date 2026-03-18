import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { API, imageUrl } from "@/lib/api";
import AddToCart from "./AddToCart";

async function getProduct(slug) {
  const r = await fetch(`${API}/products/${slug}`, { next: { revalidate: 60 } });
  if (!r.ok) return null;
  const j = await r.json();
  return j.data;
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const img = imageUrl(p.images?.[0]);
  const cat = p.category?.name;
  const col = p.collection?.name;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/shop" className="text-sm text-amber-500 hover:text-amber-400">
        ← Back to shop
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-900">
          <Image
            src={img}
            alt={p.name}
            fill
            className="object-cover"
            priority
            unoptimized={img.includes("localhost") || img.endsWith(".svg")}
          />
        </div>
        <div>
          <p className="text-sm text-amber-600">{cat}</p>
          <h1 className="mt-2 font-serif text-3xl text-stone-100 sm:text-4xl">{p.name}</h1>
          {col && <p className="mt-1 text-sm text-stone-500">Collection: {col}</p>}
          <p className="mt-4 text-2xl text-amber-500">${Number(p.price).toFixed(2)}</p>
          {p.ratingCount > 0 && (
            <p className="mt-2 text-stone-400">
              ★ {Number(p.rating).toFixed(1)} <span className="text-stone-600">({p.ratingCount} reviews)</span>
            </p>
          )}
          <p className="mt-6 leading-relaxed text-stone-400">{p.description}</p>
          <p className="mt-4 text-sm text-stone-500">Stock: {p.stock}</p>
          <AddToCart
            productId={p._id}
            name={p.name}
            price={p.price}
            image={p.images?.[0]}
          />
        </div>
      </div>
    </div>
  );
}

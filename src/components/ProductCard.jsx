import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/api";

export function ProductCard({ p }) {
  const src = imageUrl(p.images?.[0]);
  return (
    <Link
      href={`/product/${p.slug}`}
      className="group block overflow-hidden rounded-2xl border border-amber-900/20 bg-gradient-to-b from-stone-900/80 to-[#0f0f12] transition hover:border-amber-600/40"
    >
      <div className="relative aspect-[4/5] bg-stone-900">
        <Image
          src={src}
          alt={p.name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width:768px) 50vw, 25vw"
          unoptimized={src.includes("localhost") || src.endsWith(".svg")}
        />
        {p.featured && (
          <span className="absolute left-2 top-2 rounded bg-amber-600/90 px-2 py-0.5 text-xs font-medium text-black">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-stone-100 line-clamp-1">{p.name}</h3>
        <p className="mt-1 text-amber-500">${p.price.toFixed(2)}</p>
        {p.rating != null && p.rating > 0 && (
          <p className="mt-1 text-xs text-stone-500">★ {p.rating.toFixed(1)}</p>
        )}
      </div>
    </Link>
  );
}

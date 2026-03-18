import Link from "next/link";
import { API } from "@/lib/api";

async function getCollections() {
  const r = await fetch(`${API}/collections`, { next: { revalidate: 120 } });
  if (!r.ok) return [];
  const j = await r.json();
  return j.data || [];
}

export default async function CollectionsPage() {
  const list = await getCollections();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-stone-100">Collections</h1>
      <p className="mt-2 text-stone-500">Browse by curated collection</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-4 lg:grid-cols-5">
        {list.map((c) => (
          <li key={c._id}>
            <Link
              href={`/shop?collection=${c._id}`}
              className="block rounded-2xl border border-amber-900/20 bg-stone-900/50 p-6 transition hover:border-amber-600/40"
            >
              <h2 className="font-serif text-xl text-amber-100">{c.name}</h2>
              {c.description && <p className="mt-2 text-sm text-stone-500">{c.description}</p>}
              <span className="mt-4 inline-block text-sm text-amber-500">View products →</span>
            </Link>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-8 text-stone-500">No collections yet.</p>}
    </div>
  );
}

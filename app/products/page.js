import Link from 'next/link';
import { getProducts, getCategories, getCollections } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import ProductsToolbar from '../../components/ProductsToolbar';

export const revalidate = 30;

export default async function ProductsPage({ searchParams }) {
  const category = searchParams.category || '';
  const collection = searchParams.collection || '';
  const search = searchParams.q || '';
  const page = searchParams.page || '1';

  let data = { items: [], pages: 1 };
  let categories = [];
  let collections = [];
  try {
    [data, categories, collections] = await Promise.all([
      getProducts({ category, collection, search, page, limit: 12 }),
      getCategories(),
      getCollections(),
    ]);
  } catch {}

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Shop</h1>

      {/* Top bar: search left, dropdowns right */}
      <ProductsToolbar categories={categories} collections={collections} />

      {/* Product listing below controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.items?.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {data.pages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/products?page=${p}${category ? `&category=${category}` : ''}${collection ? `&collection=${collection}` : ''}${search ? `&q=${encodeURIComponent(search)}` : ''}`}
              className={`px-3 py-1 rounded border border-brown transition ${String(page) === String(p) ? 'bg-brown text-cream' : 'bg-cream text-ink hover:bg-brown hover:text-cream'}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-cream mb-6">Shop</h1>
      <p className="text-gold max-w-4xl mb-6 text-sm md:text-base leading-relaxed">
          Explore premium perfumes crafted to match your style and leave a lasting impression.      </p>


      <ProductsToolbar categories={categories} collections={collections} />

      <div className="grid grid-cols-4 md:grid-cols-4 gap-6">
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
              className={`px-4 py-2 rounded-xl border transition-all duration-200 ${String(page) === String(p) ? 'bg-gold text-[#0a0a0a] border-gold shadow-gold-glow-sm' : 'border-white/20 bg-white/5 text-cream hover:bg-white/10 hover:border-gold/40'}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

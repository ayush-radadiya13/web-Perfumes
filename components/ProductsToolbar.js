'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductsToolbar({ categories = [], collections = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentCollection = searchParams.get('collection') || '';
  const currentSearch = searchParams.get('q') || '';

  function buildUrl(updates) {
    const params = new URLSearchParams();
    const q = updates.q ?? currentSearch;
    const category = updates.category ?? currentCategory;
    const collection = updates.collection ?? currentCollection;
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    if (collection) params.set('collection', collection);
    const s = params.toString();
    return `/products${s ? `?${s}` : ''}`;
  }

  function handleCategoryChange(e) {
    const value = e.target.value || '';
    router.push(buildUrl({ category: value }));
  }

  function handleCollectionChange(e) {
    const value = e.target.value || '';
    router.push(buildUrl({ collection: value }));
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full mb-8">
      <form method="get" action="/products" className="flex gap-2 flex-1 max-w-md">
        <input type="hidden" name="category" value={currentCategory} />
        <input type="hidden" name="collection" value={currentCollection} />
        <input
          name="q"
          key={`q-${currentSearch}`}
          defaultValue={currentSearch}
          placeholder="Search perfumes..."
          className="flex-1 min-w-0 border border-white/10 rounded-xl px-4 py-2.5 bg-white/5 text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition"
        />
        <button
          type="submit"
          className="btn-gold px-5 py-2.5 shrink-0"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          id="category-filter"
          value={currentCategory}
          onChange={handleCategoryChange}
          aria-label="Category filter"
          className="products-filter-select border border-white/10 rounded-xl px-3 py-2.5 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {/*<select*/}
        {/*  id="collection-filter"*/}
        {/*  value={currentCollection}*/}
        {/*  onChange={handleCollectionChange}*/}
        {/*  aria-label="Collection filter"*/}
        {/*  className="products-filter-select border border-brown rounded-lg bg-cream text-brown px-3 py-2 min-w-[100px] focus:outline-none focus:ring-2 focus:ring-brown/30"*/}
        {/*>*/}
        {/*  <option value="">Collection</option>*/}
        {/*  {collections.map((c) => (*/}
        {/*    <option key={c._id} value={c._id}>*/}
        {/*      {c.name}*/}
        {/*    </option>*/}
        {/*  ))}*/}
        {/*</select>*/}
      </div>
    </div>
  );
}

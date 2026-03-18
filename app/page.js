import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories, getHeroSale, getMostWishlisted, BASE } from '../lib/api';
import ProductCard from '../components/ProductCard';
import HeroSaleBanner from '../components/HeroSaleBanner';

function categoryImageSrc(image) {
  if (!image || typeof image !== 'string') return '';
  if (image.startsWith('http')) return image;
  return `${BASE.replace(/\/$/, '')}${image.startsWith('/') ? '' : '/'}${image}`;
}

export const revalidate = 60;

export default async function HomePage() {
  let featured = { items: [] };
  let categories = [];
  let heroProduct = null;
  let mostWishlisted = [];
  try {
    const [f, c, heroRes, mw] = await Promise.all([
      getProducts({ limit: 8 }),
      getCategories(),
      getHeroSale(),
      getMostWishlisted({ limit: 4 }).catch(() => ({ products: [] })),
    ]);
    featured = f;
    categories = c;
    heroProduct = heroRes?.product ?? null;
    mostWishlisted = mw?.products || [];
  } catch {
    /* API down */
  }

  return (
    <div>
      <section className="relative bg-ink text-cream overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-plum via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32 relative">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Est. 2024</p>
          <h1 className="font-display text-4xl md:text-6xl max-w-2xl leading-tight">
            Curated perfumes for those who wear silence as luxury.
          </h1>
          <p className="mt-6 text-cream/70 max-w-lg">
            Explore rare compositions, seasonal collections, and offers crafted for connoisseurs.
          </p>
          <Link
            href="/products"
            className="inline-block mt-10 px-8 py-3 bg-gold text-ink font-semibold rounded-sm hover:opacity-90 transition"
          >
            Shop collection
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-display text-2xl text-ink mb-8">Browse by mood</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((c) => {
              const src = categoryImageSrc(c.image);
              return (
                <Link
                  key={c._id}
                  href={`/products?category=${c._id}`}
                  className="group relative aspect-[4/5] rounded-lg overflow-hidden border border-ink/10 bg-ink/5 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={c.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-plum/30 via-ink/20 to-gold/20 flex items-center justify-center p-4">
                      <span className="font-display text-xl text-ink/80 text-center">{c.name}</span>
                    </div>
                  )}
                  {src && (
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  )}
                  {src && (
                    <span className="absolute bottom-0 left-0 right-0 p-3 font-medium text-cream text-sm md:text-base tracking-wide">
                      {c.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-display text-2xl text-ink">Featured</h2>
          <Link href="/products" className="text-sm text-plum hover:underline">
            View all
          </Link>
        </div>
        {featured.items?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-ink/50 py-12 text-center">
            Start the API and seed products to see listings. See README.
          </p>
        )}
      </section>

      {mostWishlisted.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 border-t border-ink/10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-gold text-xs tracking-[0.25em] uppercase mb-2">Community picks</p>
              <h2 className="font-display text-2xl text-ink">Most wishlisted</h2>
            </div>
            <Link href="/products" className="text-sm text-plum hover:underline">
              Shop all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mostWishlisted.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {heroProduct && <HeroSaleBanner product={heroProduct} />}
    </div>
  );
}

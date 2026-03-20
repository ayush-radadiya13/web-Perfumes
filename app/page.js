import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories, getHeroSale, getMostWishlisted, getStorefrontOffers, BASE } from '../lib/api';
import ProductCard from '../components/ProductCard';
import HeroSaleBanner from '../components/HeroSaleBanner';
import StorefrontOffers from '../components/StorefrontOffers';

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
  let storefrontOffers = [];
  try {
    const [f, c, heroRes, mw, offRes] = await Promise.all([
      getProducts({ limit: 8 }),
      getCategories(),
      getHeroSale(),
      getMostWishlisted({ limit: 4 }).catch(() => ({ products: [] })),
      getStorefrontOffers().catch(() => ({ offers: [] })),
    ]);
    featured = f;
    categories = c;
    heroProduct = heroRes?.product ?? null;
    mostWishlisted = mw?.products || [];
    storefrontOffers = offRes?.offers || [];
  } catch {
    /* API down */
  }

  return (
    <div>
      {/* Hero: dark gradient + highlighted feel */}
      <section className="relative min-h-[20vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] " />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,163,115,0.12),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-4  relative z-10 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight text-cream">
              Curated perfumes for those who wear silence as luxury.
            </h1>

            <p className="mt-6 text-cream-muted max-w-md">
              Explore rare compositions, seasonal collections, and offers crafted for connoisseurs.
            </p>

            <Link
                href="/products"
                className="btn-gold inline-block mt-10 px-8 py-3.5 text-sm"
            >
              Shop collection
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center md:justify-end">
            <img
                src="/desbaord_perfume.png"
                alt="Perfume"
                className="w-[300px] md:w-[400px] lg:w-[480px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />
          </div>

        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 ">
          <h2 className="font-display text-2xl md:text-3xl text-cream mb-3">Browse by mood</h2>
          <p className="text-gold mb-10">
            Discover fragrances that match your mood — from bold and intense to soft and sensual.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.slice(0, 8).map((c) => {
              const src = categoryImageSrc(c.image);
              return (
                <Link
                  key={c._id}
                  href={`/products?category=${c._id}`}
                  className="group relative aspect-[4/5] rounded-none overflow-hidden glass-card hover:shadow-gold-glow-sm transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"                >
                  {src ? (
                    <Image
                      src={src}
                      alt={c.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-white/5 to-plum/20 flex items-center justify-center p-4">
                      <span className="font-display text-xl text-cream/80 text-center">{c.name}</span>
                    </div>
                  )}
                  {src && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
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

      <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
              src="/welcomeiamge.png"
              alt="Welcome"
              fill
              className="object-cover opacity-30"
              priority
          />
        </div>

        {/* Dark overlay (optional for better text visibility) */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl text-center px-4">
          <h2 className="font-display text-3xl md:text-5xl text-cream mb-6">
            Welcome to Lumière Perfumes
          </h2>

          <p className="text-cream-muted text-sm md:text-base leading-relaxed">
            Welcome to Local Face Perfumes, where the spirit of victory and triumph come alive through scents that empower and inspire. Our curated collection, aptly named "Victory Scented," is a celebration of success and elegance, designed to unleash your victorious essence. Indulge in the sweet taste of triumph with captivating fragrances that tell the tale of your achievements. At Local Face, we believe that every victory deserves a signature scent, and we are dedicated to providing unforgettable fragrances that elevate your spirit and empower your journey.
          </p>
        </div>
      </section>

      {/*<section className="max-w-7xl mx-auto px-4 py-20">*/}
      {/*  <div className="flex justify-between items-end mb-8">*/}
      {/*    <h2 className="font-display text-2xl md:text-3xl text-cream">Featured</h2>*/}
      {/*    <Link href="/products" className="text-sm text-gold hover:text-gold-light transition-colors">*/}
      {/*      View all*/}
      {/*    </Link>*/}
      {/*  </div>*/}
      {/*  {featured.items?.length ? (*/}
      {/*    <div className="grid grid-cols-3 md:grid-cols-5 gap-6">*/}
      {/*      {featured.items.map((p) => (*/}
      {/*        <ProductCard key={p._id} product={p} />*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  ) : (*/}
      {/*    <p className="text-cream-muted py-12 text-center">*/}
      {/*      Start the API and seed products to see listings. See README.*/}
      {/*    </p>*/}
      {/*  )}*/}
      {/*</section>*/}

      <StorefrontOffers offers={storefrontOffers} />

      {mostWishlisted.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 border-t border-white/10 bg-[#0d0d0d]/50">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-gold text-xs tracking-[0.25em] uppercase mb-2">Community picks</p>
              <h2 className="font-display text-2xl md:text-3xl text-cream">Most wishlisted</h2>
            </div>
            <Link href="/products" className="text-sm text-gold hover:text-gold-light transition-colors">
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
